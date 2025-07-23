import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  LogOut,
  SquareLibrary,
  Receipt,
  HandCoins,
  Landmark,
  Package,
  Package2,
  PackageCheck,
  PaletteIcon,
  PersonStandingIcon,
  Plus,
  Quote,
  ReceiptIndianRupee,
  ReceiptText,
  Shirt,
  StarHalf,
  Truck,
  User2Icon,
  Warehouse,
  X,
  Menu,
  FilePlus,
  BadgeAlert,
  BadgeCheck,
  ContactRound,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { employeeLoggedOut } from "@/features/authSlice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const JMD_COLORS = {
  orange: '#EB811F',
  orangeLight: '#F9B87A',
  orangeLighter: '#FDE3C2',
  dark: '#202020',
  gray: '#828083',
};

const SIDEBAR_WIDTH = 250;
const NAVBAR_HEIGHT = 80;

const EmployeeSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { employee } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(employeeLoggedOut());
    localStorage.removeItem("employeeToken");
    toast.success("Logged out successfully");
    window.location.href = "/employee/login";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Grouped menu items for accordions
  const groupedMenu = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/employee/dashboard",
    },
    {
      id: "branches",
      title: "Branches",
      icon: Landmark,
      path: "/employee/branches",
    },
    {
      id: "invoices",
      title: "Invoices",
      icon: FileText,
      subItems: [
        { title: "All Invoices", icon: FileText, path: "/employee/invoices" },
        { title: "Fabric Invoice", icon: ReceiptIndianRupee, path: "/employee/fabric-invoices" },
        { title: "Stitching Invoice", icon: ReceiptText, path: "/employee/stitching-invoices" },
        { title: "Quotation", icon: Quote, path: "/employee/quotations" },
      ],
    },
    {
      id: "measurement",
      title: "Measurement Slip",
      icon: ReceiptText,
      subItems: [
        { title: "Slip for Billing", icon: Receipt, path: "/employee/pending-orders" },
        { title: "Pending Slip", icon: BadgeAlert, path: "/employee/pending-slip" },
        { title: "Printed Slip", icon: BadgeCheck, path: "/employee/printed-slip" },
      ],
    },
    {
      id: "stocks",
      title: "Stocks",
      icon: Warehouse,
      subItems: [
        { title: "Full Ready", icon: Shirt, path: "/employee/full-ready" },
        { title: "Partial Ready", icon: LayoutDashboard, path: "/employee/partial-ready" },
      ],
    },
    {
      id: "delivery",
      title: "Delivery",
      icon: Truck,
      subItems: [
        { title: "Full Delivery", icon: PackageCheck, path: "/employee/full-delivery" },
        { title: "Partial Delivery", icon: StarHalf, path: "/employee/partial-delivery" },
        { title: "All Delivery", icon: Package2, path: "/employee/all-delivery" },
      ],
    },
    {
      id: "order-details",
      title: "Order Details",
      icon: Package,
      path: "/employee/order-details",
    },
    {
      id: "employees",
      title: "Employees",
      icon: ContactRound,
      subItems: [
        { title: "Employees", icon: User, path: "/employee/employees" },
        { title: "Employee Salary Slip", icon: HandCoins, path: "/employee/employee-advance" },
      ],
    },
    {
      id: "masters",
      title: "Masters",
      icon: ContactRound,
      subItems: [
        { title: "Customer Master", icon: PersonStandingIcon, path: "/employee/customers" },
        { title: "Item Master", icon: FilePlus, path: "/employee/items" },
        { title: "Fabric Master", icon: Shirt, path: "/employee/fabrics" },
        { title: "Master Master", icon: User2Icon, path: "/employee/masters" },
        { title: "Salesman Master", icon: PersonStandingIcon, path: "/employee/salesmans" },
        { title: "Style Master", icon: PaletteIcon, path: "/employee/styles" },
      ],
    },
    {
      id: "create-order",
      title: "Create Order",
      icon: Plus,
      path: "/employee/create-pending-order",
      isButton: true,
    },
    {
      id: "employee-dashboard",
      title: "Employee Dashboard",
      icon: LayoutDashboard,
      path: "/employee/employee-dashboard",
    },
  ];

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <div className="flex bg-gradient-to-br from-orange-50 to-white">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-[88px] left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-[#EB811F]/30 hover:bg-[#EB811F]/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          <span className="ml-2">Menu</span>
        </Button>
      </div>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div className={`$${
        isMobileMenuOpen ? "block" : "hidden"
      } lg:block fixed top-[68px] left-0 h-[calc(100vh-80px)] w-[250px] z-50 bg-gradient-to-br from-[#FDE3C2] to-white shadow-2xl border-r border-[#EB811F]/20 transition-all duration-300 flex flex-col justify-between overflow-y-auto hide-scrollbar`}
        style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`, width: `${SIDEBAR_WIDTH}px` }}
      >
        {/* Header Section */}
        <div className="p-6 border-b border-[#EB811F]/10">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/images/jmd_logo.jpeg" alt="JMD" className="w-10 h-10 rounded-full border-2 border-[#EB811F]/40 shadow" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#EB811F]">JMD Stitching</h1>
              {/* <p className="text-xs text-[#828083] font-medium tracking-wide"></p> */}
            </div>
          </div>
          {/* User Profile Card */}
          <div className="bg-gradient-to-r from-[#EB811F]/10 to-[#F9B87A]/5 rounded-2xl p-4 border border-[#EB811F]/20">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-[#EB811F]/30">
                <AvatarImage src={employee?.profileImage} alt={employee?.name} />
                <AvatarFallback className="bg-[#EB811F] text-white font-semibold">
                  {employee?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#202020] truncate">
                  {employee?.name || "Employee"}
                </p>
                <p className="text-xs text-[#828083] capitalize">
                  {employee?.role || "Role"}
                </p>
                <p className="text-xs text-[#828083] mt-1">
                  {getGreeting()}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <div className={`w-2 h-2 rounded-full ${employee?.status === true ? 'bg-green-400' : 'bg-gray-400'}`} />
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-3 text-xs border-[#EB811F]/40 text-[#EB811F] hover:bg-[#EB811F]/10" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
        {/* Navigation with Accordions */}
        <div className="flex-1 overflow-y-auto py-4 px-3 hide-scrollbar">
          <div className="space-y-2">
            {groupedMenu.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.path);
              if (item.isButton) {
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="block w-full mb-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="bg-gradient-to-r from-[#EB811F] to-[#F9B87A] rounded-lg p-2 shadow group hover:shadow-md transition-all duration-200 flex items-center gap-2 text-white justify-center">
                      <IconComponent size={18} className="group-hover:scale-105 transition-transform" />
                      <span className="font-semibold text-sm">{item.title}</span>
                    </div>
                  </Link>
                );
              }
              if (item.subItems) {
                return (
                  <Accordion key={item.id} type="single" collapsible className="w-full">
                    <AccordionItem value={item.id} className="border-none">
                      <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-lg hover:bg-[#EB811F]/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <IconComponent size={20} className="text-[#828083]" />
                          <span className="text-sm font-medium text-[#202020]">{item.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        <div className="pl-4 space-y-1">
                          {item.subItems.map((subItem, index) => {
                            const SubIconComponent = subItem.icon;
                            const isSubActive = isActiveRoute(subItem.path);
                            return (
                              <Link
                                key={index}
                                to={subItem.path}
                                className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 group ${
                                  isSubActive 
                                    ? 'bg-[#EB811F]/20 text-[#202020] shadow-sm' 
                                    : 'hover:bg-[#EB811F]/10 text-[#828083] hover:text-[#202020]'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <SubIconComponent size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">{subItem.title}</span>
                                {isSubActive && (
                                  <div className="w-2 h-2 bg-[#EB811F] rounded-full ml-auto" />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              }
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-[#EB811F]/20 text-[#202020] shadow-sm' 
                      : 'hover:bg-[#EB811F]/10 text-[#828083] hover:text-[#202020]'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <IconComponent size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{item.title}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-[#EB811F] rounded-full ml-auto" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        {/* Footer */}
        <div className="w-full sticky bottom-0 z-[101] border-t border-[#EB811F]/20 bg-white/90 backdrop-blur-xl py-3 px-4 text-center text-xs text-[#EB811F] shadow-lg" style={{boxShadow: "0 -2px 16px 0 rgba(31,38,135,0.04)"}}>
          © 2025 JAI MATA DI STITCHING
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gradient-to-br from-orange-50 to-white lg:ml-[250px] pt-[88px]">
        <div className="w-full px-4 lg:px-8 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
