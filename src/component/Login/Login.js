import React, { useContext, useState } from "react";
import styles from "./login.module.css";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../context/authContext/apiCalls";
import { AuthContext } from "../../context/authContext/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if(processing) return;
    setProcessing(true);
    try {
      await loginApi(formData, dispatch);
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
    }
  };

  return (
    <div className={`${styles.container} flexbox-center`}>
      <div className={`${styles.title} open-sans-600`}>Login</div>
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
      <button
        className={`${styles.btn} ${styles.main} open-sans-400 cursor-pointer text-center border-none flexbox-center white`}
        onClick={handleSubmit}
      >
        {processing ? <Spinner /> : "Log in"}
      </button>
      <div className={`${styles.footer} flexbox-center`}>
        <div className={`${styles.footertxt} open-sans-400 text-center`}>
          Have no account yet?
        </div>
        <button
          className={`${styles.btn} ${styles.normal} bg-white cursor-pointer open-sans-400 text-center flexbox-center white`}
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
