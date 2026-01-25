import { type AxiosResponse } from "axios";
import API from "./API";
import { type SignUpFormValue } from "../Features/Auth/SignUp";
import { type User } from "../RxApp/RxAuth";
import type { ResetPasswordFormValue } from "../Features/Auth/ResetPassword";

export function AuthService(api: API) {
  return {
    signUp(body: SignUpFormValue) {
      return api.post({
        location: "auth/sign-up",
        body,
      }) as Promise<AxiosResponse<User>>;
    },
    login(body: { email: string; password: string }) {
      return api.post({
        location: "auth/login",
        body,
      }) as Promise<AxiosResponse<User>>;
    },
    forgotPassword(body: { email: string }) {
      return api.post({
        location: "auth/forgot-password",
        body,
      }) as Promise<AxiosResponse>;
    },
    resetPassword(body: ResetPasswordFormValue) {
      return api.post({
        location: "auth/reset-password",
        body,
      }) as Promise<AxiosResponse>;
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
        location: "auth/logout",
      }) as Promise<AxiosResponse>;
    },
    enableTwoFactorAuthentication() {
      return api.post({
        location: "auth/enable-two-factor-authentication",
      }) as Promise<AxiosResponse>;
    },
    disableTwoFactorAuthentication() {
      return api.delete({
        location: "auth/enable-two-factor-authentication",
      }) as Promise<AxiosResponse>;
    },
    twoFactorQrCode() {
      return api.get({
        location: "auth/two-factor-qr-code",
      }) as Promise<AxiosResponse>;
    },
    confirmTwoFactor(body: { code: number }) {
      return api.post({
        location: "auth/confirm-two-factor",
        body,
      }) as Promise<AxiosResponse>;
    },
    getRecoveryCodes() {
      return api.get({
        location: "auth/recovery-codes",
      }) as Promise<AxiosResponse>;
    },
    regenerateRecoveryCodes() {
      return api.post({
        location: "auth/recovery-codes",
      }) as Promise<AxiosResponse>;
    },
    testAuthenticatedRoute() {
      return api.post({
        location: "loggedin-test",
      }) as Promise<AxiosResponse>;
    },
  };
}
