import { Router } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { z } from "zod";
import passport from "../auth/passport-google";
import { hashPassword, comparePassword } from "../auth/password";
import { signToken } from "../auth/jwt";

const prisma = new PrismaClient();
const router = Router();
const cookieOpts = { httpOnly: true, sameSite: "lax" as const, secure: true, path: "/" };

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  role: z.nativeEnum(Role).optional()
});

router.post("/register", async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email, password, name, role } = parse.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email ya registrado" });
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash, name, provider: "credentials", role: role ?? Role.INQUILINO }});
  const token = signToken({ uid: user.id, email: user.email, role: user.role });
  res.cookie("token", token, cookieOpts);
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }});
});

router.post("/login", async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string() });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email, password } = parse.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return res.status(401).json({ error: "Credenciales inválidas" });
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });
  const token = signToken({ uid: user.id, email: user.email, role: user.role });
  res.cookie("token", token, cookieOpts);
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }});
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/failure" }),
  async (req: any, res) => {
    const { id, email, role } = req.user;
    const token = signToken({ uid: id, email, role });
    res.cookie("token", token, cookieOpts);
    res.redirect(process.env.CLIENT_ORIGIN as string);
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ ok: true });
});

export default router;
