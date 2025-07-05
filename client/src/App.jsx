import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";
import { ThemeProvider } from "./components/ThemeProvider";
import Login from "./components/Login.jsx";
import Dashboard from "./components/admin/content/dashboard.jsx";
import VerifyOTP from "./components/verifyOtp.jsx";
import ContentLayout from "./layout/ContentLayout.jsx";
import Sidebar from "./components/admin/content/sidebar.jsx";
import Footer from "@/components/admin/content/Footer";
import Navbar from "@/components/admin/content/Navbar.jsx";
import Profile from "./components/admin/content/Profile.jsx";
import RoleProtectedRoute from "./utils/RoleProtectedRoute.jsx";
import UnAuthorized from "./utils/UnAuthorized.jsx";
import NotFound from "./utils/NotFound.jsx";
import CreateCustomer from "./components/admin/content/Customer/CreateCustomer.jsx";
import UpdateCustomer from "./components/admin/content/Customer/UpdateCustomer.jsx";
import Customers from "./components/admin/content/Customer/Customers.jsx";
import Items from "./components/admin/content/Item/Items.jsx";
import CreateItem from "./components/admin/content/Item/CreateItem.jsx";
import UpdateItem from "./components/admin/content/Item/UpdateItem.jsx";
import CreateFabric from "./components/admin/content/Fabric/CreateFabric.jsx";
import UpdateFabric from "./components/admin/content/Fabric/UpdateFabrics.jsx";
import Fabrics from "./components/admin/content/Fabric/Fabrics.jsx";
import CreateMaster from "./components/admin/content/Master/CreateMaster.jsx";
import UpdateMaster from "./components/admin/content/Master/UpdateMaster.jsx";
import Masters from "./components/admin/content/Master/Masters.jsx";
import CreateSalesman from "./components/admin/content/Salesman/CreateSalesman.jsx";
import UpdateSalesman from "./components/admin/content/Salesman/UpdateSalesman.jsx";
import Salesmans from "./components/admin/content/Salesman/Salesmans.jsx";
import CreateStyle from "./components/admin/content/Style/CreateStyle.jsx";
import UpdateStyle from "./components/admin/content/Style/UpdateStyle.jsx";
import Styles from "./components/admin/content/Style/Styles.jsx";
import CreatePendingOrder from "./components/admin/content/PendingOrder/CreatePendingOrder.jsx";
import UpdatePendingOrder from "./components/admin/content/PendingOrder/UpdatePendingOrder.jsx";
import RecentPendingOrders from "./components/admin/content/PendingOrder/RecentPendingOrders.jsx";
import PendingOrders from "./components/admin/content/PendingOrder/PendingOrders.jsx";
import GenerateBill from "./components/admin/content/Invoice/GenerateBill.jsx";
import Invoices from "./components/admin/content/Invoice/Invoices.jsx";

const appRouter = createBrowserRouter([
  //Homepage Routes
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "",
        element: <Login />,
      },
      {
        path: "verify-otp",
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

  //Auth Routes
  // {
  //   path: "/auth",
  //   element: <ContentLayout />,
  //   children: [
  //     {
  //       path: "login",
  //       element: <Login />,
  //     },
  //     {
  //       path: "signup",
  //       element: <Login />,
  //     },
  //     {
  //       path: "verify-otp",
  //       element: <VerifyOTP />,
  //     },
  //   ],
  // },

  {
    path: "admin",
    element: (
      <RoleProtectedRoute allowedRoles={["superAdmin"]}>
        <>
          <Navbar />
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
        element: <UpdateFabric />,
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

      //Invoice
      {
        path: "generate-bill",
        element: <GenerateBill/>,
      },
      {
        path: "invoices",
        element: <Invoices/>,
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
