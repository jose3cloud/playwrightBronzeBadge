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
  birthdate: string;
  email: string;
  phone: string;
  street1: string;
  street2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  owner: string;
};

export interface CreateUserParams {
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
}

export interface CreateContactParams {
  firstName: string;
  lastName: string;
  birthdate?: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}
