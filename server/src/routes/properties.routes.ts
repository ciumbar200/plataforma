import { Router } from "express";
import { PrismaClient, Visibility } from "@prisma/client";
import { requireAuth, requireRole } from "../utils/authz";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const propertySchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  city: z.string().optional(),
  priceMonthly: z.number().int().min(0),
  photos: z.array(z.string().url()).default([]),
  visibility: z.nativeEnum(Visibility).default(Visibility.PUBLIC)
});

router.post("/", requireAuth, requireRole("PROPIETARIO"), async (req: any, res) => {
  const parse = propertySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const prop = await prisma.property.create({ data: { ...parse.data, ownerId: req.user.uid } });
  res.json({ property: prop });
});

router.get("/mine", requireAuth, requireRole("PROPIETARIO"), async (req: any, res) => {
  const props = await prisma.property.findMany({ where: { ownerId: req.user.uid }, orderBy: { createdAt: "desc" } });
  res.json({ properties: props });
});

router.patch("/:id", requireAuth, requireRole("PROPIETARIO"), async (req: any, res) => {
  const data = propertySchema.partial().safeParse(req.body);
  if (!data.success) return res.status(400).json({ error: data.error.flatten() });
  const prop = await prisma.property.update({ where: { id: req.params.id }, data: data.data });
  res.json({ property: prop });
});

router.get("/", requireAuth, async (req: any, res) => {
  const userId = req.user.uid;
  const publicProps = await prisma.property.findMany({ where: { visibility: "PUBLIC" }, orderBy: { createdAt: "desc" }});
  const matchedOnly = await prisma.property.findMany({
    where: { visibility: "MATCHED_ONLY", matches: { some: { tenantId: userId, status: "ACCEPTED" } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ properties: [...publicProps, ...matchedOnly] });
});

export default router;
