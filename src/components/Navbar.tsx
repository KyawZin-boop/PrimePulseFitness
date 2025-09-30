import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell, User } from "lucide-react";
import { useThemeStore } from "@/lib/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { SearchCommand } from "./SearchCommand";

export const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { userLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    userLogout();
    googleLogout();
    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-border bg-background">
      <div className="text-lg font-semibold">Dashboard</div>

      <div className="flex items-center gap-4 ml-auto">
        <SearchCommand />

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
