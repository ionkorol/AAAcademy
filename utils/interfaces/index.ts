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
  id: string;
  price: number;
  requirements: string[];
}

export interface UserProp {
  firstName: string;
  lastName: string;
  type: "Teacher" | "Student" | "Parent" | string;
  email: string;
  phone: string;
  id?: string;
  children?: string[];
  clubs?: string[];
  dob?: string;
}

export interface ChildProp {
  firstName: string;
  lastName: string;
  type: "Teacher" | "Student" | "Parent" | string;
  email: string;
  phone: string;
  id?: string;
  children?: string[];
  clubs?: ClubProp[];
  dob?: string;
}

export interface UserWithCredProp {
  credentials: any;
  data: UserProp;
}
