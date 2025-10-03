type ProductType = {
  productID: string;
  categoryID: string;
  categoryName: string;
  name: string;
  description?: string;
  imageUrl?: string;
  sellingPrice: number;
  buyingPrice: number;
  stock: number;
  discount: number;
  rating: number;
};

type AddProductPayload = {
  categoryID: string;
  name: string;
  description?: string;
  imageUrl?: string;
  sellingPrice: number;
  buyingPrice: number;
  stock: number;
  discount: number;
  rating: number;
};

type UpdateProductPayload = AddProductPayload & {
  productID: string;
};
