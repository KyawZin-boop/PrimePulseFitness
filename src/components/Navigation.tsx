import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { NavLink } from "react-router-dom";
import LogoutDialog from "./dialogs/LogoutDialog";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userCredentials } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-heading font-black text-primary">
            FITZONE
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-accent transition-athletic font-medium">
              Home
            </a>
            <a href="#products" className="text-foreground hover:text-accent transition-athletic font-medium">
              Shop
            </a>
            <a href="#classes" className="text-foreground hover:text-accent transition-athletic font-medium">
              Classes
            </a>
            <a href="#trainers" className="text-foreground hover:text-accent transition-athletic font-medium">
              Trainers
            </a>
            <a href="#contact" className="text-foreground hover:text-accent transition-athletic font-medium">
              Contact
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            
            {!isAuthenticated ? (
              <NavLink to={"/auth/login"}>
                <Button variant="hero" size="lg">
                  Join Now
                </Button>
              </NavLink>
            ) : (
              <>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <LogoutDialog>
                  <Button variant="destructive" size="lg">
                    Log Out
                  </Button>
                </LogoutDialog>
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
              <a href="#home" className="text-foreground hover:text-accent transition-athletic font-medium">
                Home
              </a>
              <a href="#products" className="text-foreground hover:text-accent transition-athletic font-medium">
                Shop
              </a>
              <a href="#classes" className="text-foreground hover:text-accent transition-athletic font-medium">
                Classes
              </a>
              <a href="#trainers" className="text-foreground hover:text-accent transition-athletic font-medium">
                Trainers
              </a>
              <a href="#contact" className="text-foreground hover:text-accent transition-athletic font-medium">
                Contact
              </a>
              <div className="flex items-center space-x-4 pt-4">
                <Button variant="ghost" size="icon">
                  <ShoppingBag className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                {!isAuthenticated ? (
                  <NavLink to={"/auth/login"}>
                    <Button variant="hero" size="lg">
                      Join Now
                    </Button>
                  </NavLink>
                ) : (
                  <>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                    <LogoutDialog>
                      <Button variant="destructive" size="lg">
                        Log Out
                      </Button>
                    </LogoutDialog>
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