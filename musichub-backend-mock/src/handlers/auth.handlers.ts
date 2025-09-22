import { Request, Response } from "express";
import { signToken } from "../utils/jwt.utils";
import users from "../data/users.json";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
};

export const register = (req: Request, res: Response) => {
  const { name, email, password } = req.body || {};
  if (!name || name.length < 2)
    return res.status(400).json({ message: "Nombre inválido" });
  if (!email) return res.status(400).json({ message: "Email requerido" });
  if (!password || password.length < 6)
    return res.status(400).json({ message: "Password inválido" });

  const exists = (users as User[]).find((u) => u.email === email);
  if (exists) return res.status(409).json({ message: "Email ya registrado" });

  const newUser: User = {
    id: "u" + Date.now(),
    name,
    email,
    password,
    avatarUrl: "",
  };
  (users as User[]).push(newUser);
  const accessToken = signToken({ sub: newUser.id, email: newUser.email });
  res.json({
    accessToken,
    user: { id: newUser.id, name, email, avatarUrl: "" },
  });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  const user = (users as User[]).find(
    (u) => u.email === email && u.password === password
  );
  if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

  const accessToken = signToken({ sub: user.id, email: user.email });
  res.json({
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  });
};
