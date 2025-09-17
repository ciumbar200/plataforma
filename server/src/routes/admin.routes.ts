import { Router } from "express";
import { PrismaClient, MatchStatus } from "@prisma/client";
import { requireAuth, requireRole } from "../utils/authz";
import { z } from "zod";
import crypto from "crypto";

const prisma = new PrismaClient();
const router = Router();

router.get("/metrics", requireAuth, requireRole("ADMIN"), async (_req, res) => {
  const [usersCount, propertiesCount, roommateAccepted, propertyAccepted] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.roommateLike.count({ where: { status: MatchStatus.ACCEPTED } }),
    prisma.propertyMatch.count({ where: { status: MatchStatus.ACCEPTED } }),
  ]);
  res.json({
    totalUsuarios: usersCount,
    propiedadesListadas: propertiesCount,
    matchesActivos: roommateAccepted,
    matchesExitosos: propertyAccepted
  });
});

// Blogs CRUD
router.get("/blogs", requireAuth, requireRole("ADMIN"), async (_req, res) => {
  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ blogs });
});
router.post("/blogs", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const schema = z.object({ title: z.string().min(1), content: z.string().min(1), published: z.boolean().optional() });
  const data = schema.parse(req.body);
  const blog = await prisma.blog.create({ data });
  res.json({ blog });
});
router.patch("/blogs/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const schema = z.object({ title: z.string().optional(), content: z.string().optional(), published: z.boolean().optional() });
  const data = schema.parse(req.body);
  const blog = await prisma.blog.update({ where: { id: req.params.id }, data });
  res.json({ blog });
});
router.delete("/blogs/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  await prisma.blog.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// SMTP settings
router.get("/smtp", requireAuth, requireRole("ADMIN"), async (_req, res) => {
  const s = await prisma.smtpSetting.findFirst({ orderBy: { createdAt: "desc" } });
  res.json({ smtp: s });
});
router.put("/smtp", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const schema = z.object({ host: z.string(), port: z.number().int(), user: z.string(), fromEmail: z.string().email(), secure: z.boolean().optional() });
  const data = schema.parse(req.body);
  const existing = await prisma.smtpSetting.findFirst();
  const s = existing ? await prisma.smtpSetting.update({ where: { id: existing.id }, data }) : await prisma.smtpSetting.create({ data });
  res.json({ smtp: s });
});

// API Keys
router.get("/api-keys", requireAuth, requireRole("ADMIN"), async (req: any, res) => {
  const keys = await prisma.apiKey.findMany({ where: { userId: req.user.uid }, orderBy: { createdAt: "desc" } });
  res.json({ keys });
});
router.post("/api-keys", requireAuth, requireRole("ADMIN"), async (req: any, res) => {
  const schema = z.object({ label: z.string().min(1) });
  const data = schema.parse(req.body);
  const plaintext = (Math.random().toString(36).slice(2)) + "-" + (Math.random().toString(36).slice(2));
  const keyHash = crypto.createHash("sha256").update(plaintext).digest("hex");
  const k = await prisma.apiKey.create({ data: { userId: req.user.uid, label: data.label, keyHash } });
  res.json({ key: { id: k.id, label: k.label, active: k.active }, plaintext }); // show once
});
router.delete("/api-keys/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  await prisma.apiKey.update({ where: { id: req.params.id }, data: { active: false } });
  res.json({ ok: true });
});

export default router;
