import {
  loadableInitialState,
  type LoadableState,
  passwordConfirmationHandler,
  type RequestOptions,
  RxRequest,
} from "./RxRequest";
import { Observable } from "rxjs";

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
    catchErrorHandler: passwordConfirmationHandler(
      passwordConfirmed$,
      cancelledConfirmation$,
    ),
  });
