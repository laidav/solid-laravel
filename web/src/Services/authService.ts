export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export async function createUser(payload: CreateUserPayload) {
  const res = await fetch("http://localhost:8000/api/v1/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw res;
  }

  return res.json();
}
