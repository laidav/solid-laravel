import API from "./API";
export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export function userService(api: API) {
  return {
    createUser(params: CreateUserPayload) {
      return api.post({ location: "/sign-up", body: params });
    },
  };
}
