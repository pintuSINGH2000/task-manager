import React, { useState } from "react";
import styles from "./register.module.css";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import profile from "../../assest/images/Profile.png";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../context/authContext/apiCalls";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState({
    nameErr: "",
    emailErr: "",
    passwordErr: "",
    confirmPasswordErr: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassowrd] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassowrd(!showConfirmPassword);
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const nameRegex = /^[A-Za-z\s]+$/;
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (processing) return;
    setProcessing(true);
    // client-side validation
    let flag = true;
    if (
      formData.name.trim().length === 0 ||
      !nameRegex.test(formData.name.trim())
    ) {
      setFormError((prev) => ({ ...prev, nameErr: "Invalid Name" }));
      flag = false;
    } else {
      setFormError((prev) => ({ ...prev, nameErr: "" }));
    }
    if (!emailRegex.test(formData.email.trim())) {
      setFormError((prev) => ({ ...prev, emailErr: "Invalid Email" }));
      flag = false;
    } else {
      setFormError((prev) => ({ ...prev, emailErr: "" }));
    }
    if (!passwordRegex.test(formData.password.trim())) {
      setFormError((prev) => ({ ...prev, passwordErr: "Weak password" }));
      flag = false;
    } else {
      setFormError((prev) => ({ ...prev, passwordErr: "" }));
    }
    if (confirmPassword.trim() !== formData.password.trim()) {
      setFormError((prev) => ({
        ...prev,
        confirmPasswordErr: "Password doesn’t match",
      }));
      flag = false;
    } else {
      setFormError((prev) => ({ ...prev, confirmPasswordErr: "" }));
    }
    if (flag) {
      const res = await registerApi(formData);
      setProcessing(false);
      if (res) {
        navigate("/login");
      }
    } else {
      setProcessing(false);
    }
  };
  return (
    <div className={`${styles.container} flexbox-center`}>
      <div className={`${styles.title} open-sans-600`}>Register</div>
      <div className={`${styles.main} flexbox-center`}>
        <div className={`${styles.inputContinaer} open-sans-400`}>
          <img src={profile} alt="profile" className={styles.icon} />
          <input
            type="text"
            id="name"
            name="name"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />
        </div>
        {formError.nameErr && (
          <div className={styles.error}>{formError.nameErr}</div>
        )}
      </div>
      <div className={`${styles.main} flexbox-center`}>
        <div className={`${styles.inputContinaer} open-sans-400`}>
          <CiMail className={styles.icon} />
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>
        {formError.emailErr && (
          <div className={styles.error}>{formError.emailErr}</div>
        )}
      </div>
      <div className={`${styles.main} flexbox-center`}>
        <div className={styles.inputContinaer}>
          <CiLock className={styles.icon} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            placeholder="password"
          />
          {showPassword ? (
            <IoEyeOffOutline
              className={styles.icon}
              style={{ float: "right" }}
              onClick={handlePasswordVisibility}
            />
          ) : (
            <IoEyeOutline
              className={styles.icon}
              style={{ float: "right" }}
              onClick={handlePasswordVisibility}
            />
          )}
        </div>
        {formError.passwordErr && (
          <div className={styles.error}>{formError.passwordErr}</div>
        )}
      </div>
      <div className={`${styles.main} flexbox-center`}>
        <div className={styles.inputContinaer}>
          <CiLock className={styles.icon} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          {showConfirmPassword ? (
            <IoEyeOffOutline
              className={styles.icon}
              style={{ float: "right" }}
              onClick={handleConfirmPasswordVisibility}
            />
          ) : (
            <IoEyeOutline
              className={styles.icon}
              style={{ float: "right" }}
              onClick={handleConfirmPasswordVisibility}
            />
          )}
        </div>
        {formError.confirmPasswordErr && (
          <div className={styles.error}>{formError.confirmPasswordErr}</div>
        )}
      </div>

      <button
        className={`${styles.btn} ${styles.mainbtn} open-sans-400 cursor-pointer text-center border-none flexbox-center white`}
        onClick={handleSubmit}
      >
        {processing ? <Spinner /> : "Register"}
      </button>
      <div className={`${styles.footer} flexbox-center`}>
        <div className={`${styles.footertxt} open-sans-400 text-center`}>
          Have an account ?
        </div>
        <button
          className={`${styles.btn} ${styles.normal} bg-white cursor-pointer open-sans-400 text-center flexbox-center white`}
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default Register;
