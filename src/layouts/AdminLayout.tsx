import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  BookOpen,
  ShoppingCart,
  Package,
  DollarSign,
  CreditCard,
  FileText,
  Settings,
  MessageSquare,
  Bell,
  Menu,
  X,
  LogOut,
  ClipboardCheck,
} from "lucide-react";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandItem, CommandList } from "@/components/ui/command";

const AdminLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userCredentials, userLogout, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    if (!!userCredentials) {
      if (userCredentials.role === "user") {
        return <Navigate to="/" replace />;
      } else if (userCredentials.role === "trainer") {
        return <Navigate to="/trainer" replace />;
      }
    }
  } else {
    return <Navigate to="/" replace />;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Trainers", href: "/admin/trainers", icon: UserCog },
    { name: "Classes", href: "/admin/classes", icon: Calendar },
    { name: "Bookings", href: "/admin/bookings", icon: BookOpen },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Revenue", href: "/admin/revenue", icon: DollarSign },
    { name: "Memberships", href: "/admin/memberships", icon: CreditCard },
    { name: "Membership Requests", href: "/admin/membership-requests", icon: ClipboardCheck },
    // { name: "Content", href: "/admin/content", icon: FileText },
    // { name: "Reports", href: "/admin/reports", icon: FileText },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    // { name: "Notifications", href: "/admin/notifications", icon: Bell },
    // { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-accent">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r transition-transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="hidden lg:flex h-16 items-center justify-between border-b px-6">
            <h1 className="text-xl font-bold text-accent">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 mt-16 lg:mt-0">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive(item.href)
                          ? "bg-accent text-white"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info */}
          <div className="border-t p-4">
            <Popover>
              <PopoverTrigger asChild className="cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold">
                    {userCredentials?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {userCredentials?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {userCredentials?.email}
                    </p>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <Command>
                  <CommandList>
                    <CommandItem onSelect={userLogout}>
                      <LogOut className="text-white mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </CommandItem>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
