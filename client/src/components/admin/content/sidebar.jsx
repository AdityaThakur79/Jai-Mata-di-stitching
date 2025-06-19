import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  ChartNoAxesColumn,
  LucideHeadset,
  Pointer,
  SquareLibrary,
  Tags,
  Trophy,
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
import { useLoadUserQuery } from "@/features/api/common/authApi";
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
            <AccordionItem value="item-13">
              <Link
                to="dashboard"
                className="flex items-center gap-2 hover:text-[#FFCA00] py-4 px-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ChartNoAxesColumn size={22} />
                <h2 className="text-sm">Dashboard</h2>
              </Link>
            </AccordionItem>
            <AccordionItem value="item-17">
              <AccordionTrigger className="hover:no-underline">
                SiteIdentity
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="create-site-identity"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Create Site Identity</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="site-identity"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Update Site Identity</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:no-underline">
                Herosection
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="herosection"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>All HeroSection</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="create-herosection"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2> Add HeroSection</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="hover:no-underline">
                About
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="create-about"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Create About</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="about"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Update About</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="hover:no-underline">
                Why Choose Us
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="whychooseus"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>All Why Choose Us</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="create-whychooseus"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2> Add Why Choose Us</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="hover:no-underline">
                Services
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="create-service"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Add Services</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="services"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>All Services</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="hover:no-underline">
                Shipping
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="shipping"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Video</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="create-shipping"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2> Add Video Section</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger className="hover:no-underline">
                Features
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="features"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>All Features</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="create-feature"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2> Add Feature</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger className="hover:no-underline">
                Clients
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="clients"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>All Clients</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="create-client"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2> Add Clients</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger className="hover:no-underline">
                Testimonials
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="testimonials"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>All Testimonials</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="create-testimonial"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2> Add Testimonials</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-16">
              <AccordionTrigger className="hover:no-underline">
                CTA
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="create-cta"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Add CTA</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="cta"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Update CTA</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
              <AccordionItem value="item-18">
              <AccordionTrigger className="hover:no-underline">
                Awards
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="create-award"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Add Award</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="awards"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>All Awards</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-14">
              <AccordionTrigger className="hover:no-underline">
                About Us Page
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="create-about-us"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Add About Page</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="about-us"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Update About Page</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-15">
              <AccordionTrigger className="hover:no-underline">
                Team 
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="create-team"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Add Team Member</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="team"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>All Team Member</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-9">
              <AccordionTrigger className="hover:no-underline">
                Contact Page
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="create-contact"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Add Contact Page</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="contact"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>Update Contact Page</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-10">
              <AccordionTrigger className="hover:no-underline">
                Faq Page
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="faqs"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaQuestionCircle size={22} />
                  <h2>All Faqs</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="create-faq"
                  className="flex items-center gap-2 hover:text-[#FFCA00] "
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CiCircleList size={22} />
                  <h2> Add Faqs</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-11">
              <AccordionTrigger className="hover:no-underline">
                Blogs
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="dashboard"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2>All BLogs</h2>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link
                  to="dashboard"
                  className="flex items-center gap-2 hover:text-[#FFCA00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChartNoAxesColumn size={22} />
                  <h2> Add Blogs</h2>
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-12">
              <Link
                to="enquiry"
                className="flex items-center gap-2 py-4 px-0 hover:text-[#FFCA00]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <h2 className="text-sm">Enquiry</h2>
              </Link>
            </AccordionItem>
          </Accordion>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="px-0">
                {" "}
                <Avatar>
                  <AvatarImage
                    src={`/uploads/profile/${user?.photoUrl}` || ""}
                    alt={user?.name}
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                Profile
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-50">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage
                    src={
                      `/uploads/profile/${user?.photoUrl}` ||
                      "https://github.com/shadcn.png"
                    }
                    alt={user?.name}
                  />
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
