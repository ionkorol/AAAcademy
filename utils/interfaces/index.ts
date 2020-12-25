export interface ClubProp {
  title: string;
  categories: ("Active" | "Creative" | "Educational" | "Musical")[] | string[];
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
  type: "Teacher" | "Student";
  email: string;
  id: string;
}
