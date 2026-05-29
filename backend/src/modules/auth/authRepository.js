import pool from "../config/auth.js";

export const checkUserExists = async (email_id) => {
  const query = `
      SELECT email_id FROM users WHERE email_id = $1
    `;
  return pool.query(query, [email_id]);
};

export const createUser = async ({
  firstName,
  lastName,
  email_id,
  hashedPassword,
}) => {
  const query = `
      INSERT INTO users
        (firstname, lastname, email_id, password_hash)
      VALUES
        ($1,$2,$3,$4)
    `;

  return pool.query(query, [firstName, lastName, email_id, hashedPassword]);
};

export const getExistingUser = async (email_id) => {
  const query = `
    SELECT 
      user_id,
      firstname,
      email_id,
      password_hash
    FROM
      users
    WHERE 
      email_id = $1
  `;

  return pool.query(query, [email_id]);
};
