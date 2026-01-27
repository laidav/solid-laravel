import axios from "axios";
import { type Action, RxBuilder } from "@reactables/core";
import { type OperatorFunction, type Observable, from, of, defer } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

export type SerializableError = {
  message: string;
  code?: string | number;
  httpStatus?: number;
  details?: unknown;
};

export const serializeAxiosError = (e: unknown): SerializableError => {
  if (axios.isAxiosError(e)) {
    return {
      message: e.response?.data?.message ?? e.message,
      httpStatus: e.response?.status,
      code: e.code,
      details: e.response?.data,
    };
  }

  if (e instanceof Error) {
    return { message: e.message };
  }

  return { message: "Unknown error" };
};

export interface LoadableState<T> {
  data: T;
  loading: boolean;
  success: boolean;
  error: SerializableError | null;
  requiresPasswordConfirmation: boolean;
}

export const loadableInitialState = {
  loading: false,
  data: null,
  success: false,
  error: null,
  requiresPasswordConfirmation: false,
};

interface RequestOptionsBase<Data> {
  name?: string;
  debug?: boolean;
  initialState?: LoadableState<Data | null>;
  catchErrorHandler?: (
    originalRequest?: Observable<any>,
  ) => (e: any) => Observable<Action<any>>;
  sources?: Observable<Action<any>>[];
  reducers?: {
    [key: string]: (
      state: LoadableState<Data>,
      action: Action<any>,
    ) => LoadableState<Data>;
  };
}

interface RequestOptionsWithEffect<
  RequestPayload,
  Data,
> extends RequestOptionsBase<Data> {
  effect: OperatorFunction<Action<RequestPayload>, Observable<any>>;
}

interface RequestOptionsWithResource<
  RequestPayload,
  Data,
> extends RequestOptionsBase<Data> {
  resource: (payload: RequestPayload) => Promise<unknown> | Observable<unknown>;
}

export type RequestOptions<RequestPayload, Data> =
  | RequestOptionsWithEffect<RequestPayload, Data>
  | RequestOptionsWithResource<RequestPayload, Data>;

export const defaultCatchErrorHandler = (_?: Observable<any>) => (e: any) =>
  of({
    type: "sendFailure",
    payload: serializeAxiosError(e),
  });

/**
 * @description Given an effect or resource,
 * RxRequest sends the request and handles loading, success and error states
 */
export const RxRequest = <RequestPayload, Data>(
  options: RequestOptions<RequestPayload, Data>,
) => {
  const {
    name = "rxRequest",
    initialState = loadableInitialState,
    sources = [],
    catchErrorHandler = defaultCatchErrorHandler,
  } = options;

  let effect: OperatorFunction<Action<RequestPayload>, Observable<any>>;

  if ((options as RequestOptionsWithEffect<RequestPayload, Data>).effect) {
    effect = (options as RequestOptionsWithEffect<RequestPayload, Data>).effect;
  } else {
    effect = (actions$: Observable<Action<RequestPayload>>) =>
      actions$.pipe(
        map(({ payload }) =>
          defer(() =>
            from(
              (
                options as RequestOptionsWithResource<RequestPayload, Data>
              ).resource(payload as RequestPayload),
            ),
          ),
        ),
      );
  }
  return RxBuilder({
    name,
    initialState,
    sources,
    debug: options.debug,
    reducers: {
      send: {
        reducer: (state, _: Action<RequestPayload>) => ({
          ...state,
          loading: true,
        }),
        effects: [
          (send$: Observable<any>) =>
            send$.pipe(
              effect,
              switchMap((request$) =>
                request$.pipe(
                  map((response) => ({
                    type: "sendSuccess",
                    payload: response,
                  })),
                  catchError(catchErrorHandler(request$)),
                ),
              ),
            ),
        ],
      },
      sendSuccess: (state, action: Action<Data>) => ({
        ...state,
        loading: false,
        data: action.payload as Data,
        success: true,
        error: null,
      }),
      sendFailure: (state, action: Action<any>) => ({
        ...state,
        loading: false,
        success: false,
        error: action.payload,
        requiresPasswordConfirmation: false,
      }),
      passwordConfirmed: (state) => ({
        ...state,
        requiresPasswordConfirmation: false,
      }),
      requiresPasswordConfirmation: (state) => ({
        ...state,
        requiresPasswordConfirmation: true,
      }),
      resetState: () => loadableInitialState as LoadableState<Data>,
      ...(options.reducers ? options.reducers : {}),
    },
  });
};
