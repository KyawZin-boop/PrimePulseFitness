import { CommandDialog } from "@/components/CommandDialog";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import useAuth from "@/hooks/useAuth";
import { useThemeStore } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { theme } = useThemeStore();
  const { isAuthenticated, userCredentials } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (isAuthenticated && !!userCredentials) {
    if (
      userCredentials.role === "user" ||
      userCredentials.role === "designer"
    ) {
      return <Navigate to="/" replace />;
    }
  } else {
    return <Navigate to="/auth/login" replace />;
  }
  return (
    <>
      <div
        className={cn(
          "flex h-screen overflow-hidden",
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        )}
      >
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
      <CommandDialog />
    </>
  );
};

export default AdminLayout;
