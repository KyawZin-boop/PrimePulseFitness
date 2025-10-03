import useAuth from "@/hooks/useAuth";
import { useThemeStore } from "@/lib/theme";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const DefaultLayout = () => {
  const { theme } = useThemeStore();
  const { userCredentials } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (!!userCredentials) {
    if (userCredentials.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
  } 
  
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
