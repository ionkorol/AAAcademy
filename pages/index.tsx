import { Club, Layout } from "../components";
import styles from "../styles/Home.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faVolleyballBall,
  faPalette,
  faBook,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import firebase from "../utils/firebase";
import { ChangeEvent, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import firebaseAdmin from "../utils/firebaseAdmin";
import { ClubProp } from "../utils/interfaces";

interface Props {
  clubsData: ClubProp[];
  error: any;
}

const Home: React.FC<Props> = (props) => {
  const { clubsData, error } = props;

  const [search, setSearch] = useState("");

  const [filteredClubs, setFilteredClubs] = useState<ClubProp[]>(clubsData);
  const [activeCategory, setActiveCategory] = useState<
    "Active" | "Creative" | "Educational" | "Musical" | null
  >(null);

  const filterClubsByCategory = (category) => {
    setActiveCategory(category);
    setFilteredClubs(
      clubsData.filter((club) => club.categories.includes(category))
    );
  };

  const searchFunctionality = (input: string) => {
    setActiveCategory(null);
    setSearch(input);
    setFilteredClubs(
      clubsData.filter((club) =>
        club.title.toLowerCase().includes(input.toLowerCase())
      )
    );
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.search}>
          <form>
            <input
              type="text"
              placeholder="Search Club"
              value={search}
              onChange={(e) => searchFunctionality(e.target.value)}
            />
            <div className={styles.searchIcon}>
              <FontAwesomeIcon icon={faSearch} size="2x" color="#edbe48" />
            </div>
          </form>
        </div>
        <div className={styles.categories}>
          <div
            className={`${styles.category} ${
              activeCategory === "Active" ? styles.active : null
            }`}
            onClick={() => filterClubsByCategory("Active")}
          >
            <FontAwesomeIcon icon={faVolleyballBall} fixedWidth />
            Active
          </div>
          <div
            className={`${styles.category} ${
              activeCategory === "Creative" ? styles.active : null
            }`}
            onClick={() => filterClubsByCategory("Creative")}
          >
            <FontAwesomeIcon icon={faPalette} fixedWidth />
            Creative
          </div>
          <div
            className={`${styles.category} ${
              activeCategory == "Educational" ? styles.active : null
            }`}
            onClick={() => filterClubsByCategory("Educational")}
          >
            <FontAwesomeIcon icon={faBook} fixedWidth />
            Educational
          </div>
          <div
            className={`${styles.category} ${
              activeCategory == "Musical" ? styles.active : null
            }`}
            onClick={() => filterClubsByCategory("Musical")}
          >
            <FontAwesomeIcon icon={faMusic} fixedWidth />
            Musical
          </div>
        </div>
        <div className={styles.clubs}>
          {filteredClubs.map((club) => (
            <Club data={club} key={club.title} />
          ))}
        </div>
        <div className={styles.section}></div>
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const clubsQuery = await firebaseAdmin
      .firestore()
      .collection("clubs")
      .get();
    const clubsData = clubsQuery.docs.map((clubSnap) => clubSnap.data());
    return {
      props: {
        clubsData,
      },
    };
  } catch (error) {
    return {
      props: {
        error,
      },
    };
  }
};
