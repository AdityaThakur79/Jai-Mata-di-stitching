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
  useLoadUserQuery,
  useLogoutUserMutation,
} from "../../../features/api/common/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import SimpleCalculator from "../SimpleCalculator";
 import { format } from "date-fns";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isLoading, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
 
  const logoutHandler = async () => {
    await logoutUser();
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User Logged Out");
      navigate("/auth/login");
    }
  }, [isSuccess]);

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
 <div className="dark:bg-gray-900 bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
  <div className="container mx-auto px-4 md:px-10 py-0 hidden md:flex justify-between items-center">
    <div className="flex gap-4 items-center text-gray-700 dark:text-white">
       <div className="font-medium text-sm flex items-center"><Clock className="mr-1"/>{currentTime}</div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="hover:opacity-75">
            <Calculator size={20} />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-sm w-full">
          {/* <SimpleCalculator /> */}
        </DialogContent>
      </Dialog>
    </div>

    <Link to="/" className="flex items-center justify-center">
      <img
        src="/images/jmd_logo.jpeg"
        alt="Jai Mata Di Logo"
        className="w-28 h-auto object-contain"
      />
    </Link>

    <div className="flex items-center gap-4 cursor-pointer">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage
                src={
                  user?.photoUrl
                    ? `/uploads/profile/${user?.photoUrl}`
                    : "https://github.com/shadcn.png"
                }
                alt={user?.name}
              />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="profile">Edit Profile</Link>
            </DropdownMenuItem>
            {user.role === "superAdmin" && (
              <DropdownMenuItem>
                <Link to="/admin/dashboard">Dashboard</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutHandler}>
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2 items-center">
          <Link to="/auth/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      )}
      <DarkMode />
    </div>
  </div>

  <div className="flex md:hidden justify-between items-center px-4 py-2">
    <div className="flex gap-2 text-gray-700 dark:text-white">
      <Clock size={20} />
      <Calculator size={20} />
    </div>

    <Link to="/" className="flex justify-center">
      <img
        src="/images/jmd_logo.jpeg"
        alt="JMD Logo"
        className="w-24 h-auto object-contain"
      />
    </Link>

    <MobileNavbar />
  </div>
</div>

  );
};

export default Navbar;

const MobileNavbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isLoading, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User Logged Out");
      navigate("/");
    }
  }, [isSuccess]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <Link to="/" className="content-nav-logo">
            <figure>
              <img
                src="/images/user/common/dellcube-favicon.png"
                alt="AI Logo"
                width={50}
                height={50}
              />
            </figure>
          </Link>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        {user ? (
          <div className="flex flex-col gap-2">
            <Avatar>
              <AvatarImage
                src={
                  `/uploads/profile/${user?.photoUrl}` ||
                  "https://github.com/shadcn.png"
                }
                alt={user?.name}
              />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>{" "}
            </Avatar>

            {/* <Link to="mylearning">My Learning</Link> */}
            <DropdownMenuSeparator />
            <Link to="/admin/profile">Edit Profile</Link>
            <DropdownMenuSeparator />
            {user.role == "superAdmin" && (
              <Link to="/admin/dashboard">Dashboard</Link>
            )}
            <DropdownMenuSeparator />
            <div onClick={logoutHandler}>
              <span>
                <LogOut />
                Log out
              </span>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <Link to="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            {/* <Link to="/auth/login">
              {" "}
              <Button>Signup</Button>
            </Link> */}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
