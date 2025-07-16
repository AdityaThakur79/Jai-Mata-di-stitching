import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import MainLayout from "@/layout/MainLayout";
import ContentLayout from "@/layout/ContentLayout";
import Login from "@/components/Login";
import VerifyOTP from "@/components/verifyOtp";
import NotFound from "@/utils/NotFound";
import UnAuthorized from "@/utils/UnAuthorized";
import RoleProtectedRoute from "@/utils/RoleProtectedRoute";
import EmployeeProtectedRoute from "@/utils/EmployeeProtectedRoute";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/admin/content/sidebar";
import Footer from "@/components/Footer";
import Dashboard from "@/components/admin/content/dashboard";
import Profile from "@/components/admin/content/Profile";
import CreateCustomer from "@/components/admin/content/Customer/CreateCustomer";
import UpdateCustomer from "@/components/admin/content/Customer/UpdateCustomer";
import Customers from "@/components/admin/content/Customer/Customers";
import CreateItem from "@/components/admin/content/Item/CreateItem";
import UpdateItem from "@/components/admin/content/Item/UpdateItem";
import Items from "@/components/admin/content/Item/Items";
import CreateFabric from "@/components/admin/content/Fabric/CreateFabric";
import UpdateFabrics from "@/components/admin/content/Fabric/UpdateFabrics";
import Fabrics from "@/components/admin/content/Fabric/Fabrics";
import CreateMaster from "@/components/admin/content/Master/CreateMaster";
import UpdateMaster from "@/components/admin/content/Master/UpdateMaster";
import Masters from "@/components/admin/content/Master/Masters";
import CreateSalesman from "@/components/admin/content/Salesman/CreateSalesman";
import UpdateSalesman from "@/components/admin/content/Salesman/UpdateSalesman";
import Salesmans from "@/components/admin/content/Salesman/Salesmans";
import CreateStyle from "./components/admin/content/Style/CreateStyle.jsx";
import UpdateStyle from "./components/admin/content/Style/UpdateStyle.jsx";
import Styles from "./components/admin/content/Style/Styles.jsx";
import CreatePendingOrder from "./components/admin/content/PendingOrder/CreatePendingOrder.jsx";
import UpdatePendingOrder from "./components/admin/content/PendingOrder/UpdatePendingOrder.jsx";
import RecentPendingOrders from "./components/admin/content/PendingOrder/RecentPendingOrders.jsx";
import PendingOrders from "./components/admin/content/PendingOrder/PendingOrders.jsx";
import GenerateBill from "./components/admin/content/Invoice/GenerateBill.jsx";
import Invoices from "./components/admin/content/Invoice/Invoices.jsx";
import CreateEmployee from "./components/admin/content/Employee/CreateEmployee.jsx";
import UpdateEmployee from "./components/admin/content/Employee/UpdateEmployee.jsx";
import Employee from "./components/admin/content/Employee/Employee.jsx";
import EmployeeAdvance from "./components/admin/content/Employee/EmployeeAdvance.jsx";
import EmployeeDetail from "./components/admin/content/Employee/EmployeeDetail.jsx";

// Employee Components
import EmployeeLogin from "./components/EmployeeLogin.jsx";
import EmployeeSidebar from "./components/employee/EmployeeSidebar";
import EmployeeDashboard from "@/components/employee/EmployeeDashboard";
import EmployeeProfile from "@/components/employee/EmployeeProfile";
import EmployeeSalary from "@/components/employee/EmployeeSalary";
import HeroSection from "@/components/user/herosection";
import AuthLayout from "@/layout/AuthLayout";
import AdminNavbar from "@/components/admin/content/Navbar";
import Fabric from "./components/user/Fabric.jsx";
import UserNavbar from "./components/user/Usernavbar.jsx";
import Feature from "./components/user/Feature.jsx";
import Info from "./components/user/Info.jsx";
import Categories from "./components/user/Categories.jsx";
import FabricPage from "./components/user/pages/FabricPage.jsx";
import Qa from "./components/user/Qa.jsx";
import { Gallery } from "./components/user/Gallery.jsx";

const appRouter = createBrowserRouter([
  //Homepage Routes
  {
    path: "",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
          
            <HeroSection />
            <Feature/>
            <Categories/>
          
            <Fabric />
            <Info/>
            <Qa/>
            <Gallery/>
          </>
        ),
      },
      { path: "/fabrics", element: <FabricPage /> },
      // { path: "/services", element: <Services /> },
      // { path: "/men", element: <Men /> },
      // { path: "/women", element: <Women /> },
      // { path: "/contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOTP />,
      },

      {
        path: "/unauthorized",
        element: <UnAuthorized />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  // Employee Login Route
  {
    path: "/employee/login",
    element: <EmployeeLogin />,
  },

  // Employee Routes
  {
    path: "employee",
    element: (
      <EmployeeProtectedRoute>
        <EmployeeSidebar />
      </EmployeeProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <EmployeeDashboard />,
      },
      {
        path: "profile",
        element: <EmployeeProfile />,
      },
      {
        path: "salary",
        element: <EmployeeSalary />,
      },
    ],
  },

  {
    path: "admin",
    element: (
      <RoleProtectedRoute allowedRoles={["superAdmin"]}>
        <>
          <AdminNavbar />
          <Sidebar />
          <Footer />
        </>
      </RoleProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },

      //Customer master
      {
        path: "create-customer",
        element: <CreateCustomer />,
      },
      {
        path: "update-customer",
        element: <UpdateCustomer />,
      },
      {
        path: "customers",
        element: <Customers />,
      },

      //Item master
      {
        path: "create-item",
        element: <CreateItem />,
      },
      {
        path: "update-item",
        element: <UpdateItem />,
      },
      {
        path: "items",
        element: <Items />,
      },

      //Fabric master
      {
        path: "create-fabric",
        element: <CreateFabric />,
      },
      {
        path: "update-fabric",
        element: <UpdateFabrics />,
      },
      {
        path: "fabrics",
        element: <Fabrics />,
      },

      //Master master
      {
        path: "create-master",
        element: <CreateMaster />,
      },
      {
        path: "update-master",
        element: <UpdateMaster />,
      },
      {
        path: "masters",
        element: <Masters />,
      },

      //Salesman master
      {
        path: "create-salesman",
        element: <CreateSalesman />,
      },
      {
        path: "update-salesman",
        element: <UpdateSalesman />,
      },
      {
        path: "salesmans",
        element: <Salesmans />,
      },

      //Style master
      {
        path: "create-style",
        element: <CreateStyle />,
      },
      {
        path: "update-style",
        element: <UpdateStyle />,
      },
      {
        path: "styles",
        element: <Styles />,
      },

      //Pendingorder master
      {
        path: "create-pending-order",
        element: <CreatePendingOrder />,
      },
      {
        path: "update-pending-order",
        element: <UpdatePendingOrder />,
      },
      {
        path: "recent-pending-order",
        element: <RecentPendingOrders />,
      },
      {
        path: "pending-orders",
        element: <PendingOrders />,
      },
      //Invoices
      {
        path: "generate-bill",
        element: <GenerateBill />,
      },
      {
        path: "invoices",
        element: <Invoices />,
      },
      //Employee
      {
        path: "create-employee",
        element: <CreateEmployee />,
      },
      {
        path: "update-employee",
        element: <UpdateEmployee />,
      },
      {
        path: "employees",
        element: <Employee />,
      },
      {
        path: "employee-advance",
        element: <EmployeeAdvance />,
      },
      {
        path: "employee-detail",
        element: <EmployeeDetail />,
      },
    ],
  },
]);

function App() {
  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );
}

export default App;
