import { type Action, RxBuilder, combine } from "@reactables/core";
import { of, from, Observable, concat, merge } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import { AuthService } from "../../Services/AuthService";
import {
  loadableInitialState,
  RxRequest,
  serializeAxiosError,
  type LoadableState,
} from "../../Shared/Rx/RxRequest";
import { RxPasswordGuardedRequest } from "../../Shared/Rx/RxPasswordGuardedRequest";

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
                  map(({ data: { two_factor } }) => ({
                    type: two_factor ? "twoFactorRequired" : "loginSuccess",
                  })),
                  catchError((e) => of({ type: "loginFailure", payload: e })),
                );
              }),
            ),
        ],
      },
      twoFactorChallenge: {
        reducer: (state, _: Action<{ code: string }>) => ({
          ...state,
          loggingIn: true,
        }),
        effects: [
          (twoFactorChallenge$: Observable<Action<{ code: string }>>) =>
            twoFactorChallenge$.pipe(
              mergeMap(({ payload }) => {
                return from(authService.twoFactorChallenge(payload)).pipe(
                  map(() => ({
                    type: "loginSuccess",
                  })),
                  catchError((e) =>
                    of({
                      type: "loginFailure",
                      payload: serializeAxiosError(e),
                    }),
                  ),
                );
              }),
            ),
        ],
      },
      twoFactorRequired: (state) => ({
        ...state,
        loggingIn: false,
      }),
      loginSuccess: (state) => ({
        ...state,
        loggingIn: false,
        isLoggedIn: true,
        lockedOut: false,
        loginFailure: null,
      }),
      loginFailure: (state, { payload: e }: Action<any>) => {
        const { response } = e;

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

  /**PASSWORD CONFIRMATION **/

  const rxPasswordConfirmation = RxRequest({
    resource: authService.confirmPassword,
  });

  const [, , passwordActions$] = rxPasswordConfirmation;

  /**2FA SETTINGS */

  // Handle flows when user hits an api route requiring password confirmation
  const events$ = {
    passwordConfirmed$: passwordActions$.ofTypes([
      passwordActions$.types.sendSuccess,
    ]),
    cancelledConfirmation$: passwordActions$.ofTypes([
      passwordActions$.types.resetState,
    ]),
  };

  const rxRegenerateRecoveryCodes = RxPasswordGuardedRequest({
    resource: authService.regenerateRecoveryCodes,
    ...events$,
  });

  const [, , regenCodesActions$] = rxRegenerateRecoveryCodes;

  const codesRengerated$ = regenCodesActions$.ofTypes([
    regenCodesActions$.types.sendSuccess,
  ]);

  const rxRecoveryCodes = RxPasswordGuardedRequest<unknown, { data: string[] }>(
    {
      resource: authService.getRecoveryCodes,
      sources: [codesRengerated$.pipe(map(() => ({ type: "send" })))],
      ...events$,
    },
  );

  const rxTwoFactorAuthentication = combine({
    enable: RxPasswordGuardedRequest({
      resource: () => authService.enableTwoFactorAuthentication(),
      ...events$,
    }),
    disable: RxPasswordGuardedRequest({
      resource: () => authService.disableTwoFactorAuthentication(),
      ...events$,
    }),
    getQrCode: RxPasswordGuardedRequest<undefined, { svg: string }>({
      resource: () => authService.twoFactorQrCode().then(({ data }) => data),
      ...events$,
    }),
    confirm: RxPasswordGuardedRequest<{ code: string }, unknown>({
      resource: (body) => authService.confirmTwoFactor(body),
      ...events$,
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

  /**
   * USER PROFILE
   */
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
