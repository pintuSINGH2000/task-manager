import React, { useEffect, useState } from "react";
import { getAnalytic } from "../../api/task";
import styles from "./analytics.module.css";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const [analytic, setAnalytic] = useState({
    backLog: 0,
    todo: 0,
    inprogress: 0,
    done: 0,
    highPriority: 0,
    moderatePriority: 0,
    lowPriority: 0,
    dueDate: 0,
  });
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    const fetchAnalytic = async () => {
      setProcessing(true);
      const res = await getAnalytic();
      if (res?.isUnauthorized) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      if (res) {
        const updatedAnalytic = {
          backLog: 0,
          todo: 0,
          inprogress: 0,
          done: 0,
          highPriority: 0,
          moderatePriority: 0,
          lowPriority: 0,
          dueDate: 0,
        };
        res?.tasks?.forEach((task) => {
          if (task.progress === 1) {
            updatedAnalytic.backLog++;
          } else if (task.progress === 2) {
            updatedAnalytic.todo++;
          } else if (task.progress === 3) {
            updatedAnalytic.inprogress++;
          } else {
            updatedAnalytic.done++;
          }
          if (task.priority === 3) {
            updatedAnalytic.highPriority++;
          } else if (task.priority === 2) {
            updatedAnalytic.moderatePriority++;
          } else {
            updatedAnalytic.lowPriority++;
          }
          if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            today.setDate(today.getDate() - 1);
            if (dueDate < today) {
              updatedAnalytic.dueDate++;
            }
          }
        });
        setAnalytic(updatedAnalytic);
        setProcessing(false);
      } else {
        setProcessing(false);
      }
    };
    fetchAnalytic();
       //eslint-disable-next-line
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.analytic}>
        <div className={`${styles.header} open-sans-600`}>Analytics</div>
        <div className={styles.analyticData}>
          <div
            className={`${styles.card} ${
              processing && styles.animatedBackground
            }`}
          >
            {!processing && (
              <>
                <div className="flexbox-space-between">
                  <div className={`${styles.list} open-sans-400`}>
                    <span className={styles.listDot}></span>Backlog Tasks
                  </div>
                  <div className={`${styles.data} open-sans-600`}>
                    {analytic.backLog < 10 && "0"}
                    {analytic.backLog}
                  </div>
                </div>
                <div className="flexbox-space-between">
                  <div className={`${styles.list} open-sans-400`}>
                    <span className={styles.listDot}></span>To-do Tasks
                  </div>
                  <div className={`${styles.data} open-sans-600`}>
                    {analytic.todo < 10 && "0"}
                    {analytic.todo}
                  </div>
                </div>
                <div className="flexbox-space-between">
                  <div className={`${styles.list} open-sans-400`}>
                    <span className={styles.listDot}></span>In-Progress Tasks
                  </div>
                  <div className={`${styles.data} open-sans-600`}>
                    {analytic.inprogress < 10 && "0"}
                    {analytic.inprogress}
                  </div>
                </div>
                <div className="flexbox-space-between">
                  <div className={`${styles.list} open-sans-400`}>
                    <span className={styles.listDot}></span>Completed Tasks
                  </div>
                  <div className={`${styles.data} open-sans-600`}>
                    {analytic.done < 10 && "0"}
                    {analytic.done}
                  </div>
                </div>
              </>
            )}
          </div>
          <div
            className={`${styles.card} ${
              processing && styles.animatedBackground
            }`}
          >
            {!processing && (
              <>
                <div className="flexbox-space-between">
                  <div className={`${styles.list} open-sans-400`}>
                    <span className={styles.listDot}></span>Low Priority
                  </div>
                  <div className={`${styles.data} open-sans-600`}>
                    {analytic.lowPriority < 10 && "0"}
                    {analytic.lowPriority}
                  </div>
                </div>
                <div className="flexbox-space-between">
                  <div className={`${styles.list} open-sans-400`}>
                    <span className={styles.listDot}></span>Moderate Priority
                  </div>
                  <div className={`${styles.data} open-sans-600`}>
                    {analytic.moderatePriority < 10 && "0"}
                    {analytic.moderatePriority}
                  </div>
                </div>
                <div className="flexbox-space-between">
                  <div className={`${styles.list} open-sans-400`}>
                    <span className={styles.listDot}></span>High Priority
                  </div>
                  <div className={`${styles.data} open-sans-600`}>
                    {analytic.highPriority < 10 && "0"}
                    {analytic.highPriority}
                  </div>
                </div>
                <div className="flexbox-space-between">
                  <div className={`${styles.list} open-sans-400`}>
                    <span className={styles.listDot}></span>Due Date Tasks
                  </div>
                  <div className={`${styles.data} open-sans-600`}>
                    {analytic.dueDate < 10 && "0"}
                    {analytic.dueDate}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
