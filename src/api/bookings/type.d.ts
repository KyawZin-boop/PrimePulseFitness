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
