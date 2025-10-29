import AuthLayout from "@/layouts/AuthLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import TrainerLayout from "@/layouts/TrainerLayout";
import AdminLayout from "@/layouts/AdminLayout";
import HomeView from "@/modules/HomeView";
import ClassesView from "@/modules/classes/ClassesView";
import ClassDetailView from "@/modules/classes/ClassDetailView";
import ContactView from "@/modules/contact/ContactView";
import ProfileView from "@/modules/user/ProfileView";
import BookingView from "@/modules/bookings/BookingView";
import DietPlansView from "@/modules/diet/DietPlansView";
import UserDietView from "@/modules/diet/UserDietView";
import UserWorkoutView from "@/modules/user/UserWorkoutView";
import ProgressView from "@/modules/progress/ProgressView";
import StoreView from "@/modules/store/StoreView";
import CheckoutView from "@/modules/store/CheckoutView";
import CartView from "@/modules/store/CartView";
import OrderHistory from "@/modules/user/OrderHistory";
import OrderDetail from "@/modules/user/OrderDetail";
import DeliveryView from "@/modules/user/DeliveryView";
import MessagesView from "@/modules/messages/MessagesView";
import TrainersView from "@/modules/trainers/TrainersView";
import TrainerDetailView from "@/modules/trainers/TrainerDetailView";
import LoginView from "@/modules/auth/Login/LoginView";
import RegisterView from "@/modules/auth/Register/RegisterView";
import TrainerDashboard from "@/modules/trainer/TrainerDashboard";
import TrainerClassesView from "@/modules/trainer/TrainerClassesView";
import TrainerClassRosterView from "@/modules/trainer/TrainerClassRosterView";
import TrainerAllRostersView from "@/modules/trainer/TrainerAllRostersView";
import TrainerSessionsView from "@/modules/trainer/TrainerSessionsView";
import TrainerClientsView from "@/modules/trainer/TrainerClientsView";
import TrainerClientDetailView from "@/modules/trainer/TrainerClientDetailView";
import TrainerBookingsView from "@/modules/trainer/TrainerBookingsView";
import TrainerDietPlansView from "@/modules/trainer/TrainerDietPlansView";
import TrainerClientProgressView from "@/modules/trainer/TrainerClientProgressView";
import TrainerScheduleView from "@/modules/trainer/TrainerScheduleView";
import TrainerMessagesView from "@/modules/trainer/TrainerMessagesView";
import TrainerEarningsView from "@/modules/trainer/TrainerEarningsView";
import TrainerProgramsView from "@/modules/trainer/TrainerProgramsView";
import TrainerCertificationsView from "@/modules/trainer/TrainerCertificationsView";
import TrainerProfileView from "@/modules/trainer/TrainerProfileView";
import TrainerReviewsView from "@/modules/trainer/TrainerReviewsView";
import AdminDashboard from "@/modules/admin/AdminDashboard";
import AdminUsersView from "@/modules/admin/AdminUsersView";
import AdminUserProfile from "@/modules/admin/AdminUserProfile";
import AdminTrainersView from "@/modules/admin/AdminTrainersView";
import AdminTrainerProfile from "@/modules/admin/AdminTrainerProfile";
import AdminClassesView from "@/modules/admin/AdminClassesView";
import AdminClassDetailView from "@/modules/admin/AdminClassDetailView";
import AdminBookingsView from "@/modules/admin/AdminBookingsView";
import AdminProductsView from "@/modules/admin/AdminProductsView";
import AdminOrdersView from "@/modules/admin/AdminOrdersView";
import AdminRevenueView from "@/modules/admin/AdminRevenueView";
import AdminMembershipsView from "@/modules/admin/AdminMembershipsView";
import AdminContentView from "@/modules/admin/AdminContentView";
import AdminReportsView from "@/modules/admin/AdminReportsView";
import AdminSettingsView from "@/modules/admin/AdminSettingsView";
import AdminReviewsView from "@/modules/admin/AdminReviewsView";
import AdminNotificationsView from "@/modules/admin/AdminNotificationsView";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        {
          path: "",
          element: <HomeView />,
        },
        {
          path: "classes",
          element: <ClassesView />,
        },
        {
          path: "classes/:classId",
          element: <ClassDetailView />,
        },
        {
          path: "profile",
          element: <ProfileView />,
        },
        {
          path: "bookings",
          element: <BookingView />,
        },
        {
          path: "diet-plans",
          element: <DietPlansView />,
        },
        {
          path: "my-diet",
          element: <UserDietView />,
        },
        {
          path: "my-workout",
          element: <UserWorkoutView />,
        },
        {
          path: "progress",
          element: <ProgressView />,
        },
        {
          path: "shop",
          element: <StoreView />,
        },
        {
          path: "shop/cart",
          element: <CartView />,
        },
        {
          path: "orders",
          element: <OrderHistory />,
        },
        {
          path: "orders/:orderId",
          element: <OrderDetail />,
        },
        {
          path: "delivery",
          element: <DeliveryView />,
        },
        {
          path: "checkout",
          element: <CheckoutView />,
        },
        {
          path: "messages",
          element: <MessagesView />,
        },
        {
          path: "trainers",
          element: <TrainersView />,
        },
        {
          path: "trainers/:trainerId",
          element: <TrainerDetailView />,
        },
        {
          path: "contact",
          element: <ContactView />,
        },
      ],
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <LoginView />,
        },
        {
          path: "register",
          element: <RegisterView />,
        },
      ],
    },
    {
      path: "/trainer",
      element: <TrainerLayout />,
      children: [
        {
          path: "",
          element: <TrainerDashboard />,
        },
        {
          path: "classes",
          element: <TrainerClassesView />,
        },
        {
          path: "classes/roster",
          element: <TrainerAllRostersView />,
        },
        {
          path: "classes/:classId/roster",
          element: <TrainerClassRosterView />,
        },
        {
          path: "sessions",
          element: <TrainerSessionsView />,
        },
        {
          path: "clients",
          element: <TrainerClientsView />,
        },
        {
          path: "clients/:clientId",
          element: <TrainerClientDetailView />,
        },
        {
          path: "bookings",
          element: <TrainerBookingsView />,
        },
        {
          path: "diet-plans",
          element: <TrainerDietPlansView />,
        },
        {
          path: "progress",
          element: <TrainerClientProgressView />,
        },
        {
          path: "schedule",
          element: <TrainerScheduleView />,
        },
        {
          path: "messages",
          element: <TrainerMessagesView />,
        },
        {
          path: "earnings",
          element: <TrainerEarningsView />,
        },
        {
          path: "programs",
          element: <TrainerProgramsView />,
        },
        {
          path: "certifications",
          element: <TrainerCertificationsView />,
        },
        {
          path: "profile",
          element: <TrainerProfileView />,
        },
        {
          path: "reviews",
          element: <TrainerReviewsView />,
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "",
          element: <AdminDashboard />,
        },
        {
          path: "users",
          element: <AdminUsersView />,
        },
        {
          path: "users/:userId",
          element: <AdminUserProfile />,
        },
        {
          path: "trainers",
          element: <AdminTrainersView />,
        },
        {
          path: "trainers/:trainerId",
          element: <AdminTrainerProfile />,
        },
        {
          path: "classes",
          element: <AdminClassesView />,
        },
        {
          path: "classes/:classId",
          element: <AdminClassDetailView />,
        },
        {
          path: "classes/:classId",
          element: <AdminClassesView />,
        },
        {
          path: "bookings",
          element: <AdminBookingsView />,
        },
        {
          path: "products",
          element: <AdminProductsView />,
        },
        {
          path: "orders",
          element: <AdminOrdersView />,
        },
        {
          path: "revenue",
          element: <AdminRevenueView />,
        },
        {
          path: "memberships",
          element: <AdminMembershipsView />,
        },
        {
          path: "content",
          element: <AdminContentView />,
        },
        {
          path: "reports",
          element: <AdminReportsView />,
        },
        {
          path: "settings",
          element: <AdminSettingsView />,
        },
        {
          path: "reviews",
          element: <AdminReviewsView />,
        },
        {
          path: "notifications",
          element: <AdminNotificationsView />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
};

export default Router;
