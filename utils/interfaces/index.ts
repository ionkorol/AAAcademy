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
  isFull: boolean;
  calendar: CalendarItem[];
}

interface CalendarItem {
  clubId: string;
  students: {
    id: string;
    attended: boolean;
  }[];
  date: DateProp;
}

// Invoice Props

export interface InvoiceProp {
  id: number;
  parentId: string;
  invoiceDate: DateProp;
  dueDate: DateProp;
  subTotal: number;
  lineItems: LineItemProp[];
  paid: boolean;
  discount: number;
  registrationFee: number;
  transactions: {
    date: DateProp;
    gateway: "Paypal" | "Card";
    id: string;
    total: number;
  }[];
}

export interface LineItemProp {
  student: StudentProp;
  club: ClubProp;
  quantity: number;
}

// Users Props
export interface ParentProp {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: DateProp;
  students?: StudentProp[];
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
  phone: string;
  id?: string;
  clubs: {
    quantity: number;
    id: string;
  }[];
  dob: string;
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
  dayName: string;
  month: number;
  monthName: string;
  year: number;
}
