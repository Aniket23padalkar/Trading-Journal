import type {
  RegisterUserParams,
  RegisterUserResponse,
} from "../types/auth.types.js";

const API = import.meta.env.VITE_API_URL;

export async function registerUser(
  data: RegisterUserParams,
): Promise<RegisterUserResponse> {
  try {
    const res: Response = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      }),
      credentials: "include",
    });

    const result: RegisterUserResponse = await res.json();

    if (!res.ok) {
      throw new Error(result.message);
    }

    return result;
  } catch (err: unknown) {
    console.log(err);
    throw err;
  }
}

export async function loginUser(data) {
  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message);
    }

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getCurrentUser() {
  try {
    const res = await fetch(`${API}/api/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message);
    }

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function logoutUser() {
  try {
    const res = await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message);
    }

    return result;
  } catch (err) {
    throw err;
  }
}
