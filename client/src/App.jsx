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
  //Content Dashboard Routes
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
