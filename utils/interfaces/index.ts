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
  description: string
  id: string;
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
