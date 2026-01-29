import { rateLimit } from "express-rate-limit";

const rateLimitHandler = (req, res) => {
  const view = req.path.includes("admin") ? "panel_admin" : 
               req.path.includes("panel") ? "panel" : "login";
               
  res.status(429).render(view, {
    title: "Jitter | Límite excedido",
    rateLimitError: "Has realizado demasiadas peticiones, intenta de nuevo más tarde.",
    user: { email: "Seguridad Jitter" },
    isAdmin: req.path.includes("admin")
  });
};

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => {
    return req.headers["x-forwarded-for"] || req.ip;
  },
  handler: rateLimitHandler
});
