import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Form, ProgressBar, Tab, Tabs } from "react-bootstrap";
import { Layout } from "components/common";

import styles from "./Register.module.scss";
import { ChildrenInfo, ParentInfo, Payment, Terms } from "components/register";
import {
  RegistrationProvider,
  useRegistrationData,
} from "hooks/useRegistrationData";

// import nookies from "nookies";
// import firebaseAdmin from "utils/firebaseAdmin";
// import { GetServerSideProps } from "next";

interface ChildProp {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  grade: string;
}

interface Props {}

const Registration: React.FC<Props> = (props) => {
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] =
    useState<"ChildrenInfo" | "ParentInfo" | "Terms" | "Payment" | string>(
      "ChildrenInfo"
    );

  const formRef = useRef(null);

  const calculateProgress = () => {
    switch (activeTab) {
      case "ChildrenInfo":
        return 1;

      case "ParentInfo":
        return 25;

      case "Terms":
        return 50;

      case "Payment":
        return 75;

      default:
        break;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 200);
  }, [activeTab]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {};

  return (
    <RegistrationProvider>
      <Layout title="Register for Summer Clubs">
        <div className={styles.container}>
          <div className={styles.slider}>
            <h1>Summer Registration</h1>
          </div>
          <div className={styles.formContainer}>
            <div className={styles.progress}>
              <ProgressBar variant="info" animated now={calculateProgress()} />
            </div>
            <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
              <Tab disabled eventKey="ChildrenInfo" title="Children Info">
                <ChildrenInfo setActiveTab={setActiveTab} />
              </Tab>
              <Tab
                disabled
                eventKey="ParentInfo"
                title="Parent and Emergency Contact"
              >
                <ParentInfo setActiveTab={setActiveTab} />
              </Tab>
              <Tab disabled eventKey="Terms" title="Terms and Conditions">
                <Terms setActiveTab={setActiveTab} />
              </Tab>
              <Tab disabled eventKey="Payment" title="Payment">
                <Payment setActiveTab={setActiveTab} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </Layout>
    </RegistrationProvider>
  );
};

export default Registration;
