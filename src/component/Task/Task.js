import React, { useContext, useState } from "react";
import styles from "./task.module.css";
import { BsThreeDots } from "react-icons/bs";
import {
  PriorityColor,
  Priority,
  TaskCategory,
  MENUITEM,
} from "../../utils/constant";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import moment from "moment";
import { deleteTask, updateProgressAndCheckListTask } from "../../api/task";
import { AuthContext } from "../../context/authContext/AuthContext";
import { Modal, Tooltip } from "antd";
import CreateTodo from "../CreateTodo/CreateTodo";
import { toast } from "react-toastify";
import SmallBoxModal from "../SmallBoxModal/SmallBoxModal";
import { useNavigate } from "react-router-dom";

const Task = ({ task, btns, setTasks, processing, setProcessing }) => {
  const currentDate = new Date();
  const lastDayDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
  const { user } = useContext(AuthContext);
  const [updateData, setUpdateData] = useState({});
  const [updateId, setUpdateId] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const homepageUrl = window?.location?.origin;
  const navigate = useNavigate();

  const moveTask = async (from, to) => {
    if (Object.values(processing).some((value) => value === true)) return;
    setProcessing((prev) => {
      return {
        ...prev,
        [`${TaskCategory[from - 1]}`]: true,
        [`${TaskCategory[to - 1]}`]: true,
      };
    });
    const res = await updateProgressAndCheckListTask({
      isProgress: true,
      taskId: task._id,
      progress: to,
    });
    if (res?.isUnauthorized) {
      localStorage.clear();
      navigate("/login");
      return;
    }

    if (res) {
      setTasks((prevTasks) => {
        const updatedFromCategory = prevTasks[TaskCategory[from - 1]].filter(
          (t) => t._id !== task._id
        );
        const updatedTask = { ...task, progress: to, isCollapsed: true };
        const updatedToCategory = [
          ...prevTasks[TaskCategory[to - 1]],
          updatedTask,
        ];

        return {
          ...prevTasks,
          [TaskCategory[from - 1]]: updatedFromCategory,
          [TaskCategory[to - 1]]: updatedToCategory,
        };
      });
      setProcessing((prev) => {
        return {
          ...prev,
          [`${TaskCategory[from - 1]}`]: false,
          [`${TaskCategory[to - 1]}`]: false,
        };
      });
    } else {
      setProcessing((prev) => {
        return {
          ...prev,
          [`${TaskCategory[from - 1]}`]: false,
          [`${TaskCategory[to - 1]}`]: false,
        };
      });
    }
  };

  const toggleCollapse = (category, taskId) => {
    setTasks((prevTasks) => {
      const updatedCategory = prevTasks[TaskCategory[category - 1]].map(
        (task) =>
          task._id === taskId
            ? { ...task, isCollapsed: !task.isCollapsed }
            : task
      );

      return {
        ...prevTasks,
        [TaskCategory[category - 1]]: updatedCategory,
      };
    });
  };

  const toggleShowMenu = (category, taskId) => {
    setTasks((prevTasks) => {
      const updatedTasks = {};

      for (const [key, tasks] of Object.entries(prevTasks)) {
        if (key === TaskCategory[category - 1]) {
          updatedTasks[key] = tasks?.map((task) =>
            task._id === taskId
              ? { ...task, showMenu: !task.showMenu }
              : { ...task, showMenu: false }
          );
        } else {
          updatedTasks[key] = tasks?.map((task) => ({
            ...task,
            showMenu: false,
          }));
        }
      }

      return updatedTasks;
    });
  };

  const handleChecked = async (index, check, checkId) => {
    if (Object.values(processing).some((value) => value === true)) return;
    setProcessing((prev) => {
      return {
        ...prev,
        [`${TaskCategory[task.progress - 1]}`]: true,
      };
    });
    const res = await updateProgressAndCheckListTask({
      taskId: task._id,
      checked: check,
      checkListId: checkId,
    });
    if (res?.isUnauthorized) {
      localStorage.clear();
      navigate("/login");
      return;
    }
    if (res) {
      setTasks((prevTasks) => {
        const categoryTasks = prevTasks[TaskCategory[task.progress - 1]];
        const taskIndex = categoryTasks.findIndex((t) => t._id === task._id);

        if (taskIndex === -1) {
          return prevTasks;
        }
        const currentTask = categoryTasks[taskIndex];

        const updatedCheckList = [...currentTask.checkList];
        updatedCheckList[index] = {
          ...updatedCheckList[index],
          checked: check,
        };
        const updatedTask = { ...currentTask, checkList: updatedCheckList };
        const updatedCategoryTasks = [...categoryTasks];
        updatedCategoryTasks[taskIndex] = updatedTask;
        updatedCategoryTasks[taskIndex].checkCount += check ? 1 : -1;
        return {
          ...prevTasks,
          [TaskCategory[task.progress - 1]]: updatedCategoryTasks,
        };
      });
      setProcessing((prev) => {
        return {
          ...prev,
          [`${TaskCategory[task.progress - 1]}`]: false,
        };
      });
    } else {
      setProcessing((prev) => {
        return {
          ...prev,
          [`${TaskCategory[task.progress - 1]}`]: false,
        };
      });
    }
  };

  const handleMenu = async (index, task) => {
    if (index === 1) {
      setUpdateData({
        taskName: task.taskName,
        checkList: task.checkList,
        checkCount: task.checkCount,
        creator: task.creator,
        priority: task.priority,
        dueDate: task?.dueDate?.split("T")[0],
        ...(task.creator === user.userId && { assignedTo: task.assignedTo })
      });
      setUpdateId(task._id);
      setUpdatingProgress(task.progress);
      setModalInitial(!modalInitial);
      setEditModalOpen(true);
      toggleShowMenu(task.progress, task._id);
    } else if (index === 2) {
      navigator.clipboard
        .writeText(homepageUrl + "/task/" + task._id)
        .then(() => {
          toast.success("Link copied to Clipboard");
          setTasks((prevTasks) => {
            const updatedCategory = prevTasks[
              TaskCategory[task.progress - 1]
            ]?.map((t) => (t._id === task._id ? { ...t, showMenu: false } : t));

            return {
              ...prevTasks,
              [TaskCategory[task.progress - 1]]: updatedCategory,
            };
          });
        })
        .catch((err) => {
          console.error("Failed to copy link: ", err);
        });
    } else if (index === 3) {
      setUpdatingProgress(task.progress);
      setUpdateId(task._id);
      setDeleteModalOpen(true);
    }
  };

  const handleDelete = async () => {
    setProcessing((prev) => {
      return {
        ...prev,
        [`${TaskCategory[updatingProgress - 1]}`]: true,
      };
    });
    const res = await deleteTask(updateId);
    if (res?.isUnauthorized) {
      localStorage.clear();
      navigate("/login");
      return;
    }
    if (res) {
      setTasks((prevTasks) => {
        const categoryKey = TaskCategory[updatingProgress - 1];
        const updatedCategory = prevTasks[categoryKey].filter(
          (t) => t._id !== task._id
        );
        return {
          ...prevTasks,
          [categoryKey]: updatedCategory,
        };
      });
      setProcessing((prev) => {
        return {
          ...prev,
          [`${TaskCategory[updatingProgress - 1]}`]: false,
        };
      });
    } else {
      setProcessing((prev) => {
        return {
          ...prev,
          [`${TaskCategory[updatingProgress - 1]}`]: false,
        };
      });
    }
  };

  const handleDeleteModalCancel = () => {
    setDeleteModalOpen(false);
  };
  const handleEditModalCancel = () => {
    setEditModalOpen(false);
  };
  return (
    <div className={styles.card}>
      <div className="flexbox-space-between">
        <div className={`${styles.priority} poppins-500`}>
          <div
            className={`${styles.circle}`}
            style={{
              backgroundColor: PriorityColor[task.priority - 1],
            }}
          ></div>
          {Priority[task.priority - 1]}
          {task.assignedTo && (user.userId !== task.creator || user.email !== task.assignedTo) && (
            <div className={`${styles.emailInitial} flexbox-center`}>
              <Tooltip
                placement="top"
                key={"assigned" + task?._id}
                title={task.assignedTo}
                trigger={window.cordova ? "click" : "hover"}
                style={{ overflow: "auto", height: "200px" }}
              >
                {task.assignedTo.substring(0, 2)}
              </Tooltip>
            </div>
          )}
        </div>
        <div className={styles.menuItem}>
          <BsThreeDots
            className={`${styles.menuIcon} cursor-pointer`}
            onClick={() => toggleShowMenu(task.progress, task._id)}
          />
          {task.showMenu && (
            <div className={`${styles.menu} poppins-500 bg-white`}>
              {MENUITEM.map(
                (filter, index) =>
                  (index !== 2 ||
                    (index === 2 && task.creator === user.userId)) && (
                    <div
                      key={index}
                      onClick={() => handleMenu(index + 1, task)}
                      className="cursor-pointer"
                      style={{ color: index === 2 && "rgba(207, 54, 54, 1)" }}
                    >
                      {filter}
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </div>
      <div className={`${styles.taskTitle} poppins-500 ellipsis`}>
        {" "}
        <Tooltip
          placement="topLeft"
          key={"title" + task?._id}
          title={task.taskName}
          trigger={window.cordova ? "click" : "hover"}
          style={{ overflow: "auto", height: "200px" }}
        >
          {task?.taskName}
        </Tooltip>
      </div>
      <div className={`${styles.checkList} flexbox-space-between font-14`}>
        <div className={`inter-500 font-14`}>
          Checklist ({task?.checkCount}/{task?.checkList?.length})
        </div>
        <div className={styles.checkListIcons}>
          {task?.isCollapsed ? (
            <IoIosArrowDown
              className={styles.checkListIcon}
              onClick={() => toggleCollapse(task?.progress, task?._id)}
            />
          ) : (
            <IoIosArrowUp
              className={styles.checkListIcon}
              onClick={() => toggleCollapse(task?.progress, task?._id)}
            />
          )}
        </div>
      </div>
      {!task?.isCollapsed &&
        task?.checkList?.map((list, ind) => (
          <div key={ind} className={styles.inputContinaer}>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={list.checked}
                className={`${styles.checkbox} inter-400`}
                onChange={() => handleChecked(ind, !list.checked, list._id)}
              />
              <span className={`${styles.checkmark}`}></span>
            </div>
            <div className={`${styles.listItem} inter-400 front-14`}>
              {list.Listitem}
            </div>
          </div>
        ))}

      <div className={`${styles.cardbtns} flexbox-space-between`}>
        <div>
          {task?.dueDate && (
            <button
              className={`${styles.btn} ${styles.datebtn} border-none ${
                task.progress === 4
                  ? styles.done
                  : new Date(task.dueDate) <= lastDayDate && styles.passDue
              }`}
            >
              {moment.utc(task?.dueDate).format("MMM Do")}
            </button>
          )}
        </div>
        <div className={styles.btns}>
          {btns?.map((btn, index) => (
            <div key={index}>
              {btn === 1 && (
                <button
                  className={`${styles.btn} border-none poppins-500 cursor-pointer`}
                  onClick={(e) => moveTask(task?.progress, 1)}
                >
                  Backlog
                </button>
              )}
              {btn === 2 && (
                <button
                  className={`${styles.btn} border-none poppins-500 cursor-pointer`}
                  onClick={(e) => moveTask(task?.progress, 2)}
                >
                  To-do
                </button>
              )}
              {btn === 3 && (
                <button
                  className={`${styles.btn} border-none poppins-500 cursor-pointer`}
                  onClick={(e) => moveTask(task?.progress, 3)}
                >
                  PROGRESS
                </button>
              )}

              {btn === 4 && (
                <button
                  className={`${styles.btn} border-none poppins-500 cursor-pointer`}
                  onClick={(e) => moveTask(task?.progress, 4)}
                >
                  Done
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <Modal closable={false} footer={null} open={editModalOpen} width={800}>
        <CreateTodo
          onCancel={handleEditModalCancel}
          modalInitial={modalInitial}
          setTasks={setTasks}
          updateData={updateData}
          isUpdating={true}
          taskId={updateId}
          updatingProgress={updatingProgress}
        />
      </Modal>
      <Modal closable={false} footer={null} open={deleteModalOpen} width={350}>
        <SmallBoxModal
          onCancel={handleDeleteModalCancel}
          submitFunction={handleDelete}
          mainText="Are you sure you want to Delete?"
          btnText="Yes, Delete"
        />
      </Modal>
    </div>
  );
};

export default Task;
