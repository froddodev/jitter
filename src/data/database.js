import Database from "better-sqlite3";
import bcrypt from "bcrypt";

const db = new Database("./src/data/jitter.db");

export const initDB = async () => {
  db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT,
            status TEXT
        )
    `);

  const row = db.prepare("SELECT count(*) as count FROM users").get();
  if (row.count === 0) {
    console.log("Sembrando base de datos...");
    const hashedPass = await bcrypt.hash("user123", 12);

    const insert = db.prepare(
      "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)",
    );
    // ADMINS (Correos y Passwords invisibles para rockyou)
    insert.run(
      "Marina",
      "m.valencia_sys88@jitter.io",
      await bcrypt.hash("Mv88_Jit_Secure_#_2026", 10),
      "admin",
      "online",
    );
    insert.run(
      "Sergio",
      "s.torres_dev92@jitter.io",
      await bcrypt.hash("St92_Vault_Crypt0_!_99", 10),
      "admin",
      "online",
    );
    insert.run(
      "Lucia",
      "l.perez_jit85@jitter.io",
      await bcrypt.hash("Lp85_Alpha_Key_@_987", 10),
      "admin",
      "offline",
    );
    // USERS
    insert.run(
      "Tommy",
      "1tommyboy@jitter.io",
      await bcrypt.hash("summerjf1", 10),
      "user",
      "online",
    );
    insert.run(
      "Oki",
      "okione01@jitter.io",
      await bcrypt.hash("hanyabbu", 10),
      "user",
      "offline",
    );
    insert.run(
      "Mencret",
      "mencret@jitter.io",
      await bcrypt.hash("8609679", 10),
      "user",
      "online",
    );
    insert.run(
      "Kick",
      "kick6in@jitter.io",
      await bcrypt.hash("237898law", 10),
      "user",
      "online",
    );
    insert.run(
      "Boogie",
      "boogie1026@jitter.io",
      await bcrypt.hash("645201070", 10),
      "user",
      "offline",
    );
    insert.run(
      "Treboerth",
      "treboerth@jitter.io",
      await bcrypt.hash("3zuurvlees", 10),
      "user",
      "online",
    );
    insert.run(
      "Walabie",
      "walabie@jitter.io",
      await bcrypt.hash("0105859074", 10),
      "user",
      "online",
    );
    insert.run(
      "Eddie",
      "eddiewuvsjuli@jitter.io",
      await bcrypt.hash("haterockyou", 10),
      "user",
      "offline",
    );
    insert.run(
      "Devina",
      "devina@jitter.io",
      await bcrypt.hash("219891", 10),
      "user",
      "online",
    );

    console.log("Datos cargados: 12 usuarios en total.");
  }
};

const warmupBcrypt = async () => {
  await Promise.all([
    bcrypt.hash("warmup1", 10),
    bcrypt.hash("warmup2", 10),
    bcrypt.hash("warmup3", 10),
  ]);
  console.log("BCrypt... hehe");
};

await warmupBcrypt();

export const getUserByEmail = (email) => {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
};

export const getAllUser = () => {
  return db.prepare("SELECT * FROM users").all();
};
