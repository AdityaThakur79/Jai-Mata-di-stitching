import { Calculator, Clock, LogOut, Menu, School } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DarkMode from "../../DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
// import { Link } from 'react-router-dom'
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetEmployeeProfileQuery,
  useEmployeeLoginMutation,
} from "../../../features/api/employeeApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
// import SimpleCalculator from "../SimpleCalculator";
import { format } from "date-fns";

const Navbar = () => {
  const { employee } = useSelector((store) => store.auth);
  // No logout mutation for employee shown, so just navigate for now
  const navigate = useNavigate();

  const logoutHandler = async () => {
    // Implement employee logout logic if available
    navigate("/employee/login");
  };
  useEffect(() => {
    // No isSuccess check for employee logout shown
    // if (isSuccess) {
    //   toast.success(data.message || "User Logged Out");
    //   navigate("/employee/login");
    // }
  }, []);

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(format(now, "hh:mm:ss a"));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-gradient-to-r from-[#FDE3C2] to-white dark:bg-gray-900 border-b border-[#EB811F]/20 dark:border-b-gray-800 fixed top-0 left-0 right-0 duration-300 z-40 shadow-sm">
      {/* Desktop Navbar */}
      <div className="hidden lg:flex justify-between items-center h-16 px-6 lg:ml-[250px]">
        <div className="flex gap-4 items-center text-[#202020] dark:text-white">
          <div className="font-medium text-sm flex items-center bg-white/60 dark:bg-gray-800/60 rounded-lg px-3 py-1.5 backdrop-blur-sm border border-[#EB811F]/10">
            <Clock className="mr-2 w-4 h-4 text-[#EB811F]" />
            <span className="text-[#202020] dark:text-white">{currentTime}</span>
          </div>
        </div>

        <Link to="/" className="flex items-center justify-center">
          <img
            src="/images/jmd_logo.jpeg"
            alt="Jai Mata Di Logo"
            className="w-12 h-12 rounded-full border-2 border-[#EB811F]/30 shadow-sm hover:shadow-md transition-shadow"
          />
        </Link>

        <div className="flex items-center gap-4">
          {employee ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="ring-2 ring-[#EB811F]/30 hover:ring-[#EB811F]/50 transition-all cursor-pointer">
                  <AvatarImage src={employee?.profileImage} alt={employee?.name} />
                  <AvatarFallback className="bg-[#EB811F] text-white font-semibold">
                    {employee?.name?.charAt(0).toUpperCase() || "E"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-[#EB811F]/20">
                <DropdownMenuLabel className="text-[#202020]">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#EB811F]/10" />
                <DropdownMenuItem className="hover:bg-[#EB811F]/10">
                  <Link to="/employee/profile" className="w-full">View Profile</Link>
                </DropdownMenuItem>
                {employee.role === "superAdmin" && (
                  <DropdownMenuItem className="hover:bg-[#EB811F]/10">
                    <Link to="/employee/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-[#EB811F]/10" />
                <DropdownMenuItem onClick={logoutHandler} className="hover:bg-red-50 text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2 items-center">
              <Link to="/employee/login">
                <Button variant="outline" className="border-[#EB811F]/40 text-[#EB811F] hover:bg-[#EB811F]/10">
                  Login
                </Button>
              </Link>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex lg:hidden justify-between items-center px-4 py-3 h-16">
        <div className="flex gap-3 items-center text-[#202020] dark:text-white">
          <div className="font-medium text-xs flex items-center bg-white/60 dark:bg-gray-800/60 rounded-lg px-2 py-1 backdrop-blur-sm border border-[#EB811F]/10">
            <Clock className="mr-1 w-3 h-3 text-[#EB811F]" />
            <span className="text-[#202020] dark:text-white">{currentTime}</span>
          </div>
        </div>

        <Link to="/" className="flex justify-center">
          <img
            src="/images/jmd_logo.jpeg"
            alt="JMD Logo"
            className="w-10 h-10 rounded-full border-2 border-[#EB811F]/30 shadow-sm"
          />
        </Link>

        <MobileNavbar />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const { employee } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    // Implement employee logout logic if available
    navigate("/employee/login");
  };
  
  useEffect(() => {
    // No isSuccess check for employee logout shown
    // if (isSuccess) {
    //   toast.success(data?.message || "User Logged Out");
    //   navigate("/employee/login");
    // }
  }, []);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-[#EB811F]/10 border-[#EB811F]/30"
          variant="outline"
        >
          <Menu className="w-4 h-4 text-[#EB811F]" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-gradient-to-br from-[#FDE3C2] to-white border-l border-[#EB811F]/20">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <Link to="/" className="content-nav-logo">
            <img
              src="/images/jmd_logo.jpeg"
              alt="JMD Logo"
              className="w-10 h-10 rounded-full border-2 border-[#EB811F]/30 shadow-sm"
            />
          </Link>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2 bg-[#EB811F]/20" />
        {employee ? (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-[#EB811F]/10">
              <Avatar className="ring-2 ring-[#EB811F]/30">
                <AvatarImage
                  src={employee?.profileImage}
                  alt={employee?.name}
                />
                <AvatarFallback className="bg-[#EB811F] text-white font-semibold">
                  {employee?.name?.charAt(0).toUpperCase() || "E"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-[#202020] text-sm">{employee?.name}</p>
                <p className="text-xs text-[#828083] capitalize">{employee?.role}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Link 
                to="/employee/profile"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#EB811F]/10 transition-colors text-[#202020]"
              >
                <School className="w-4 h-4 text-[#EB811F]" />
                <span className="text-sm font-medium">View Profile</span>
              </Link>
              
              {employee.role === "superAdmin" && (
                <Link 
                  to="/employee/dashboard"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#EB811F]/10 transition-colors text-[#202020]"
                >
                  <School className="w-4 h-4 text-[#EB811F]" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
              )}
              
              <button
                onClick={logoutHandler}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center mt-4">
            <Link to="/employee/login">
              <Button variant="outline" className="w-full border-[#EB811F]/40 text-[#EB811F] hover:bg-[#EB811F]/10">
                Login
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};