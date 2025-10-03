import * as auth from "./auth";
import * as products from "./products";
class API {
  auth: typeof auth;
  products: typeof products;
//   categories: typeof categories;
//   files: typeof files;

  constructor() {
    this.auth = auth;
    this.products = products;
    // this.categories = categories;
    // this.files = files;
  }
}

const api = new API();

export default api;
