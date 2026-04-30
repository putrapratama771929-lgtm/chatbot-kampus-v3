/* ============================================
   ROUTES: ADMIN — Authenticated CRUD + Dashboard
   Thin route layer — delegates to services
   ============================================ */

import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { invalidateCache } from "../services/chatEngine.js";
import { invalidateCampusContextCache } from "../services/campusContextService.js";
import { validateBody, knowledgeSourceSchema, knowledgeSourceUpdateSchema } from "../middleware/validate.js";

// Services
import * as kampusService from "../services/kampusService.js";
import * as jurusanService from "../services/jurusanService.js";
import * as prodiService from "../services/prodiService.js";
import * as pendaftaranService from "../services/pendaftaranService.js";
import * as beasiswaService from "../services/beasiswaService.js";
import * as fasilitasService from "../services/fasilitasService.js";
import * as faqService from "../services/faqService.js";
import * as kontakService from "../services/kontakService.js";
import * as intentsService from "../services/intentsService.js";
import * as chatSessionService from "../services/chatSessionService.js";
import * as knowledgeSyncService from "../services/knowledgeSyncService.js";
import * as ragService from "../services/ragService.js";

const router = Router();

// All admin routes require authentication
router.use(requireAuth);

// ==========================================
// DASHBOARD
// ==========================================

router.get("/dashboard", async (_req: Request, res: Response) => {
  try {
    const totalSessions = await chatSessionService.getSessionCount();
    const totalMessages = await chatSessionService.getMessageCount();
    const popularIntents = await chatSessionService.getPopularIntents(10);
    const recentSessions = await chatSessionService.getRecentSessions(10);

    res.json({
      success: true,
      data: {
        stats: { total_sessions: totalSessions, total_messages: totalMessages },
        popular_intents: popularIntents,
        recent_sessions: recentSessions,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// ==========================================
// CRUD ROUTE BUILDER (DRY pattern)
// ==========================================

interface CrudService {
  getAllAdmin: () => Promise<any[]>;
  getById: (id: number) => Promise<any>;
  create: (data: any) => Promise<any>;
  update: (id: number, data: any) => Promise<any>;
  remove: (id: number) => Promise<any>;
}

function parseRouteId(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;

  const id = Number.parseInt(raw, 10);
  return Number.isNaN(id) ? null : id;
}

function buildCrudRoutes(path: string, service: CrudService) {
  router.get(`/${path}`, async (_req: Request, res: Response) => {
    try {
      const data = await service.getAllAdmin();
      res.json({ success: true, data });
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
      res.status(500).json({ error: `Failed to fetch ${path}` });
    }
  });

  router.get(`/${path}/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseRouteId(req.params.id);
      if (id === null) return res.status(400).json({ error: "Invalid id" });

      const item = await service.getById(id);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json({ success: true, data: item });
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
      res.status(500).json({ error: `Failed to fetch ${path}` });
    }
  });

  router.post(`/${path}`, async (req: Request, res: Response) => {
    try {
      const item = await service.create(req.body);
      invalidateCache();
      invalidateCampusContextCache();
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      console.error(`Error creating ${path}:`, error);
      res.status(500).json({ error: `Failed to create ${path}` });
    }
  });

  router.put(`/${path}/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseRouteId(req.params.id);
      if (id === null) return res.status(400).json({ error: "Invalid id" });

      const item = await service.update(id, req.body);
      if (!item) return res.status(404).json({ error: "Not found" });
      invalidateCache();
      invalidateCampusContextCache();
      res.json({ success: true, data: item });
    } catch (error) {
      console.error(`Error updating ${path}:`, error);
      res.status(500).json({ error: `Failed to update ${path}` });
    }
  });

  router.delete(`/${path}/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseRouteId(req.params.id);
      if (id === null) return res.status(400).json({ error: "Invalid id" });

      const item = await service.remove(id);
      if (!item) return res.status(404).json({ error: "Not found" });
      invalidateCache();
      invalidateCampusContextCache();
      res.json({ success: true, message: `${path} deleted` });
    } catch (error) {
      console.error(`Error deleting ${path}:`, error);
      res.status(500).json({ error: `Failed to delete ${path}` });
    }
  });
}

// Register CRUD routes for each resource
buildCrudRoutes("jurusan", jurusanService);
buildCrudRoutes("prodi", prodiService);
buildCrudRoutes("pendaftaran", pendaftaranService);
buildCrudRoutes("beasiswa", beasiswaService);
buildCrudRoutes("fasilitas", fasilitasService);
buildCrudRoutes("faq", faqService);
buildCrudRoutes("kontak", kontakService);
buildCrudRoutes("intents", intentsService);

// ==========================================
// SPECIAL ROUTES
// ==========================================

/** POST /api/admin/knowledge/sync — Sync database content into RAG knowledge base */
router.post("/knowledge/sync", async (_req: Request, res: Response) => {
  try {
    const summary = await knowledgeSyncService.syncDatabaseKnowledge();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error("Error syncing knowledge:", error);
    res.status(500).json({ error: "Failed to sync knowledge" });
  }
});

/** GET /api/admin/knowledge/sources — List RAG sources */
router.get("/knowledge/sources", async (_req: Request, res: Response) => {
  try {
    const sources = await ragService.listSources();
    res.json({ success: true, data: sources });
  } catch (error) {
    console.error("Error fetching knowledge sources:", error);
    res.status(500).json({ error: "Failed to fetch knowledge sources" });
  }
});

/** POST /api/admin/knowledge/sources — Create manual admin text source */
router.post("/knowledge/sources", validateBody(knowledgeSourceSchema), async (req: Request, res: Response) => {
  try {
    const result = await ragService.createAdminSource(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating knowledge source:", error);
    res.status(500).json({ error: "Failed to create knowledge source" });
  }
});

/** PUT /api/admin/knowledge/sources/:id — Update source and re-embed if needed */
router.put("/knowledge/sources/:id", validateBody(knowledgeSourceUpdateSchema), async (req: Request, res: Response) => {
  try {
    const id = parseRouteId(req.params.id);
    if (id === null) return res.status(400).json({ error: "Invalid id" });

    const result = await ragService.updateSource(id, req.body);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating knowledge source:", error);
    res.status(500).json({ error: "Failed to update knowledge source" });
  }
});

/** DELETE /api/admin/knowledge/sources/:id — Deactivate source and remove chunks */
router.delete("/knowledge/sources/:id", async (req: Request, res: Response) => {
  try {
    const id = parseRouteId(req.params.id);
    if (id === null) return res.status(400).json({ error: "Invalid id" });

    const source = await ragService.deactivateSource(id);
    if (!source) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, data: source });
  } catch (error) {
    console.error("Error deleting knowledge source:", error);
    res.status(500).json({ error: "Failed to delete knowledge source" });
  }
});

/** PUT /api/admin/kampus — Update campus info */
router.put("/kampus", async (req: Request, res: Response) => {
  try {
    const data = await kampusService.update(req.body);
    invalidateCampusContextCache();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error updating kampus:", error);
    res.status(500).json({ error: "Failed to update campus info" });
  }
});

/** GET /api/admin/chat-logs — View recent chat logs */
router.get("/chat-logs", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const messages = await chatSessionService.getRecentMessages(limit, offset);
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching chat logs:", error);
    res.status(500).json({ error: "Failed to fetch chat logs" });
  }
});

export default router;
