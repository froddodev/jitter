import { getAllUser, getUserByEmail } from "../data/database.js";

export const renderPanel = (req, res) => {
  const users = getAllUser();
  const dbUser = getUserByEmail(req.user.email);
  const user = dbUser || req.user;

  res.render("panel", {
    title: "Jitter | Dashboard",
    user,
    users,
    isAdmin: user.role === "admin"
  });
};
