import { Router, type IRouter } from "express";
import healthRouter from "./health";
import templatesRouter from "./templates";
import submitRequestRouter from "./submitRequest";

const router: IRouter = Router();

router.use(healthRouter);
router.use(templatesRouter);
router.use(submitRequestRouter);

export default router;
