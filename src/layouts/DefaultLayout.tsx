import Navigation from "@/components/Navigation";
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
    else if (userCredentials.role === "trainer") {
      return <Navigate to="/trainer" replace />;
    }
  } 
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
