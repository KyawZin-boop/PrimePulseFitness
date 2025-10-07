import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Classes from "@/components/Classes";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Trainers from "@/components/Trainers";

const HomeView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const scrollTarget = state.scrollTo;
      const scrollToSection = () => {
        const element = document.getElementById(scrollTarget);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      // Give the page time to render before attempting to scroll
      const timeout = window.setTimeout(scrollToSection, 150);

      // Clean up navigation state so the effect doesn't run again unnecessarily
      navigate(".", { replace: true });

      return () => window.clearTimeout(timeout);
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Products />
      <Classes />
      <Trainers />
      <Footer />
    </div>
  );
};

export default HomeView;
