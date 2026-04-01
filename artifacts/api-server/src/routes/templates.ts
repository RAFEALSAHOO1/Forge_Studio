import { Router, type IRouter } from "express";
import {
  ListTemplatesQueryParams,
  ListTemplatesResponse,
  GetTemplateParams,
  GetTemplateResponse,
} from "@workspace/api-zod";
import { mockTemplates } from "../data/templates";

const router: IRouter = Router();

router.get("/templates", async (req, res): Promise<void> => {
  const query = ListTemplatesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "invalid_query", message: query.error.message });
    return;
  }

  const { category, limit = 20, offset = 0 } = query.data;

  let filtered = mockTemplates;
  if (category) {
    filtered = filtered.filter(
      (t) => t.category.toLowerCase() === category.toLowerCase()
    );
  }

  const categories = [...new Set(mockTemplates.map((t) => t.category))];
  const paginated = filtered.slice(Number(offset), Number(offset) + Number(limit));

  res.set("Cache-Control", "public, max-age=300");
  res.json(
    ListTemplatesResponse.parse({
      templates: paginated,
      total: filtered.length,
      categories,
    })
  );
});

router.get("/templates/:id", async (req, res): Promise<void> => {
  const params = GetTemplateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "invalid_params", message: params.error.message });
    return;
  }

  const template = mockTemplates.find((t) => t.id === params.data.id);
  if (!template) {
    res.status(404).json({ error: "not_found", message: "Template not found" });
    return;
  }

  res.set("Cache-Control", "public, max-age=300");
  res.json(GetTemplateResponse.parse(template));
});

export default router;
