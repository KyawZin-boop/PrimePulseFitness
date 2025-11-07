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
import * as plan from "./plan";
import * as program from "./program";
import * as reviews from "./reviews";
import * as progress from "./progress";
import * as schedule from "./schedule";
import * as tutorial from "./tutorial";
import * as membership from "./membership";

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
  plan: typeof plan;
  program: typeof program;
  reviews: typeof reviews;
  progress: typeof progress;
  schedule: typeof schedule;
  tutorial: typeof tutorial;
  membership: typeof membership;

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
    this.plan = plan;
    this.program = program;
    this.reviews = reviews;
    this.progress = progress;
    this.schedule = schedule;
    this.tutorial = tutorial;
    this.membership = membership;
  }
}

const api = new API();

export default api;
