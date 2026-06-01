import pool from "../../config/db.js";
import type { RegisterBodyData, User } from "../../types/auth.types.js";

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
      WHERE email_id = $1
    `;

  const result = await pool.query<User>(query, [email]);

  return result.rows[0] || null;
};

export const createUser = async ({
  first_name,
  last_name,
  email,
  password,
}: RegisterBodyData): Promise<void> => {
  const query = `
      INSERT INTO users
        (firstname, lastname, email_id, password_hash)
      VALUES
        ($1,$2,$3,$4)
    `;

  await pool.query(query, [first_name, last_name, email, password]);
};
