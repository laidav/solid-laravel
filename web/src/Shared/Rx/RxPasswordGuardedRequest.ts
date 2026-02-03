import axios from "axios";
import { type Action } from "@reactables/core";
import {
  defaultCatchErrorHandler,
  serializeAxiosError,
  loadableInitialState,
  type LoadableState,
  type RequestOptions,
  RxRequest,
} from "./RxRequest";
import { mergeMap, catchError } from "rxjs/operators";
import { Observable, of, concat, merge, map } from "rxjs";

export type PasswordGuardedLoadableState<T> = {
  requiresPasswordConfirmation: boolean;
} & LoadableState<T>;

export type PasswordGuardedRequestOptions<RequestPayload, Response> = {
  passwordConfirmed$: Observable<any>;
  cancelledConfirmation$: Observable<any>;
} & RequestOptions<RequestPayload, Response>;

const initialState = {
  ...loadableInitialState,
  requiresPasswordConfirmation: false,
};

export const RxPasswordGuardedRequest = <RequestPayload, Response>({
  passwordConfirmed$,
  cancelledConfirmation$,
  ...baseOptions
}: PasswordGuardedRequestOptions<RequestPayload, Response>) =>
  RxRequest({
    ...baseOptions,
    initialState,
    reducers: {
      passwordConfirmed: (state) => ({
        ...state,
        requiresPasswordConfirmation: false,
      }),
      requiresPasswordConfirmation: (state) => ({
        ...state,
        requiresPasswordConfirmation: true,
      }),
      sendFailure: (state, action: Action<any>) => ({
        ...state,
        loading: false,
        success: false,
        error: action.payload,
        requiresPasswordConfirmation: false,
      }),
      resetState: () => initialState as PasswordGuardedLoadableState<Response>,
      ...(baseOptions.reducers ? baseOptions.reducers : {}),
    },
    catchErrorHandler:
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
            passwordConfirmed$.pipe(
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
            cancelledConfirmation$.pipe(
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
      },
  });
