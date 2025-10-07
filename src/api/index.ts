import * as auth from "./auth";
import * as products from "./products";
import * as classes from "./classes";
import * as trainers from "./trainer";
class API {
  auth: typeof auth;
  products: typeof products;
  classes: typeof classes;
  trainers: typeof trainers;
//   categories: typeof categories;
//   files: typeof files;

  constructor() {
    this.auth = auth;
    this.products = products;
    this.classes = classes;
    this.trainers = trainers;
    // this.categories = categories;
    // this.files = files;
  }
}

const api = new API();

export default api;
