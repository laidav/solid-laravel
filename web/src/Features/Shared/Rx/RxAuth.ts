import { type Action, RxBuilder } from "@reactables/core";
import { of, from, Observable, concat } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import { AuthService } from "../../../Services/authService";

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
                  map(({ data }) => ({ type: "loginSuccess", payload: data })),
                  catchError((e) => {
                    const { response } = e;
                    const { data } = response;
                    const { errors } = data;

                    // 2-Factor Authentication Required
                    if (response.status === 302) {
                      return of({
                        type: "twoFactorAuthRequired",
                        payload: response.data.user,
                      });
                    }

                    // Locked out from too many attempts
                    if (
                      response.status === 429 &&
                      data &&
                      errors &&
                      errors.email?.length > 0
                    ) {
                      return of({ type: "lockedOut" });
                    }

                    // General login failure
                    return of({ type: "loginFailure" });
                  }),
                );
              }),
            ),
        ],
      },
      loginSuccess: (state, { payload }: Action<{ user: User }>) => ({
        ...state,
        loggingIn: false,
        isLoggedIn: true,
        currentUser: payload.user,
        lockedOut: false,
        loginFailure: null,
      }),
      loginFailure: (state) => ({
        ...state,
        loggingIn: false,
        loginFailure: true,
      }),
      lockedOut: (state) => ({
        ...state,
        lockedOut: true,
      }),
      unlock: (state) => ({
        ...state,
        lockedOut: false,
      }),
      twoFactorAuthRequired: (state, action: Action<User>) => ({
        ...state,
        currentUser: action.payload,
        loggingIn: false,
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
      logoutFailure: (state) => ({
        ...state,
        loggingOut: false,
        isLoggedIn: false,
      }),
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
