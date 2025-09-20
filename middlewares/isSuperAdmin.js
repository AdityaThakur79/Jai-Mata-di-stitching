export const isSuperAdmin = (req, res, next) => {
  // Check both req.user (for regular users) and req.employee (for employees)
  const role = req.user?.role || req.employee?.role;
  console.log("Checking role:", role, "User:", req.user, "Employee:", req.employee);
  
  if (role === "superAdmin" || role === "director") {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};
