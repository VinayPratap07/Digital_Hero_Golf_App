import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./Pages/LoginPage.tsx";
import HomePage from "./Pages/HomePage.tsx";
import CharityPage from "./Pages/CharityPage.tsx";
import Signup from "./Pages/SignupPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaymentPage from "./Pages/PaymentPage.tsx";
import SubscriptionPage from "./Pages/Join_Us.tsx";
import ProfilePage from "./Pages/ProfilePage.tsx";
import AdminDashboard from "./Admin/Dashboard.tsx";
import Admin from "./Admin/Admin.tsx";
import AdminUsersPage from "./Admin/User.tsx";
import AdminDrawsPage from "./Admin/Draws.tsx";
import AdminCharitiesPage from "./Admin/Charities.tsx";
import AdminWinnersPage from "./Admin/Winners.tsx";
import AdminAnalyticsPage from "./Admin/Analytics.tsx";
import MonthlyDraw from "./Pages/MonthlyDrawPage.tsx";
import CharitySelector from "./Pages/SelectCharityPage.tsx";
import WinnerClaimVerificationPage from "./Pages/WinnerVerificaitonPage.tsx";
import AdminVerificationsHubPage from "./Admin/VerifyWinner.tsx";
import AboutUs from "./Pages/AboutUsPage.tsx";
import PaymentSuccessPage from "./Component/SuccessPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/charity",
        element: <CharityPage />,
      },
      {
        path: "join-us",
        element: <SubscriptionPage />,
      },
      {
        path: "/monthly-draw",
        element: <MonthlyDraw />,
      },
      {
        path: "verification",
        element: <WinnerClaimVerificationPage />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
    ],
  },
  {
    path: "admin",
    element: <Admin />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUsersPage />,
      },
      {
        path: "draws",
        element: <AdminDrawsPage />,
      },
      {
        path: "charities",
        element: <AdminCharitiesPage />,
      },
      {
        path: "winners",
        element: <AdminWinnersPage />,
      },
      {
        path: "analytics",
        element: <AdminAnalyticsPage />,
      },
      {
        path: "verification",
        element: <AdminVerificationsHubPage />,
      },
    ],
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/select-charity",
    element: <CharitySelector />,
  },
  {
    path: "/payment-gateway",
    element: <PaymentPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/subscription/success",
    element: <PaymentSuccessPage />,
  },

  {
    path: "*",
    element: <App />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
