/* ============================================
   ROUTES: ADMIN — Authenticated CRUD + Dashboard
   Thin route layer — delegates to services
   ============================================ */

import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { invalidateCache } from "../services/chatEngine.js";

// Services
import * as kampusService from "../services/kampusService.js";
import * as jurusanService from "../services/jurusanService.js";
import * as pendaftaranService from "../services/pendaftaranService.js";
import * as beasiswaService from "../services/beasiswaService.js";
import * as fasilitasService from "../services/fasilitasService.js";
import * as faqService from "../services/faqService.js";
import * as kontakService from "../services/kontakService.js";
import * as intentsService from "../services/intentsService.js";
import * as chatSessionService from "../services/chatSessionService.js";

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
      const item = await service.getById(parseInt(req.params.id));
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
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      console.error(`Error creating ${path}:`, error);
      res.status(500).json({ error: `Failed to create ${path}` });
    }
  });

  router.put(`/${path}/:id`, async (req: Request, res: Response) => {
    try {
      const item = await service.update(parseInt(req.params.id), req.body);
      if (!item) return res.status(404).json({ error: "Not found" });
      invalidateCache();
      res.json({ success: true, data: item });
    } catch (error) {
      console.error(`Error updating ${path}:`, error);
      res.status(500).json({ error: `Failed to update ${path}` });
    }
  });

  router.delete(`/${path}/:id`, async (req: Request, res: Response) => {
    try {
      const item = await service.remove(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: "Not found" });
      invalidateCache();
      res.json({ success: true, message: `${path} deleted` });
    } catch (error) {
      console.error(`Error deleting ${path}:`, error);
      res.status(500).json({ error: `Failed to delete ${path}` });
    }
  });
}

// Register CRUD routes for each resource
buildCrudRoutes("jurusan", jurusanService);
buildCrudRoutes("pendaftaran", pendaftaranService);
buildCrudRoutes("beasiswa", beasiswaService);
buildCrudRoutes("fasilitas", fasilitasService);
buildCrudRoutes("faq", faqService);
buildCrudRoutes("kontak", kontakService);
buildCrudRoutes("intents", intentsService);

// ==========================================
// SPECIAL ROUTES
// ==========================================

/** PUT /api/admin/kampus — Update campus info */
router.put("/kampus", async (req: Request, res: Response) => {
  try {
    const data = await kampusService.update(req.body);
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
