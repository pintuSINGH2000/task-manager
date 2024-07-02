import React, { useContext, useState } from "react";
import styles from "./navbar.module.css";
import { NavLink } from "react-router-dom";
import { Modal } from "antd";
import { GoDatabase } from "react-icons/go";
import { RiLayout3Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import codesandbox from "../../assest/images/codesandbox.png";
import { AuthContext } from "../../context/authContext/AuthContext";
import { logout } from "../../context/authContext/AuthAction";
import SmallBoxModal from "../SmallBoxModal/SmallBoxModal";

const Navbar = () => {
  const { dispatch } = useContext(AuthContext);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const handleLogoutModalCancel = () => {
    setLogoutModalOpen(false);
  };
  return (
    <div className={`${styles.container} text-center`}>
      <div>
        <h1 className={`${styles.title} poppins-700`}>
          <img src={codesandbox} alt="logo" />
          Pro Manage
        </h1>
        <div className={`${styles.navigation}`}>
          <NavLink
            activeclassname="active"
            className={`${styles.navbtns} cursor-pointer poppins-500`}
            to="/"
          >
            <RiLayout3Line className={styles.navIcon} /> Board
          </NavLink>
          <NavLink
            activeclassname="active"
            className={`${styles.navbtns} cursor-pointer poppins-500`}
            to="/analytics"
          >
            <GoDatabase className={styles.navIcon} /> Analytics
          </NavLink>
          <NavLink
            activeclassname="active"
            className={`${styles.navbtns} cursor-pointer poppins-500`}
            to="/settings"
          >
            <IoSettingsOutline className={styles.navIcon} /> Settings
          </NavLink>
        </div>
      </div>
      <div
        className={`${styles.footer} poppins-500 cursor-pointer`}
        onClick={() => setLogoutModalOpen(true)}
      >
        <HiOutlineLogout className={styles.navIcon} />
        <span>Logout</span>
      </div>
      <Modal closable={false} footer={null} open={logoutModalOpen} width={350}>
        <SmallBoxModal
          onCancel={handleLogoutModalCancel}
          submitFunction={() => dispatch(logout())}
          mainText="Are you sure you want to Logout?"
          btnText="Yes,  Logout"
        />
      </Modal>
    </div>
  );
};

export default Navbar;
