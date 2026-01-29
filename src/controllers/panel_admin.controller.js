export const renderPanelAdmin = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).render("404", { title: "403 | Acceso Denegado" });
  }

  res.render("panel_admin", {
    title: "Jitter | Configuración",
    user: req.user,
    flag: "JITTER{T1M3_4ND_M3MORY_GH0ST5}",
    db_host: "jitter.internal",
    api_gateway: "https://api.jitter.com/v1",
  });
};
