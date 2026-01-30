import axios from "axios";
import { type Action, RxBuilder } from "@reactables/core";
import {
  type OperatorFunction,
  type Observable,
  from,
  of,
  defer,
  merge,
  concat,
} from "rxjs";
import { catchError, map, switchMap, mergeMap } from "rxjs/operators";

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

/**
 * @description default request error handler
 */
export const defaultCatchErrorHandler = (_?: Observable<any>) => (e: any) =>
  of({
    type: "sendFailure",
    payload: serializeAxiosError(e),
  }) as Observable<Action<any>>;

/**
 * @description handles requests that require password confirmation
 */
export const passwordConfirmationHandler =
  (
    passwordConfirmSuccess$: Observable<any>,
    passwordConfirmCancelled$: Observable<any>,
  ) =>
  (originalRequest$?: Observable<any>) =>
  (e: any): Observable<Action<any>> => {
    if (!originalRequest$) {
      return defaultCatchErrorHandler()(e);
    }

    if (axios.isAxiosError(e) && e.response?.status === 423) {
      /**
       * Signal RxRequest that password confirmation is required
       */
      const requiresPasswordConfirmation$ = of({
        type: "requiresPasswordConfirmation",
      });

      /**
       * Send appropriate actions to RxRequest state once user has acted on
       * the password confirmation.
       */
      const handlePasswordConfirmation$ = merge(
        passwordConfirmSuccess$.pipe(
          mergeMap(() =>
            concat(
              of({ type: "passwordConfirmed" }),
              // Once password confirm, try the request again
              originalRequest$.pipe(
                map((response) => ({
                  type: "sendSuccess",
                  payload: response,
                })),
                catchError(defaultCatchErrorHandler()),
              ),
            ),
          ),
        ),
        passwordConfirmCancelled$.pipe(
          mergeMap(() => of({ type: "sendFailure" })),
        ),
      );

      const flow$ = concat(
        requiresPasswordConfirmation$,
        handlePasswordConfirmation$,
      );

      return flow$;
    }

    return of({
      type: "sendFailure",
      payload: serializeAxiosError(e),
    });
  };
