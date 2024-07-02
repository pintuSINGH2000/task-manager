import React from "react";
import styles from "./bufferingspinner.module.css";
import { PiSpinnerGapThin } from "react-icons/pi";

const BufferingSpinner = () => {
  return (
    <div className={`${styles.spinner} flexbox-center`}>
      <PiSpinnerGapThin className={styles.icon} />
    </div>
  );
};

export default BufferingSpinner;
