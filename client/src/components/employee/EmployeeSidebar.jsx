import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Download,
  LogOut,
  SquareLibrary,
  Receipt,
  HandCoins,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { employeeLoggedOut } from "@/features/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import toast from "react-hot-toast";

const EmployeeSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { employee } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(employeeLoggedOut());
    localStorage.removeItem("employeeToken");
    toast.success("Logged out successfully");
    navigate("/employee/login");
  };

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/employee/dashboard",
        roles: ["tailor", "manager", "biller", "director", "admin", "other"],
      },
      {
        id: "profile",
        label: "My Profile",
        icon: User,
        path: "/employee/profile",
        roles: ["tailor", "manager", "biller", "director", "admin", "other"],
      },
    ];

    // Add role-specific items
    if (employee?.role === "biller" || employee?.role === "manager" || employee?.role === "admin") {
      baseItems.push({
        id: "billing",
        label: "Billing",
        icon: Receipt,
        path: "/employee/billing",
        roles: ["biller", "manager", "admin"],
      });
    }

    if (employee?.role === "manager" || employee?.role === "admin") {
      baseItems.push({
        id: "reports",
        label: "Reports",
        icon: FileText,
        path: "/employee/reports",
        roles: ["manager", "admin"],
      });
    }

    // Salary slips for all employees
    baseItems.push({
      id: "salary",
      label: "Salary & Payments",
      icon: HandCoins,
      path: "/employee/salary",
      roles: ["tailor", "manager", "biller", "director", "admin", "other"],
    });

    return baseItems.filter(item => item.roles.includes(employee?.role));
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex flex-col lg:flex-row mt-20">
      {/* Mobile Menu Button */}
      <div className="lg:hidden p-4 mt-4 md:mt-0">
        <button
          className="flex items-center gap-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <SquareLibrary size={22} />
          <span>Menu</span>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } lg:block w-full lg:w-[250px] sm:w-[300px] space-y-8 border-r border-b border-gray-300 dark:border-gray-700 p-5 bg-white dark:bg-gray-900 z-50 lg:z-auto`}
      >
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {navigationItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <Link
                  to={item.path}
                  className="flex items-center gap-2 hover:text-[#EB811F] py-4 px-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={22} />
                  <h2 className="text-sm">{item.label}</h2>
                </Link>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Profile Section */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="px-0">
                <Avatar>
                  <AvatarImage src={employee?.profileImage} alt={employee?.name} />
                  <AvatarFallback>
                    {employee?.name?.charAt(0).toUpperCase() || "E"}
                  </AvatarFallback>
                </Avatar>
                Profile
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-50 ml-4">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src={employee?.profileImage} alt={employee?.name} />
                  <AvatarFallback>{employee?.name?.charAt(0).toUpperCase() || "E"}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{employee?.name}</h4>
                  <p className="text-sm capitalize">{employee?.role}</p>
                  <p className="text-xs text-muted-foreground">
                    ID: {employee?.employeeId}
                  </p>
                  <div className="flex items-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeSidebar; 