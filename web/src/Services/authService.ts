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
      api.get({ location: "/sanctum/csrf-cookie" })?.then(
        () =>
          api.post({
            location: "/sign-up",
            body: params,
          }) as Promise<AxiosResponse>,
      );
      return;
    },
  };
}
