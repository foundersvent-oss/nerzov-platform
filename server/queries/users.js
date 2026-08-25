export async function findUserByEmail(db, email) {
  return db
    .prepare(
      `
      SELECT
        id,
        email,
        password_hash,
        role,
        is_2fa_enabled,
        created_at
      FROM users
      WHERE email = ?
      LIMIT 1
      `
    )
    .bind(email)
    .first();
}

export async function findUserById(db, id) {
  return db
    .prepare(
      `
      SELECT
        id,
        email,
        role,
        is_2fa_enabled,
        created_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `
    )
    .bind(id)
    .first();
}
