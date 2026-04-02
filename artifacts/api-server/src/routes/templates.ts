import { Router, type IRouter } from "express";
import { mockTemplates } from "../data/templates";

const router: IRouter = Router();

router.get("/templates", (req, res): void => {
  const { category, limit = "20", offset = "0" } = req.query as Record<string, string>;

  let filtered = mockTemplates;
  if (category) {
    filtered = filtered.filter(
      (t) => t.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  const categories = [...new Set(mockTemplates.map((t) => t.category))];
  const lim = Number(limit);
  const off = Number(offset);
  const paginated = filtered.slice(off, off + lim);

  res.set("Cache-Control", "public, max-age=300");
  res.json({ templates: paginated, total: filtered.length, categories });
});

router.get("/templates/:id", (req, res): void => {
  const { id } = req.params;
  const template = mockTemplates.find((t) => t.id === id);

  if (!template) {
    res.status(404).json({ error: "not_found", message: "Template not found" });
    return;
  }

  res.set("Cache-Control", "public, max-age=300");
  res.json(template);
});

export default router;
