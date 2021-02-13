export interface ClubProp {
  title: string;
  categories: Array<"Active" | "Creative" | "Educational" | "Musical">;
  date: string;
  age: {
    from: string;
    to: string;
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

// Invoice Props

export interface InvoiceProp {
  id: number;
  parentId: string;
  invoiceDate: DateProp;
  dueDate: DateProp;
  total: number;
  lineItems: LineItemProp[];
  paid: boolean;
  discount: number;
  registrationFee: boolean;
  transactions: {
    date: DateProp;
    gateway: "Paypal" | "Card";
    id: string;
    total: number;
  }[];
}

export interface LineItemProp {
  child: StudentProp;
  club: ClubProp;
  quantity: number;
}

// Users Props

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
  hasDiscount: boolean;
}

export interface ParentProp {
  firstName: string;
  lastName: string;
  type: "Parent";
  email: string;
  phone: string;
  id?: string;
  children: string[];
  funds: {
    amount: number;
  };
  emergencyContact: {
    name: string;
    phone: string;
  };
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
  };
  hasDiscount: boolean;
  paidRegistration: boolean;
}

export interface StudentProp {
  firstName: string;
  lastName: string;
  type: "Student";
  email: string;
  phone: string;
  id?: string;
  clubs: {
    quantity: number;
    id: string;
  }[];
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
