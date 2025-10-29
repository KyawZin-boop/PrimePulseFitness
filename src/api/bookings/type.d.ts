type Booking = {
  bookingID: string;
  userID: string;
  classID: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  activeFlag: boolean;
};

type CreateBooking = {
  userID: string;
  classID: string;
};

type TrainerPendingBooking = {
  bookingID: string;
  userID: string;
  userName: string;
  email: string;
  age: number | null;
  gender: string | null;
  classID: string;
  className: string;
  duration: number;
  time: string;
  capacity: number;
  assignedCount: number;
  status: string;
  createdAt: string;
};
