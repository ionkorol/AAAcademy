import { useState } from "react";

interface Props {}

const useClubs = () => {
  const [error, setError] = useState(null);
  const getClubs = async () => {
    try {
      const data = await (await fetch("/api/clubs")).json();
      return data;
    } catch (error) {
      setError(error);
      return null;
    }
  };
  return { error, getClubs };
};

export default useClubs;
