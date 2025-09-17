import { Router } from "express";
import { PrismaClient, MatchStatus, Role } from "@prisma/client";
import { requireAuth, requireRole } from "../utils/authz";
import { computeMatchScore } from "../utils/match";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

router.get("/roommates/suggestions", requireAuth, async (req: any, res) => {
  const me = await prisma.user.findUnique({ where: { id: req.user.uid } });
  if (!me || me.role !== Role.INQUILINO) return res.json({ suggestions: [] });
  const others = await prisma.user.findMany({ where: { role: Role.INQUILINO, id: { not: me.id } }, take: 50 });
  const suggestions = others.map(o => ({
    user: { id: o.id, name: o.name, email: o.email, image: o.image, city: o.city, tags: o.tags },
    score: computeMatchScore(me, o)
  })).sort((a,b)=>b.score-a.score);
  res.json({ suggestions });
});

router.get("/roommates/mine", requireAuth, async (req: any, res) => {
  const userId = req.user.uid;
  const likes = await prisma.roommateLike.findMany({
    where: { status: MatchStatus.ACCEPTED, OR: [ { userAId: userId }, { userBId: userId } ] },
    orderBy: { createdAt: "desc" }
  });
  res.json({ matches: likes });
});

router.post("/roommates/like/:otherId", requireAuth, async (req: any, res) => {
  const meId = req.user.uid; const otherId = req.params.otherId;
  const me = await prisma.user.findUnique({ where: { id: meId } });
  const other = await prisma.user.findUnique({ where: { id: otherId } });
  if (!me || !other) return res.status(404).json({ error: "Usuario no encontrado" });
  if (me.role !== Role.INQUILINO || other.role !== Role.INQUILINO) return res.status(400).json({ error: "Solo inquilinos" });
  const score = computeMatchScore(me, other);
  const [a, b] = meId < otherId ? [meId, otherId] : [otherId, meId];
  const like = await prisma.roommateLike.upsert({
    where: { userAId_userBId: { userAId: a, userBId: b } },
    update: { status: MatchStatus.ACCEPTED, score },
    create: { userAId: a, userBId: b, score, status: MatchStatus.ACCEPTED }
  });
  res.json({ match: like, mutual: true });
});

router.post("/roommates/skip/:otherId", requireAuth, async (req: any, res) => {
  const meId = req.user.uid; const otherId = req.params.otherId;
  const [a, b] = meId < otherId ? [meId, otherId] : [otherId, meId];
  const like = await prisma.roommateLike.upsert({
    where: { userAId_userBId: { userAId: a, userBId: b } },
    update: { status: MatchStatus.REJECTED },
    create: { userAId: a, userBId: b, score: 0, status: MatchStatus.REJECTED }
  });
  res.json({ skipped: true, record: like });
});

// Tenant expresses interest in a property
router.post("/properties/:id/interest", requireAuth, async (req: any, res) => {
  const property = await prisma.property.findUnique({ where: { id: req.params.id } });
  const tenant = await prisma.user.findUnique({ where: { id: req.user.uid } });
  if (!property || !tenant) return res.status(404).json({ error: "No encontrado" });
  const owner = await prisma.user.findUnique({ where: { id: property.ownerId } });
  const score = owner ? computeMatchScore(tenant, owner) : 50;
  const pm = await prisma.propertyMatch.upsert({
    where: { propertyId_tenantId: { propertyId: property.id, tenantId: tenant.id } },
    update: { score, status: MatchStatus.PENDING },
    create: { propertyId: property.id, tenantId: tenant.id, score, status: MatchStatus.PENDING }
  });
  res.json({ propertyMatch: pm });
});

// Owner reviews candidates for a property
router.get("/owner/properties/:id/candidates", requireAuth, requireRole("PROPIETARIO"), async (req: any, res) => {
  const prop = await prisma.property.findUnique({ where: { id: req.params.id } });
  if (!prop || prop.ownerId !== req.user.uid) return res.status(404).json({ error: "No encontrado" });
  const candidates = await prisma.propertyMatch.findMany({
    where: { propertyId: prop.id },
    orderBy: { score: "desc" },
    include: { tenant: { select: { id: true, name: true, email: true, image: true, tags: true, city: true } } }
  });
  res.json({ candidates });
});

// Owner accept/reject a property match
router.patch("/property-matches/:id", requireAuth, requireRole("PROPIETARIO"), async (req: any, res) => {
  const schema = z.object({ status: z.nativeEnum(MatchStatus) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const pm = await prisma.propertyMatch.update({ where: { id: req.params.id }, data: { status: parse.data.status } });
  res.json({ propertyMatch: pm });
});

export default router;
