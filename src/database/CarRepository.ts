import { executeTransaction } from "./SQLiteDatabase";

export type Car = {
  id?: number;
  brand: string;
  model: string;
  hp: number;
};

export default class CarRepository {
  constructor() {
    this.up();
  }

  public async up() {
    await executeTransaction(
      "CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, model TEXT, hp INT);"
    );
  }

  public async down() {
    await executeTransaction("DROP TABLE cars;");
  }

  public async create(car: Car) {
    const result = await executeTransaction(
      "INSERT INTO cars (brand, model, hp) values (?, ?, ?);",
      [car.brand, car.model, car.hp]
    );
    return result.insertId;
  }

  public async all() {
    const result = await executeTransaction("SELECT * FROM cars");
    return result.rows._array;
  }

  // 1. Delete
  public async delete(id: number) {
    await executeTransaction("DELETE FROM cars WHERE id = ?;", [id]);
  }

  // 2. Busca por modelo
  public async searchByModel(term: string) {
    const result = await executeTransaction(
      "SELECT * FROM cars WHERE model LIKE ?;",
      [`%${term}%`]
    );
    return result.rows._array;
  }

  // 3. Update
  public async update(car: Car) {
    if (!car.id) {
      throw new Error("ID do carro é necessário para atualização.");
    }
    await executeTransaction(
      "UPDATE cars SET brand = ?, model = ?, hp = ? WHERE id = ?;",
      [car.brand, car.model, car.hp, car.id]
    );
  }

  // 4. Busca por intervalo de HP
  public async searchByHpRange(minHp: number, maxHp: number) {
    const result = await executeTransaction(
      "SELECT * FROM cars WHERE hp BETWEEN ? AND ?;",
      [minHp, maxHp]
    );
    return result.rows._array;
  }
}
