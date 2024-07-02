import React from "react";
import styles from "./smallboxmodal.module.css";

const SmallBoxModal = ({ onCancel, submitFunction, mainText, btnText }) => {
  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = () => {
    submitFunction();
    onCancel();
  };
  return (
    <div className={styles.container}>
      <div className={`${styles.heading} font-14 noto-sans-600 text-center`}>
        {mainText}
      </div>
      <button
        className={`${styles.save} poppins-600 border-none cursor-pointer white`}
        onClick={handleSubmit}
      >
        {btnText}
      </button>
      <button
        className={`${styles.cancel} poppins-600 cursor-pointer bg-white`}
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default SmallBoxModal;
