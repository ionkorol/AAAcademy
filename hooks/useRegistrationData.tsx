import {
  useState,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

interface ChildProp {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  grade: string;
}

const RegistrationContext = createContext({
  childrenData: [],
  parentData: null,
  addChild: null,
  removeChild: null,
  medicalCondition: null,
  setMedicalCondition: null,
  setParentAttribute: null,
  emergencyContact: null,
  setEmergencyContactAttribute: null,
} as {
  childrenData: ChildProp[];
  parentData: {
    name: string;
    phone: string;
    address: string;
  };
  addChild: (data: ChildProp) => void;
  removeChild: (id: string) => void;
  medicalCondition: boolean;
  setMedicalCondition: Dispatch<SetStateAction<boolean>>;
  setParentAttribute: (attribute: string, value: string) => void;
  emergencyContact: { name: string; phone: string };
  setEmergencyContactAttribute: (attribute: string, value: string) => void;
});

export const RegistrationProvider = ({ children }) => {
  const [childrenData, setChildrenData] = useState<ChildProp[]>([]);
  const [parentData, setParentData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    phone: "",
  });
  const [medicalCondition, setMedicalCondition] = useState(false);

  const addChild = (data: ChildProp) => {
    setChildrenData((prevState) => [...prevState, data]);
  };
  const removeChild = (id: string) => {
    setChildrenData((prevState) => prevState.filter((item) => item.id !== id));
  };

  const setParentAttribute = (attribute: string, value: string) =>
    setParentData((prevState) => ({ ...prevState, [attribute]: value }));

  const setEmergencyContactAttribute = (attribute: string, value: string) =>
    setEmergencyContact((prevState) => ({ ...prevState, [attribute]: value }));

  return (
    <RegistrationContext.Provider
      value={{
        childrenData,
        parentData,
        addChild,
        removeChild,
        medicalCondition,
        setMedicalCondition,
        setParentAttribute,
        emergencyContact,
        setEmergencyContactAttribute,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistrationData = () => useContext(RegistrationContext);
