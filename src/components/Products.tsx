import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";
import equipmentImage from "@/assets/gym-equipment.jpg";
import clothesImage from "@/assets/gym-clothes.jpg";

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Premium Dumbbells Set",
      category: "Equipment",
      price: 299,
      rating: 4.9,
      image: equipmentImage,
      description: "Professional-grade adjustable dumbbells for home and gym use"
    },
    {
      id: 2,
      name: "Athletic Workout Gear",
      category: "Apparel",
      price: 89,
      rating: 4.8,
      image: clothesImage,
      description: "High-performance moisture-wicking athletic wear collection"
    },
    {
      id: 3,
      name: "Resistance Bands Pro",
      category: "Equipment",
      price: 49,
      rating: 4.7,
      image: equipmentImage,
      description: "Complete resistance training system with multiple resistance levels"
    },
    {
      id: 4,
      name: "Performance Activewear",
      category: "Apparel",
      price: 129,
      rating: 4.9,
      image: clothesImage,
      description: "Premium activewear designed for peak performance and comfort"
    }
  ];

  return (
    <section id="products" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-heading mb-4">Premium Fitness Store</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of professional-grade equipment and athletic wear
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product) => (
            <Card key={product.id} className="bg-gradient-card border-0 shadow-card hover:shadow-athletic transition-athletic group overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-athletic"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {product.description}
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="flex items-center justify-between pt-0">
                <div className="text-2xl font-black text-primary">
                  ${product.price}
                </div>
                <Button variant="athletic" size="sm" className="group">
                  <ShoppingCart className="mr-2 h-4 w-4 group-hover:scale-110 transition-athletic" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline_athletic" size="xl">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;