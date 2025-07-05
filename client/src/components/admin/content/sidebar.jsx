import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  BadgeAlert,
  BadgeCheck,
  ContactRound,
  FilePlus,
  FileText,
  HandCoins,
  Landmark,
  LayoutDashboard,
  ListOrdered,
  MailWarning,
  Package,
  Package2,
  PackageCheck,
  PaletteIcon,
  PersonStandingIcon,
  Plus,
  Quote,
  Receipt,
  ReceiptIndianRupee,
  ReceiptText,
  Shirt,
  SquareLibrary,
  StarHalf,
  Truck,
  TruckIcon,
  User,
  User2Icon,
  Warehouse,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectUserRole } from "@/features/authSlice";
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
import { useLoadUserQuery } from "@/features/api/authApi";
import { FaQuestionCircle } from "react-icons/fa";
import { CiCircleList } from "react-icons/ci";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data, isLoading, refetch } = useLoadUserQuery();
  const user = data && data.user;
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
        <div className="space-y-4 ">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <Link
                to="dashboard"
                className="flex items-center gap-2 hover:text-[#EB811F] py-4 px-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutDashboard size={22} />
                <h2 className="text-sm">Dashboard</h2>
              </Link>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText size={22} />
                  <span>Bill/Invoice</span>
                </div>{" "}
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="/admin/invoices"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Landmark size={22} />
                  <h2>All Invoice</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ReceiptIndianRupee size={22} />
                  <h2>Fabric Invoice</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ReceiptText size={22} />
                  <h2>Stitching Invoice</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Quote size={22} />
                  <h2>Quotation</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <ReceiptText size={22} />
                  <span>Measurement Slip</span>
                </div>{" "}
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="/admin/pending-orders"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Receipt size={22} />
                  <h2>Slip for Billing</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BadgeAlert size={22} />
                  <h2>Pending Slip</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BadgeCheck size={22} />
                  <h2>Printed Slip</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Warehouse size={22} />
                  <span>Stocks</span>
                </div>{" "}
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shirt size={22} />
                  <h2>Full Ready</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={22} />
                  <h2>Partial Ready</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Truck size={22} />
                  <span>Delivery</span>
                </div>{" "}
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <PackageCheck size={22} />
                  <h2>Full Delivery</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <StarHalf size={22} />
                  <h2>Partial Delivery</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package2 size={22} />
                  <h2>All Delivery</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <Link
                to="dashboard"
                className="flex items-center gap-2 hover:text-[#EB811F] py-4 px-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Package size={22} />
                <h2 className="text-sm">Order Details</h2>
              </Link>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <ContactRound size={22} />
                  <span>Employee</span>
                </div>{" "}
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Plus size={22} />
                  <h2>Employee Registraion</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HandCoins size={22} />
                  <h2>Employee Salary Slip</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="#"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HandCoins size={22} />
                  <h2>Employee Income</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <Link
                to="#"
                className="flex items-center gap-2 hover:text-[#EB811F] py-4 px-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ReceiptIndianRupee size={22} />
                <h2 className="text-sm">Fabric Invoice</h2>
              </Link>
            </AccordionItem>

            <AccordionItem value="item-9">
              <Link
                to="#"
                className="flex items-center gap-2 hover:text-[#EB811F] py-4 px-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ReceiptText size={22} />
                <h2 className="text-sm">Stitching Invoice</h2>
              </Link>
            </AccordionItem>

            <AccordionItem value="item-10">
              <Link
                to="#"
                className="flex items-center gap-2 hover:text-[#EB811F] py-4 px-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={22} />
                <h2 className="text-sm">Add Employee</h2>
              </Link>
            </AccordionItem>

            <AccordionItem value="item-11">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <ContactRound size={22} />
                  <span>Masters</span>
                </div>{" "}
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="/admin/customers"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <PersonStandingIcon size={22} />
                  <h2>Customer Master</h2>
                </Link>
              </AccordionContent>
             <AccordionContent>
                <Link
                  to="/admin/items"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FilePlus size={22} />
                  <h2>Item Master</h2>
                </Link>
              </AccordionContent>
                 <AccordionContent>
                <Link
                  to="/admin/fabrics"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shirt size={22} />
                  <h2>Fabric Master</h2>
                </Link>
              </AccordionContent>
               <AccordionContent>
                <Link
                  to="/admin/masters"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User2Icon size={22} />
                  <h2>Master Master</h2>
                </Link>
              </AccordionContent>
               <AccordionContent>
                <Link
                  to="/admin/salesmans"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <PersonStandingIcon size={22} />
                  <h2>Salesman Master</h2>
                </Link>
              </AccordionContent>
               <AccordionContent>
                <Link
                  to="/admin/styles"
                  className="flex items-center gap-2 hover:text-[#EB811F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <PaletteIcon size={22} />
                  <h2>Style Master</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-12">
              <Link
                to="/admin/create-pending-order"
                className="flex items-center gap-2 hover:text-[#EB811F] py-4 px-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus size={22} />
                <h2 className="text-sm">Create Order</h2>
              </Link>
            </AccordionItem>

          </Accordion>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="px-0">
                {" "}
                <Avatar>
                  <AvatarImage src={user?.photoUrl} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                Profile
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-50 ml-4">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src={user?.photoUrl} alt={user?.name} />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{user?.name}</h4>
                  <p className="text-sm">{user?.role}</p>
                  <div className="flex items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      {user?.status}
                    </span>
                  </div>
                  <div className="flex items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      <Link to="profile">Edit Profile</Link>
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-10 transition-all ">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
