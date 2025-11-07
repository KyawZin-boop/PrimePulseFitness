import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { userNavItems } from "@/constants";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userLogout } = useAuth();
  const { totalItems } = useSelector((state: RootState) => state.cart);

  const handleCartClick = () => {
    navigate("/shop/cart");
  };

  const handleLogout = () => {
    userLogout();
    googleLogout();
    navigate("/auth/login");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 items-center h-16">
          {/* Logo */}
          <div className="text-heading font-black text-primary">
            PRIME PULSE
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-8">
            {userNavItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  `font-medium transition-athletic hover:text-accent ${
                    isActive ? "text-accent" : "text-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 justify-end">
            <Button variant="ghost" size="icon" className="relative" onClick={handleCartClick}>
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </Button>

            {!isAuthenticated ? (
              <NavLink to={"/auth/login"}>
                <Button variant="hero" size="lg">
                  Join Now
                </Button>
              </NavLink>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/bookings")}>My Bookings</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/membership")}>Membership</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/my-diet")}>My Diet Plan</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/my-workout")}>My Workout Plan</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/progress")}>My Progress</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/orders")}>
                        Order History
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/delivery")}>
                        Delivery Tracking
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleLogout()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {userNavItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  end={item.href === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `font-medium transition-athletic hover:text-accent ${
                      isActive ? "text-accent" : "text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="flex items-center space-x-4 pt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => {
                    handleCartClick();
                    setIsOpen(false);
                  }}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                      {totalItems}
                    </span>
                  )}
                </Button>
                {!isAuthenticated ? (
                  <NavLink to={"/auth/login"} onClick={() => setIsOpen(false)}>
                    <Button variant="hero" size="lg">
                      Join Now
                    </Button>
                  </NavLink>
                ) : (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <User size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="" align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/bookings")}>My Bookings</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/membership")}>Membership</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/my-diet")}>My Diet Plan</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/my-workout")}>My Workout Plan</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/progress")}>My Progress</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/orders")}>
                            Order History
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/delivery")}>
                            Delivery Tracking
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleLogout()}>
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
