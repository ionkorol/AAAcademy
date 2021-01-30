import { Layout } from "components/common";
import React from "react";

import styles from "./Styles.module.scss";

const TOS = () => {
  return (
    <Layout title="Terms Of Service">
      <div className={styles.container}>
        <h1>Terms Of Services</h1>
        <h2>*TUITION</h2>
        <p>
          I have read the payment description for the above and I accept my
          responsibility for payment. Withdrawals for any reason must be done in
          writing no later than 30 days before the next class. If you miss a
          class, you may make it up within one month of the missed class, but
          there is NO REFUNDS ON A MISSED CLASS. You are expected to sign up for
          the entire month, or each lesson in advance. ( See Payment &
          Attendance Commitment Form)
        </p>
        <h2>*COVID RELEASE</h2>
        <p>
          I have signed, dated, and returned the original copy of Release and
          Permission form to Always Active Academy.
        </p>
        <h2>*PHOTOGRAPHY RELEASE</h2>
        <p>
          I give permission for Always Active Academy to use photos taken of my
          child either at performances or in class on the Always Active Academy
          website or for marketing materials.
        </p>
        <h2>*WITHDRAWALS</h2>{" "}
        <p>
          All withdrawals must be in writing prior to the first of the month (to
          the administration -NOT Teacher or Phone Call) or tuition will not be
          refunded.
        </p>
        <h2>*RELEASE</h2>
        <p>
          I understand that my child will be participating in an active program
          and I accept the risks involved. (This form must be signed and dated
          for your child to dance class, sport clubs, other classes).
        </p>
        <h2>*REALEASE OF LIABILITY</h2>
        <p>
          I understand that Always Active Academy and it’s contractors,
          employees and volunteers are not liable for personal injury, or loss
          or damage to me, my child or personal property before, between and
          after the programs inside or outside school building. I understand
          that it’s my responsibility to pick up my child on time and Always
          Active Academy staff is not responsible to take care of my child after
          the class is over/after program&apos;s hours. I understand that some
          school activities can be strenuous and accept responsibility for any
          injuries my child may incur while participating in Always Active
          Academy programs.
        </p>
        <h2>*EMERGENCY</h2>
        <p>
          I give consent to have my child receive first aid by facility staff,
          and, if necessary, be transported to receive emergency care. I
          understand that I will be responsible for all charges not covered by
          insurance. I agree to review and update emergency contacts information
          whenever a change occurs. Emergency Contacts are provided in the
          Registration Form. I acknowledge that I have been informed that this
          program is not a licensed child care facility. I also understand that
          this program is not required to be licensed by the Georgia Department
          of Early Care and Learning and this program is exempt from state
          licensure requirements.
        </p>
        <h2>*Behavior</h2>
        <p>
          If your child can not control the behavior, he/she can be removed from
          class immediately. There is no refund or credit for a child removed
          from the class for behavioral reasons. If his/her behavior continues
          to disrupt the group, the child can be removed from the program
          completely.
        </p>
      </div>
    </Layout>
  );
};

export default TOS;
