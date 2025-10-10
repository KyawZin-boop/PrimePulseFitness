type Category = {
  categoryID: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  activeFlag: boolean;
};

type CreateCategory = {
  categoryName: string;
};

type UpdateCategory = {
  categoryID: string;
  categoryName: string;
};
