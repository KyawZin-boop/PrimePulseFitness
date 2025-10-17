import * as auth from "./auth";
import * as products from "./products";
import * as classes from "./classes";
import * as trainers from "./trainer";
import * as categories from "./categories";
import * as bookings from "./bookings";
import * as files from "./files";
import * as chat from "./chat";
import * as user from "./user";
import * as orders from "./orders";

class API {
  auth: typeof auth;
  products: typeof products;
  classes: typeof classes;
  trainers: typeof trainers;
  categories: typeof categories;
  bookings: typeof bookings;
  files: typeof files;
  chat: typeof chat;
  user: typeof user;
  orders: typeof orders;

  constructor() {
    this.auth = auth;
    this.products = products;
    this.classes = classes;
    this.trainers = trainers;
    this.categories = categories;
    this.bookings = bookings;
    this.files = files;
    this.chat = chat;
    this.user = user;
    this.orders = orders;
  }
}

const api = new API();

export default api;
