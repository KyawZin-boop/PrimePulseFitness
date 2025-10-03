import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { isAuthenticated, userCredentials } = useAuth();

  if (isAuthenticated && !!userCredentials) {
    if (userCredentials.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (
      userCredentials.role === "user" ||
      userCredentials.role === "trainer"
    ) {
      return <Navigate to="/" replace />;
    }
  }

  return (
    <div className="w-full h-screen">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
