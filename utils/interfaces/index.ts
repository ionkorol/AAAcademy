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
}

export interface UserProp {
  name: string;
  type: "Teacher" | "Student" | string;
  email: string;
  id?: string;
}
