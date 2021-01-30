export interface ClubProp {
  title: string;
  categories: Array<"Active" | "Creative" | "Educational" | "Musical">;
  date: string;
  time: {
    from: string;
    to: string;
  };
  image: string;
  teacher: string;
  description: string;
  id?: string;
  price: number;
  requirements: string[];
}

export interface UserProp {
  firstName: string;
  lastName: string;
  type: "Parent";
  email: string;
  phone: string;
  id?: string;
  children?: string[];
  clubs?: string[];
  dob?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  address: {
    addressLine1: string;
    addressLine2: string;
    adminArea: string;
    postalCode: string;
  };
}

export interface ParentProp {
  firstName: string;
  lastName: string;
  type: "Parent";
  email: string;
  phone: string;
  id?: string;
  children?: string[];
  dob?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

export interface ChildProp {
  firstName: string;
  lastName: string;
  type: "Student";
  email: string;
  phone: string;
  id?: string;
  clubs?: ClubProp[];
  dob?: string;
}

export interface StudentProp {
  firstName: string;
  lastName: string;
  type: "Student";
  email: string;
  phone: string;
  id?: string;
  clubs?: string[] | ClubProp[];
  dob?: string;
}

export interface UserWithCredProp {
  credentials: any;
  data: UserProp;
}

export interface OrderProp {
  id: string;
  userId: string;
  totalPrice: string;
  children: UserProp[];
}

export interface CouponProp {
  id: string;
  firstName: string;
  lastName: string;
}
