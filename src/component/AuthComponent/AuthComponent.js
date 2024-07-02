import React, { useState } from "react";
import styles from "./authComponent.module.css";
import Login from "../Login/Login";
import Register from "../Register/Register";
import art from "../../assest/images/Art.png";

const AuthComponent = ({ isLogin }) => {
  const [login] = useState(isLogin);

  return (
    <div className={`${styles.container} flexbox-center`}>
      <div className={`${styles.auth} flexbox-center`}>
        <div className={`${styles.outer} flexbox-center`}>
          <div className={styles.circle}></div>
          <img className={styles.img} src={art} alt="authCover" />
          <div className={`${styles.h1} open-sans-600 white text-center`}>
            Welcome aboard my friend{" "}
          </div>
          <div className={`${styles.h2} open-sans-400 white text-center`}>
            just a couple of clicks and we start
          </div>
        </div>
      </div>
      {login ? <Login /> : <Register />}
    </div>
  );
};

export default AuthComponent;
