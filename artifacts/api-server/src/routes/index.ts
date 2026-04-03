import { Router, type IRouter } from "express";
import healthRouter from "./health";
import templatesRouter from "./templates";
import submitRequestRouter from "./submitRequest";
import authRouter from "./auth";
import authCompleteRouter from "./auth-complete";
import colorsFontsRouter from "./colors-fonts";
import ordersRouter from "./orders";
import designsRouter from "./designs";
import usersRouter from "./users";
import paymentsRouter from "./payments";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(templatesRouter);
router.use(submitRequestRouter);
router.use("/auth", authRouter);
router.use("/auth", authCompleteRouter);
router.use("/colors-fonts", colorsFontsRouter);
router.use("/orders", ordersRouter);
router.use("/designs", designsRouter);
router.use("/users", usersRouter);
router.use("/payments", paymentsRouter);
router.use("/dashboard", dashboardRouter);

export default router;
