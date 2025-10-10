import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";
import api from "@/api";
import { NavLink, useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const { data: products } = api.products.getPopularProducts.useQuery();

  return (
    <section id="products" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-heading mb-4">Premium Fitness Store</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of professional-grade equipment and
            athletic wear
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products &&
            products.map((product) => (
              <Card
                key={product.productID}
                className="bg-gradient-card pt-0 border-0 shadow-card hover:shadow-athletic transition-athletic group overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-athletic"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
                      {product.categoryName}
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-3 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg font-bold">
                      {product.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex flex-col pt-0">
                  <div className="text-md font-black text-primary text-left mb-2 w-full">
                    <span className="text-accent text-sm">Price - </span>
                    <span>{product.sellingPrice.toFixed(0)} Kyat</span>
                  </div>
                  <Button
                    variant="athletic"
                    size="sm"
                    className="group w-full"
                    onClick={() => navigate("/shop")}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4 group-hover:scale-110 transition-athletic" />
                    Go to Shop
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>

        <div className="text-center">
          <NavLink to="/shop">
            <Button variant="outline_athletic" size="xl">
              View All Products
            </Button>
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default Products;
