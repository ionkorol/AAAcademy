import { Layout } from "components/common";
import React from "react";

import styles from "./Styles.module.scss";

const CovidRelease = () => {
  return (
    <Layout title="Covid Release and Permissions">
      <div className={styles.container}>
        <h1>Covid Release and Permissions</h1>
        <p>
          I____________________________________________, knowingly consent to
          have my child or myself (teacher) participate in the Always Active
          Academy located on 3160 Old Atlanta Road Suwanee during the COVID-19
          pandemic. The undersigned does hereby and forever discharge Always
          Active Academy and its directors and staff of and from all manners of
          actions, suits, damages, claims, demands, whatsoever in law or equity
          from any loss or damage to the undersigned, their minor children or
          self’s property or personal injury which may occur while participating
          in any activity related to this event. Additionally, the undersigned
          grants permission for the Always Active Academy to use any photos
          taken during the program for publicity or on Always Active Academy
          website, social media, and advertisement and materials.
        </p>
        <p>
          I give permission for my child or myself to be given a temperature
          check at the beginning of each class, event or activity. I agree to
          have my child’s or myself’ temperature recorded with my full name.
        </p>
        <p>
          I agree that the information collected will determine if my child or
          myself will be allowed into the building, classrooms or not.
        </p>
        <p>
          I understand the COVID-19 virus has a long incubation period during
          which carriers of the virus may not show symptoms and still be highly
          contagious. It is impossible to determine who has it and who does not
          given the current limits in virus testing. Students and Teachers are
          not being required to show proof of testing due to the limits placed
          on who can get tested.
        </p>
        <p>
          I understand that due to the nature of dance/physical activity does
          not allow social distancing at all times, nor can the use of mask be
          mandatory. I understand that the federal, state and local health
          authorities CDC, OSHA, and Georgia Department of Health recommend
          social distancing of 6ft. I understand that my child or myself is
          responsible for following the social distancing rules that have been
          put in place by the Always Active Academy. I understand that my child
          or myself have a chance of encountering some social distancing that
          will be less than 6ft apart.
        </p>
        <p>
          I understand that my child or myself will be asked to return home and
          follow the guidelines set forth by the CDC, OSHA, and Georgia
          Department of Health before being allowed to return.
        </p>
        <p>● Anyone with symptoms or fever is asked to return home</p>
        <p>
          ● All children and staff should be self-monitoring their symptoms.
        </p>
        <p>● Checking for fever less than 100.4</p>
        <p>
          ● Anyone who develops symptoms should leave immediately, seek care
          from their physician, and isolate. Review of any symptoms that could
          be attributed to COVID-19.
        </p>
        <p>
          ● Cough, difficulty breathing, sore throat, unusual headache,
          unexplained muscle and/or joint pain, chills, fever, nausea, vomiting,
          diarrhea, loss of sense of smell, pink eye
        </p>
        <p>● Signs of increased fatigue</p>
        <p>● Review of other possible symptoms and feeling unwell</p>
        <p>
          ● The same procedures should be applied to all employees, staff
          members, volunteers. To help prevent the spread of contagious viruses
          and to help protect each other, I understand that my child and myself
          will have to follow the Always Active Academy guidelines.
        </p>
      </div>
    </Layout>
  );
};

export default CovidRelease;
