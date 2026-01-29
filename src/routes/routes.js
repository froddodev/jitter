import { Router } from "express";
import { login, renderLogin } from "../controllers/login.controller.js";
import { logout } from "../controllers/logout.controller.js";
import { renderPanel } from "../controllers/panel.controller.js";
import { renderPanelAdmin } from "../controllers/panel_admin.controller.js";
import { renderNotFound } from "../controllers/not_found.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/", (req, res) => res.redirect("/login"));

router.get("/login", renderLogin);
router.post("/api/login", login);
router.get("/api/logout", logout);

router.get("/panel", authenticate, renderPanel);
router.get("/admin", authenticate, renderPanelAdmin);

router.use(renderNotFound);

export default router;
