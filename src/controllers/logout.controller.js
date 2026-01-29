export const logout = (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.redirect("/login");
};
