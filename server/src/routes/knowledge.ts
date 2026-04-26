/* ============================================
   ROUTES: KNOWLEDGE — Public Read-Only API
   Thin route layer — delegates to services
   ============================================ */

import { Router } from "express";
import * as kampusService from "../services/kampusService.js";
import * as jurusanService from "../services/jurusanService.js";
import * as pendaftaranService from "../services/pendaftaranService.js";
import * as beasiswaService from "../services/beasiswaService.js";
import * as fasilitasService from "../services/fasilitasService.js";
import * as faqService from "../services/faqService.js";
import * as kontakService from "../services/kontakService.js";

const router = Router();

router.get("/kampus", async (_req, res) => {
  try {
    const data = await kampusService.get();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching kampus:", error);
    res.status(500).json({ error: "Failed to fetch campus info" });
  }
});

router.get("/jurusan", async (_req, res) => {
  try {
    const data = await jurusanService.getAllActive();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching jurusan:", error);
    res.status(500).json({ error: "Failed to fetch study programs" });
  }
});

router.get("/jurusan/:id", async (req, res) => {
  try {
    const data = await jurusanService.getById(parseInt(req.params.id));
    if (!data) return res.status(404).json({ error: "Study program not found" });
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching jurusan:", error);
    res.status(500).json({ error: "Failed to fetch study program" });
  }
});

router.get("/pendaftaran", async (_req, res) => {
  try {
    const data = await pendaftaranService.getAllActive();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching pendaftaran:", error);
    res.status(500).json({ error: "Failed to fetch admission paths" });
  }
});

router.get("/beasiswa", async (_req, res) => {
  try {
    const data = await beasiswaService.getAllActive();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching beasiswa:", error);
    res.status(500).json({ error: "Failed to fetch scholarships" });
  }
});

router.get("/fasilitas", async (_req, res) => {
  try {
    const data = await fasilitasService.getAllActive();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching fasilitas:", error);
    res.status(500).json({ error: "Failed to fetch facilities" });
  }
});

router.get("/faq", async (_req, res) => {
  try {
    const data = await faqService.getAllActive();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    res.status(500).json({ error: "Failed to fetch FAQ" });
  }
});

router.get("/kontak", async (_req, res) => {
  try {
    const data = await kontakService.getAllActive();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching kontak:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

export default router;
