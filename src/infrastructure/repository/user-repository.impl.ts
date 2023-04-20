import { Pool } from "pg";
import { User } from "../../domain/user/models/user";
import { UserRepository } from "../../domain/user/repositories/user-repository.interface";

export class UserRepositoryImpl implements UserRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
  }

  async create(user: User): Promise<User> {
    const { name, email, password } = user;
    const result = await this.pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    return result.rows[0];
  }

  async update(userId: string, user: Partial<User>): Promise<User> {
    const keys = Object.keys(user);
    const values = Object.values(user);
    const setStatement = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const query = {
      text: `UPDATE users SET ${setStatement} WHERE id = $${
        keys.length + 1
      } RETURNING *`,
      values: [...values, userId],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }
}
