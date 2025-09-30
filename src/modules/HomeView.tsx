import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import Products from "@/components/Products";

const HomeView = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Products />
    </div>
  );
};

export default HomeView;
