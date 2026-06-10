import pool from "../../config/db.js";
import type {
  RegisterBodyData,
  SafeUser,
  User,
} from "../../types/auth.types.js";

export const getUserFromDB = async (email: string): Promise<User | null> => {
  const query = `
      SELECT 
        user_id,
        first_name,
        last_name,
        email,
        role,
        password_hash,
        created_at
      FROM users 
      WHERE email = $1
    `;

  const result = await pool.query<User>(query, [email]);

  return result.rows[0] || null;
};

export const createUser = async ({
  first_name,
  last_name,
  email,
  password,
}: RegisterBodyData): Promise<SafeUser | undefined> => {
  const query = `
      INSERT INTO users
        (first_name, last_name, email, password_hash)
      VALUES
        ($1,$2,$3,$4)
      RETURNING
        user_id,
        first_name,
        last_name,
        email,
        role,
        created_at
    `;

  const result = await pool.query<SafeUser>(query, [
    first_name,
    last_name,
    email,
    password,
  ]);

  return result.rows[0] || undefined;
};
