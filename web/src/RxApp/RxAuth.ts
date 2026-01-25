import { type Action, RxBuilder } from "@reactables/core";
import { of, from, Observable, concat } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import { AuthService } from "../Services/AuthService";

export interface User {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
}

const initialAuthState = {
  isLoggedIn: false,
  checkingLoginStatus: false,
  loggingIn: false,
  loggingOut: false,
  currentUser: null as User | null,
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

  return RxBuilder({
    name: "rxAuth",
    initialState: initialAuthState,
    sources: [checkLoginStatus$],
    debug: true,
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
      loginSuccess: (state, { payload }: Action<User>) => ({
        ...state,
        loggingIn: false,
        isLoggedIn: true,
        currentUser: payload,
        lockedOut: false,
        loginFailure: null,
      }),
      loginFailure: (state, { payload: e }: Action<any>) => {
        const { response } = e;

        // 2-Factor Authentication Required
        if (response?.status === 302) {
          return {
            ...state,
            currentUser: response.data.user as User,
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
      signUpSuccess: (state, { payload }: Action<{ user: User }>) => ({
        ...state,
        isLoggedIn: true,
        currentUser: payload.user,
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
      checkLoginStatusSuccess: (state, { payload }: Action<User>) => ({
        ...state,
        checkingLoginStatus: false,
        loggingIn: false,
        isLoggedIn: true,
        currentUser: payload,
        lockedOut: false,
        loginFailure: null,
      }),
      checkLoginStatusFailure: () => initialAuthState,
      unauthorizedResponse: {
        reducer: () => initialAuthState,
      },
    },
  });
};
