import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Utensils,
  TrendingUp,
  Clock,
  MessageCircle,
  DollarSign,
  Dumbbell,
  Award,
  UserCircle,
  Star,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";

const TrainerLayout = () => {
  const navigate = useNavigate();
  const { userCredentials } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!!userCredentials) {
    if (userCredentials.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    else if (userCredentials.role === "user") {
      return <Navigate to="/" replace />;
    }
  } 

  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      path: "/trainer/dashboard",
    },
    {
      icon: <Dumbbell className="h-5 w-5" />,
      label: "My Classes",
      path: "/trainer/classes",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Sessions",
      path: "/trainer/sessions",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Clients",
      path: "/trainer/clients",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Booking Requests",
      path: "/trainer/bookings",
    },
    {
      icon: <Utensils className="h-5 w-5" />,
      label: "Diet Plans",
      path: "/trainer/diet-plans",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: "Client Progress",
      path: "/trainer/progress",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Schedule",
      path: "/trainer/schedule",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Messages",
      path: "/trainer/messages",
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: "Earnings",
      path: "/trainer/earnings",
    },
    {
      icon: <Dumbbell className="h-5 w-5" />,
      label: "Workout Programs",
      path: "/trainer/programs",
    },
    {
      icon: <Award className="h-5 w-5" />,
      label: "Certifications",
      path: "/trainer/certifications",
    },
    {
      icon: <UserCircle className="h-5 w-5" />,
      label: "Profile",
      path: "/trainer/profile",
    },
    {
      icon: <Star className="h-5 w-5" />,
      label: "Reviews",
      path: "/trainer/reviews",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden rounded-lg bg-accent p-2 text-white"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-card transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b p-6">
            <h1 className="flex items-center gap-2 text-xl font-bold text-accent">
              <Dumbbell className="h-6 w-6" />
              PrimePulse Trainer
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Back to User View
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default TrainerLayout;
