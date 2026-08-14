export type SignUpResponse = {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  token: string;
};

export type Contact = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  owner: string;
};

export type CreatedUser = {
  email: string;
  password: string;
  token: string;
  userId: string;
};
