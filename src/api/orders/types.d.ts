type OrderProductType = {
  productID: string;
  quantity: number;
  price: number;
};

type CreateOrderPayload = {
  userID: string;
  totalAmount: number;
  quantity: number;
  imageUrl: string;
  products: OrderProductType[];
};

type OrderType = {
  orderID: string;
  userID: string;
  totalAmount: number;
  quantity: number;
  imageUrl: string;
  status: string;
  // Add other fields from Common if needed, e.g., createdAt, updatedAt
};

type OrderDetailType = {
  orderDetailID: string;
  orderID: string;
  productID: string;
  quantity: number;
  price: number;
  // Add other fields from Common if needed
};

type OrderProductResponseType = {
  orderDetailID: string;
  productID: string;
  quantity: number;
  price: number;
};

type OrderResponseType = {
  orderID: string;
  userID: string;
  totalAmount: number;
  quantity: number;
  imageUrl: string;
  status: string;
  products: OrderProductResponseType[];
  createdAt: string;
};
