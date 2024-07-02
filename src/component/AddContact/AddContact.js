import React, { useState } from "react";
import styles from "./addcontact.module.css";
import { addMember } from "../../api/task";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";

const AddContact = ({ onCancel, setIsMemberAdded, isMemberAdded }) => {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (processing) return;
    setProcessing(true);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValid = true;
    if (!email || !emailRegex.test(email.trim())) {
      setEmailErr("Invalid Email");
      isValid = false;
    } else {
      setEmailErr("");
    }
    if (!isValid) {
      setProcessing(false);
      return;
    }
    const res = await addMember({ email: email });
    if (res?.isUnauthorized) {
      localStorage.clear();
      navigate("/login");
      return;
    }
    if (res) {
      setProcessing(false);
      setIsMemberAdded(true);
    } else {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    setEmail("");
    setEmailErr("");
    setProcessing(false);
    onCancel();
  };

  return (
    <div className={styles.container}>
      {isMemberAdded ? (
        <div className={styles.successMessage}>
          <h1 className={styles.header} style={{ marginBottom: "40px" }}>
            {email} added to board
          </h1>
          <button
            className={`${styles.submit} poppins-600 border-none cursor-pointer`}
            onClick={handleCancel}
          >
            Okay, got it!
          </button>
        </div>
      ) : (
        <>
          <h1 className={`${styles.header} noto-sans-600`}>
            Add people to the board
          </h1>
          <div className={`${styles.main}`}>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the email"
            />
            {emailErr && <div className={styles.error}>{emailErr}</div>}
          </div>
          <div className={styles.footer}>
            <button
              className={`${styles.cancel} poppins-600 bg-white cursor-pointer`}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className={`${styles.submit} poppins-600 border-none cursor-pointer flexbox-center`}
              onClick={handleSubmit}
            >
              {processing ? <Spinner /> : "Add Email"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddContact;
