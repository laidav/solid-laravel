import { type AxiosResponse } from "axios";
import API from "./API";
import { type SignUpFormValue } from "../Features/Auth/SignUp";

export function AuthService(api: API) {
  return {
    signUp(params: SignUpFormValue) {
      return api.get({ location: "auth/sanctum/csrf-cookie" })?.then(
        () =>
          api.post({
            location: "auth/sign-up",
            body: params,
          }) as Promise<AxiosResponse>,
      );
    },
    login(params: SignUpFormValue) {
      return api.get({ location: "auth/sanctum/csrf-cookie" })?.then(
        () =>
          api.post({
            location: "auth/login",
            body: params,
          }) as Promise<AxiosResponse>,
      );
    },
    resendEmailVerification() {
      return api.post({
        location: "auth/verification-notification",
      }) as Promise<AxiosResponse>;
    },
    checkLoginStatus() {
      return api.get({
        location: "auth/check-login-status",
      }) as Promise<AxiosResponse>;
    },
    logout() {
      return api.post({
        location: "auth/login",
      }) as Promise<AxiosResponse>;
    },
    test() {
      return api.post({
        location: "loggedin-test",
      }) as Promise<AxiosResponse>;
    },
  };
}
