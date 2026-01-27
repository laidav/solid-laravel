import { type Action, RxBuilder, combine } from "@reactables/core";
import { of, from, Observable, concat, merge } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import { AuthService } from "../Services/AuthService";
import {
  loadableInitialState,
  RxRequest,
  passwordConfirmationHandler,
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

  const [, , passwordActions$] = rxPasswordConfirmation;

  const catchErrorHandler = passwordConfirmationHandler(
    passwordActions$.ofTypes([passwordActions$.types.sendSuccess]),
    passwordActions$.ofTypes([passwordActions$.types.resetState]),
  );

  const rxRegenerateRecoveryCodes = RxRequest({
    resource: authService.regenerateRecoveryCodes,
    catchErrorHandler,
  });

  const [, , regenCodesActions$] = rxRegenerateRecoveryCodes;

  const codesRengerated$ = regenCodesActions$.ofTypes([
    regenCodesActions$.types.sendSuccess,
  ]);

  const rxRecoveryCodes = RxRequest<unknown, { data: string[] }>({
    resource: authService.getRecoveryCodes,
    catchErrorHandler,
    sources: [codesRengerated$.pipe(map(() => ({ type: "send" })))],
  });

  const rxTwoFactorAuthentication = combine({
    enable: RxRequest({
      resource: () => authService.enableTwoFactorAuthentication(),
      catchErrorHandler,
    }),
    disable: RxRequest({
      resource: () => authService.disableTwoFactorAuthentication(),
      catchErrorHandler,
    }),
    getQrCode: RxRequest<undefined, { svg: string }>({
      resource: () => authService.twoFactorQrCode().then(({ data }) => data),
      catchErrorHandler,
    }),
    confirm: RxRequest<{ code: string }, unknown>({
      resource: (body) => authService.confirmTwoFactor(body),
      catchErrorHandler,
    }),
    regenerateRecoveryCodes: rxRegenerateRecoveryCodes,
    recoveryCodes: rxRecoveryCodes,
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
