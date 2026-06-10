export const normalizeEmployeeRole = (role) =>
  String(role ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const OPERATIONAL_DASHBOARD_ROLES = new Set([
  "tailor",
  "master",
  "fitter",
  "branch fitter",
  "handwork person",
  "handwork designer",
  "peon",
  "packing employee",
  "packing team leader",
]);

/** Director, superadmin, and other management roles use the company admin dashboard. */
export const usesAdminDashboard = (role) =>
  !OPERATIONAL_DASHBOARD_ROLES.has(normalizeEmployeeRole(role));
