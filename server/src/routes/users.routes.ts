import { Router } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { requireAuth, requireRole } from "../utils/authz";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

router.get("/me", requireAuth, async (req: any, res) => {
  const me = await prisma.user.findUnique({ where: { id: req.user.uid },
    select: { id: true, email: true, name: true, role: true, plan: true, image: true, videoUrl: true, city: true, noiseLevel: true, maxDistanceKm: true, about: true, tags: true }
  });
  res.json({ user: me });
});

router.patch("/me", requireAuth, async (req: any, res) => {
  const schema = z.object({
    name: z.string().optional(),
    image: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    city: z.string().optional(),
    noiseLevel: z.number().int().min(1).max(5).optional(),
    maxDistanceKm: z.number().int().min(0).max(200).optional(),
    about: z.string().optional(),
    tags: z.array(z.string()).optional(),
    plan: z.string().optional(),
    role: z.nativeEnum(Role).optional()
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const user = await prisma.user.update({ where: { id: req.user.uid }, data: parse.data });
  res.json({ user: { id: user.id, email: user.email, name: user.name } });
});

router.get("/admin/users", requireAuth, requireRole("ADMIN"), async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }});
  res.json({ users });
});

router.patch("/admin/users/:id/role", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const schema = z.object({ role: z.nativeEnum(Role) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { role: parse.data.role }});
  res.json({ user });
});

export default router;
