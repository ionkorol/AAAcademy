export interface ClubProp {
  title: string;
  categories: Array<"Active" | "Creative" | "Educational" | "Musical">;
  date: string;
  age: {
    from: number;
    to: number;
  };
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
  fees: FeeProp[];
}

export interface InvoiceProp {
  id: number;
  parentId: string;
  invoiceDate: DateProp;
  dueDate: DateProp;
  total: number;
  lineItems: {
    name: string;
    price: number;
    discount: number;
    fees: FeeProp[];
  }[];
  status: "Unpaid" | "Paid" | "Past Due";
}

export interface UserProp {
  firstName: string;
  lastName: string;
  type: "Parent" | "Student" | string;
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
  password?: string;
}

export interface ParentProp {
  firstName: string;
  lastName: string;
  type: "Parent";
  email: string;
  phone: string;
  id?: string;
  children: string[];
  emergencyContact: {
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

export interface StudentProp {
  firstName: string;
  lastName: string;
  type: "Student";
  email: string;
  phone: string;
  id?: string;
  clubs: string[];
  dob: string;
  parentId: string;
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

export interface ApiResProp {
  status: boolean;
  data?: any;
  error?: any;
}

export interface PostProp {
  title: string;
  description: string;
  id: string;
  images: string[];
}

export interface FeeProp {
  price: number;
  name: string;
}

interface DateProp {
  day: number;
  month: number;
  year: number;
  dayName: string;
}

interface CouponProp {
  id: string;
  value: number;
}
