import type {
  ApiResponse,
  RegisterUserParams,
  User,
  UserSignInData,
} from "../types/auth.types.js";

const API = import.meta.env.VITE_API_URL;

export async function registerUser(data: RegisterUserParams): Promise<User> {
  try {
    const res: Response = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result: ApiResponse<User> = await res.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (err: unknown) {
    console.log(err);
    throw err;
  }
}

export async function loginUser(data: UserSignInData): Promise<User> {
  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result: ApiResponse<User> = await res.json();

    if (!result.success) {
      throw new Error(result?.message);
    }

    return result.data;
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
