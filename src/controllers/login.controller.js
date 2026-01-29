import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getUserByEmail } from "../data/database.js";

const SECRET_KEY = "ontock";

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email);

  if (!user) {
    console.log(`Login fallido: Usuario no encontrado (${email})`);

    await new Promise((r) => setTimeout(r, 200));

    return res.render("login", {
      title: "Jitter | Login",
      error: "Credenciales inválidas",
    });
  }

  const match = await bcrypt.compare(password, user.password);

  await new Promise((r) => setTimeout(r, 180));

  if (match) {
    console.log(`Login exitoso: ${email}`);
    const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY);
    return res
      .cookie("token", token, { httpOnly: false, path: "/" })
      .redirect("/panel");
  }

  console.log(`Login fallido: Contraseña incorrecta para ${email}`);

  return res.render("login", {
    title: "Jitter | Login",
    error: "Credenciales inválidas",
  });
};

export const renderLogin = (req, res) => {
  res.render("login", { title: "Jitter | Login" });
};
