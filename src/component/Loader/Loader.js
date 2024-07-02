import React from "react";
import styles from "./loader.module.css";

const Loader = () => {
  return (
    <div className={`${styles.loaderContainer} flexbox-center`}>
      <div className={styles.loaderBar}></div>
    </div>
  );
};

export default Loader;
