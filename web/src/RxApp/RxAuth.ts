import axios from "axios";
import { type Action, RxBuilder, combine } from "@reactables/core";
import { of, from, Observable, concat, merge, EMPTY } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import { AuthService } from "../Services/AuthService";
import {
  serializeAxiosError,
  loadableInitialState,
  RxRequest,
  defaultCatchErrorHandler,
  type LoadableState,
} from "../Features/Shared/Rx/RxRequest";

export interface User {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorConfirmed: boolean;
}

const initialAuthState = {
  isLoggedIn: false,
  checkingLoginStatus: false,
  loggingIn: false,
  loggingOut: false,
  loginFailure: null as boolean | null,
  lockedOut: false,
};

export const RxAuth = ({
  authService,
}: {
  authService: ReturnType<typeof AuthService>;
}) => {
  /** LOGIN **/
  const checkLoginStatus$ = concat(
    of({ type: "checkLoginStatus" }),
    from(authService.checkLoginStatus()).pipe(
      map(({ data }) => ({ type: "checkLoginStatusSuccess", payload: data })),
      catchError(() => of({ type: "checkLoginStatusFailure" })),
    ),
  );

  const rxLogin = RxBuilder({
    name: "rxAuth",
    initialState: initialAuthState,
    sources: [checkLoginStatus$],
    reducers: {
      login: {
        reducer: (state, _: Action<{ email: string; password: string }>) => ({
          ...state,
          loggingIn: true,
        }),
        effects: [
          (login$: Observable<Action<{ email: string; password: string }>>) =>
            login$.pipe(
              mergeMap(({ payload }) => {
                return from(authService.login(payload)).pipe(
                  map(({ data }) => ({
                    type: "loginSuccess",
                    payload: data,
                  })),
                  catchError((e) => of({ type: "loginFailure", payload: e })),
                );
              }),
            ),
        ],
      },
      loginSuccess: (state) => ({
        ...state,
        loggingIn: false,
        isLoggedIn: true,
        lockedOut: false,
        loginFailure: null,
      }),
      loginFailure: (state, { payload: e }: Action<any>) => {
        const { response } = e;

        // 2-Factor Authentication Required
        if (response?.status === 302) {
          return {
            ...state,
            loggingIn: false,
          };
        }

        // Locked out from too many attempts
        if (response?.status === 429) {
          return {
            ...state,
            loggingIn: false,
            lockedOut: true,
          };
        }

        // General login failure
        return {
          ...state,
          loggingIn: false,
          loginFailure: true,
        };
      },
      signUpSuccess: (state) => ({
        ...state,
        isLoggedIn: true,
      }),
      lockedOut: (state) => ({
        ...state,
        lockedOut: true,
      }),
      unlock: (state) => ({
        ...state,
        lockedOut: false,
      }),
      twoFactorAuthSuccess: (state) => ({
        ...state,
        isLoggedIn: true,
        loggingIn: false,
      }),
      resetLockout: () => initialAuthState,
      logout: {
        reducer: (state) => ({ ...state, loggingOut: true }),
        effects: [
          (logout$: Observable<Action>) =>
            logout$.pipe(
              mergeMap(() => {
                return from(authService.logout()).pipe(
                  map(() => ({
                    type: "logoutSuccess",
                  })),
                  catchError(() => of({ type: "logoutFailure" })),
                );
              }),
            ),
        ],
      },
      logoutSuccess: () => initialAuthState,
      checkLoginStatus: (state) => ({
        ...state,
        checkingLoginStatus: true,
      }),
      checkLoginStatusSuccess: (state) => ({
        ...state,
        checkingLoginStatus: false,
        loggingIn: false,
        isLoggedIn: true,
        lockedOut: false,
        loginFailure: null,
      }),
      checkLoginStatusFailure: () => initialAuthState,
      unauthorizedResponse: {
        reducer: () => initialAuthState,
      },
    },
  });

  /**Password Confirmation **/

  const rxPasswordConfirmation = RxRequest({
    resource: authService.confirmPassword,
  });

  /**2FA Settings */

  const passwordConfirmationHandler =
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

        const [, , passwordConfirmationActions$] = rxPasswordConfirmation;
        /**
         * Send appropriate actions to RxRequest state once user has acted on
         * the password confirmation.
         */
        const handlePasswordConfirmation$ = passwordConfirmationActions$.pipe(
          mergeMap((action) => {
            const { type } = action;

            if (type === passwordConfirmationActions$.types.sendSuccess) {
              return concat(
                of({ type: "passwordConfirmed" }),
                originalRequest$.pipe(
                  map((response) => ({
                    type: "sendSuccess",
                    payload: response,
                  })),
                  catchError(defaultCatchErrorHandler()),
                ),
              );
            }

            if (type === passwordConfirmationActions$.types.resetState) {
              return of({ type: "sendFailure" });
            }

            return EMPTY;
          }),
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

  const rxTwoFactorAuthentication = combine({
    enable: RxRequest({
      resource: () => authService.enableTwoFactorAuthentication(),
      catchErrorHandler: passwordConfirmationHandler,
    }),
    disable: RxRequest({
      resource: () => authService.disableTwoFactorAuthentication(),
      catchErrorHandler: passwordConfirmationHandler,
    }),
    getQrCode: RxRequest<undefined, { svg: string }>({
      resource: () => authService.twoFactorQrCode().then(({ data }) => data),
      catchErrorHandler: passwordConfirmationHandler,
    }),
    confirm: RxRequest<{ code: string }, unknown>({
      resource: (body) => authService.confirmTwoFactor(body),
      catchErrorHandler: passwordConfirmationHandler,
    }),
  });

  const [, , loginActions$] = rxLogin;
  const [, , twoFactorActions$] = rxTwoFactorAuthentication;

  const refreshUser$ = merge(
    loginActions$.ofTypes([
      loginActions$.types.loginSuccess,
      loginActions$.types.signUpSuccess,
    ]),
    twoFactorActions$.ofTypes([
      twoFactorActions$.types["[enable] - sendSuccess"],
      twoFactorActions$.types["[confirm] - sendSuccess"],
      twoFactorActions$.types["[disable] - sendSuccess"],
    ]),
  ).pipe(map(() => ({ type: "send" })));

  const rxUser = RxRequest<undefined, User | null>({
    resource: () => authService.getCurrentUser().then(({ data }) => data),
    initialState: {
      ...(loadableInitialState as LoadableState<User | null>),
      loading: true,
    },
    sources: [
      refreshUser$,
      loginActions$.ofTypes([
        loginActions$.types.checkLoginStatusSuccess,
        loginActions$.types.checkLoginStatusFailure,
        loginActions$.types.logoutSuccess,
      ]),
    ],
    reducers: {
      [loginActions$.types.checkLoginStatusSuccess]: (state, action) => ({
        ...state,
        data: action.payload,
        loading: false,
      }),
      [loginActions$.types.checkLoginStatusFailure]: (state) => ({
        ...state,
        loading: false,
      }),
      [loginActions$.types.logoutSuccess]: () =>
        loadableInitialState as LoadableState<User | null>,
    },
  });

  return combine({
    twoFactorAuthentication: rxTwoFactorAuthentication,
    login: rxLogin,
    user: rxUser,
    passwordConfirmation: rxPasswordConfirmation,
  });
};
