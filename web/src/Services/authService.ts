import { type AxiosResponse } from "axios";
import API from "./API";
export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export function AuthService(api: API) {
  return {
    createUser(params: CreateUserPayload) {
      return api.get({ location: "auth/sanctum/csrf-cookie" })?.then(
        () =>
          api.post({
            location: "auth/sign-up",
            body: params,
          }) as Promise<AxiosResponse>,
      );
    },
    test() {
      return api.post({
        location: "loggedin-test",
      }) as Promise<AxiosResponse>;
    },
  };
}
