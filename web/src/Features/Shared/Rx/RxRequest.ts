import { type Action, RxBuilder } from "@reactables/core";
import { type OperatorFunction, Observable, from, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

interface LoadableState<T> {
  data: T;
  loading: boolean;
  success: boolean;
  error: unknown;
}

const loadableInitialState = {
  loading: false,
  data: null,
  success: false,
  error: null,
};

interface RequestOptionsBase<Data> {
  name?: string;
  initialState?: LoadableState<Data>;
  sources?: Observable<Action<any>>[];
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
  } = options;

  let effect: OperatorFunction<Action<RequestPayload>, Observable<any>>;

  if ((options as RequestOptionsWithEffect<RequestPayload, Data>).effect) {
    effect = (options as RequestOptionsWithEffect<RequestPayload, Data>).effect;
  } else {
    effect = (actions$: Observable<Action<RequestPayload>>) =>
      actions$.pipe(
        map(({ payload }) =>
          from(
            (
              options as RequestOptionsWithResource<RequestPayload, Data>
            ).resource(payload as RequestPayload),
          ),
        ),
      );
  }
  return RxBuilder({
    name,
    initialState,
    sources,
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
                  catchError(() => of({ type: "sendFailure" })),
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
      }),
      resetState: () => loadableInitialState as LoadableState<Data>,
    },
  });
};
