export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export async function createUser(payload: CreateUserPayload) {
  const res = await fetch("http://localhost:8000/api/v1/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
