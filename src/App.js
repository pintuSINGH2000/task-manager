import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// import ProtectedRoute from './component/ProtectedRoute';
import Dashboard from "./component/Dashboard/Dashboard";
import { useContext } from "react";
import { AuthContext } from "./context/authContext/AuthContext";
import TaskPage from "./pages/TaskPage";
import Analytics from "./component/Analytic/Analytics";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingPage from "./pages/SettingPage";
import Homepage from "./pages/Homepage";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          exact
          path="/"
          element={user ? <Homepage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        ></Route>

        <Route
          path="/analytics"
          element={!user ? <Navigate to="/login" /> : <AnalyticsPage />}
        ></Route>
        <Route
          path="/settings"
          element={!user ? <Navigate to="/login" /> : <SettingPage />}
        ></Route>
        <Route path="/task/:taskId" element={<TaskPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
