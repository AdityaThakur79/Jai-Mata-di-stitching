import React from "react";
import { useSelector } from "react-redux";
import Dashboard from "@/components/admin/content/dashboard";
import TailorWorkDashboard from "@/components/employee/TailorWorkDashboard";
import { usesAdminDashboard } from "@/utils/employeeRoleUtils";

const EmployeeMainDashboard = () => {
  const { employee } = useSelector((state) => state.auth);

  if (usesAdminDashboard(employee?.role)) {
    return <Dashboard />;
  }

  return <TailorWorkDashboard />;
};

export default EmployeeMainDashboard;
