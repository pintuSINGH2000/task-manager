import React, { useEffect, useState } from "react";
import styles from "./usertask.module.css";
import { useParams } from "react-router-dom";
import { getSingleTask } from "../../api/task";
import { Priority, PriorityColor } from "../../utils/constant";
import moment from "moment";
import codesandbox from "../../assest/images/codesandbox.png";
import { Tooltip } from "antd";
import BufferingSpinner from "../BufferingSpinner/BufferingSpinner";

const UserTask = () => {
  const [task, setTask] = useState({});
  const { taskId } = useParams();
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    const fetchTask = async () => {
      setProcessing(true);
      const res = await getSingleTask(taskId);
      if (res) {
        setTask(res?.task);
        setProcessing(false);
      } else {
        setProcessing(false);
      }
    };
    fetchTask();
    //eslint-disable-next-line
  }, []);
  return (
    <div className={`${styles.container}`}>
      <div className={styles.logo}>
        <h1 className={`${styles.title} poppins-700`}>
          <img src={codesandbox} alt="logo" />
          Pro Manage
        </h1>
      </div>
      {processing ? (
        <div className={`${styles.spinner} flexbox-center`}>
          <BufferingSpinner />
        </div>
      ) : (
        <div className={`${styles.cardContainer} flexbox-center`}>
          <div className={styles.card}>
            <div className={`${styles.priority} poppins-500`}>
              <div
                className={`${styles.circle}`}
                style={{
                  backgroundColor: PriorityColor[task.priority - 1],
                }}
              ></div>
              {Priority[task?.priority - 1]}
            </div>

            <div className={`${styles.taskName} poppins-500 ellipsis`}>
              <Tooltip
                placement="topLeft"
                key={task?._id}
                title={task?.taskName}
                trigger={window.cordova ? "click" : "hover"}
                style={{ overflow: "auto", height: "200px" }}
              >
                {task?.taskName}
              </Tooltip>
            </div>
            <div className={styles.checkList}>
              <div
                className={`inter-500 font-14`}
                style={{ marginBottom: "20px" }}
              >
                Checklist ({task?.checkCount}/{task?.checkList?.length})
              </div>
              <div className={styles.checkListContainer}>
                {task?.checkList?.length > 0 &&
                  task?.checkList?.map((task, index) => (
                    <div className={`${styles.listItem}`} key={index}>
                      <div className={styles.inputContinaer}>
                        <div className={styles.checkboxContainer}>
                          <div></div>
                          <input
                            type="checkbox"
                            checked={task?.checked}
                            className={`${styles.checkbox}`}
                            disabled
                          />
                          <span className={styles.checkmark}></span>
                        </div>
                        <div className={`${styles.listInput} inter-400`}>
                          {task?.Listitem}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {task?.dueDate && (
              <div className={`${styles.dueDate} poppins-500 font-14`}>
                Due Date
                <button className={`${styles.date} border-none`}>
                  {" "}
                  {moment.utc(task?.dueDate).format("MMM Do")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTask;
