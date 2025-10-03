import Classes from "@/components/Classes";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import Products from "@/components/Products";
import Trainers from "@/components/Trainers";
import useAuth from "@/hooks/useAuth";

const HomeView = () => {

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Products />
      <Classes />
      <Trainers />
      <Footer />
    </div>
  );
};

export default HomeView;
