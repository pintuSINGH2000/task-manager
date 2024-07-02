import React, { useContext, useEffect, useState } from "react";
import styles from "./createtodo.module.css";
import { IoIosArrowDown, IoMdAdd } from "react-icons/io";
import { createTask, getMember, updateTask } from "../../api/task";
import Spinner from "./../Spinner/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "./../Loader/Loader";
import { toast } from "react-toastify";
import { TaskCategory } from "../../utils/constant";
import { AuthContext } from "../../context/authContext/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateTodo = ({
  onCancel,
  modalInitial,
  setTasks,
  updateData,
  isUpdating,
  taskId,
  updatingProgress,
}) => {
  const [taskData, setTaskData] = useState({
    taskName: "",
    priority: 2,
    checkList: [],
    dueDate: "",
    assignedTo: "",
  });
  const [taskError, setTaskError] = useState({
    taskNameError: "",
    checkListError: "",
  });
  const [checkCount, setCheckCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [members, setMembers] = useState();
  const [hasMore, setHasMore] = useState(true);
  const [showMember, setShowMember] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handlePriority = (priority) => {
    setTaskData({ ...taskData, priority: priority });
  };

  const handleAdd = () => {
    const newItem = {
      Listitem: "",
      checked: false,
    };
    setTaskData({
      ...taskData,
      checkList: [...taskData.checkList, newItem],
    });
  };

  const handleChecked = (index) => {
    const updatedCheckList = [...taskData.checkList];
    if (updatedCheckList[index].checked === true) {
      updatedCheckList[index].checked = false;
      setCheckCount(checkCount - 1);
    } else {
      updatedCheckList[index].checked = true;
      setCheckCount(checkCount + 1);
    }
    setTaskData({
      ...taskData,
      checkList: updatedCheckList,
    });
  };

  const handleTask = (e, index) => {
    const updatedCheckList = [...taskData.checkList];
    updatedCheckList[index].Listitem = e.target.value;
    setTaskData({
      ...taskData,
      checkList: updatedCheckList,
    });
  };

  const deleteItemFromCheckList = (index) => {
    const updatedCheckList = [...taskData.checkList];
    if (updatedCheckList[index].checked === true) {
      setCheckCount(checkCount - 1);
    }
    const updateList = updatedCheckList.filter((list, i) => i !== index);
    setTaskData({
      ...taskData,
      checkList: updateList,
    });
  };
  const handleSubmit = async () => {
    if (processing) return;
    let isValid = true;
    setProcessing(true);
    if (taskData.taskName.trim().length === 0) {
      setTaskError((prev) => ({
        ...prev,
        taskNameError: "Title is required",
      }));
      isValid = false;
    } else {
      setTaskError((prev) => ({ ...prev, taskNameError: "" }));
    }
    let checkListError = false;
    if (taskData.checkList.length === 0) {
      setTaskError((prev) => ({
        ...prev,
        checkListError: "Please add some item into checkList",
      }));
      isValid = false;
      checkListError = true;
    }

    taskData.checkList.forEach((list, cIndex) => {
      if (list.Listitem.trim().length === 0) {
        setTaskError((prev) => ({
          ...prev,
          checkListError: "Please fill all the list",
        }));
        isValid = false;
        checkListError = true;
        return;
      }
    });
    if (!checkListError) {
      setTaskError((prev) => ({ ...prev, checkListError: "" }));
    }

    if (isValid) {
      if (isUpdating) {
        const res = await updateTask({ ...taskData, checkCount }, taskId);
        if (res?.isUnauthorized) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        if (res) {
          const updatedTask = { ...res, isCollapsed: true, showMenu: false };
          setTasks((prevTasks) => {
            const updatedCategory = prevTasks[
              TaskCategory[updatingProgress - 1]
            ].map((task) => (task._id === taskId ? updatedTask : task));

            return {
              ...prevTasks,
              [TaskCategory[updatingProgress - 1]]: updatedCategory,
            };
          });
          reset();
        }
      } else {
        const res = await createTask({ ...taskData, checkCount });
        if (res?.isUnauthorized) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        if (res) {
          const updatedTask = { ...res, isCollapsed: true, showMenu: false };
          setTasks((prevTasks) => ({
            ...prevTasks,
            todoTasks: [...prevTasks.todoTasks, updatedTask],
          }));
          reset();
        }
      }
      setProcessing(false);
    } else {
      toast.error("Please fill all required field");
      setProcessing(false);
    }
  };

  const reset = () => {
    setTaskData({
      taskName: "",
      priority: 2,
      checkList: [],
      dueDate: "",
    });
    setTaskError({
      taskNameError: "",
      checkListError: "",
    });
    setShowMember(false);
    setMembers(null);
    setCheckCount(0);
    onCancel();
  };
  const handleCancel = () => {
    reset();
  };

  useEffect(() => {
    const getMembers = async () => {
      const res = await getMember(0);
      if (res?.isUnauthorized) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      if (res) {
        if (res?.members?.length < 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setMembers(res?.members);
      }
    };
    getMembers();

    if (isUpdating) {
      const { checkCount, ...updatingData } = updateData;
      setTaskData(updatingData);
      setCheckCount(checkCount);
    }
    //eslint-disable-next-line
  }, [modalInitial]);

  const fetchMember = async () => {
    const res = await getMember(members.length);
    if (res?.isUnauthorized) {
      localStorage.clear();
      navigate("/login");
      return;
    }
    setMembers((prevData) => [...prevData, ...res?.members]);
    if (res?.members?.length > 0) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
  };

  // Function to convert YYYY-MM-DD to DD/MM/YYYY
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return;
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleAssigned = () => {
    setShowMember(true);
  };

  return (
    <div className={styles.container}>
      <div className={` ${styles.title} inter-500 font-14`}>
        Title <span className={styles.required}>*</span>
      </div>
      <input
        type="text"
        name="taskName"
        placeholder="Enter Task Title"
        value={taskData.taskName}
        onChange={(e) => setTaskData({ ...taskData, taskName: e.target.value })}
        className={`${styles.taskName} inter-500 font-14`}
      />
      {taskError.taskNameError && (
        <div className={styles.error}>{taskError.taskNameError}</div>
      )}
      <div className={`${styles.priorityType} flexbox-space-between`}>
        <div className={` ${styles.title} inter-500 font-14 flexbox-center`}>
          Select Priority &nbsp; <span className={styles.required}>*</span>
        </div>
        <button
          className={`${taskData.priority === 3 && styles.selectedPriorty} ${
            styles.priority
          } poppins-500 cursor-pointer font-14 bg-white`}
          onClick={(e) => handlePriority(3)}
        >
          <div className={`${styles.circle} ${styles.highPriority}`}></div>HIGH
          PRIORITY
        </button>
        <button
          className={`${taskData.priority === 2 && styles.selectedPriorty} ${
            styles.priority
          } cursor-pointer poppins-500 font-14 bg-white`}
          onClick={(e) => handlePriority(2)}
        >
          <div className={`${styles.circle} ${styles.moderatePriority}`}></div>
          MODERATE PRIORITY
        </button>
        <button
          className={`${taskData.priority === 1 && styles.selectedPriorty} ${
            styles.priority
          } cursor-pointer poppins-500 font-14 bg-white`}
          onClick={(e) => handlePriority(1)}
        >
          <div className={`${styles.circle} ${styles.lowPriority}`}></div>LOW
          PRIORITY
        </button>
      </div>
      {members?.length > 0 &&
        (!isUpdating || taskData.creator === user.userId) && (
          <div className={styles.assignedContainer}>
            <div
              className={`${styles.assigned} ${styles.title} inter-500 font-14`}
            >
              Assign to
              <div
                className={`${styles.assignedTo} flexbox-space-between`}
                onClick={handleAssigned}
              >
                {taskData.assignedTo ? (
                  taskData.assignedTo
                ) : (
                  <span className={styles.light}>Add a assignee </span>
                )}
                {showMember && (
                  <IoIosArrowDown
                    className={`${styles.icon} cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMember(false);
                    }}
                  />
                )}
              </div>
            </div>

            {showMember && (
              <div id="scrollableDiv" className={`${styles.members} bg-white`}>
                <InfiniteScroll
                  dataLength={members?.length}
                  next={() => fetchMember()}
                  hasMore={hasMore}
                  loader={<Loader />}
                  scrollableTarget="scrollableDiv"
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>No More Member!</b>
                    </p>
                  }
                >
                  {members?.map(
                    (member, index) =>
                      member.memberEmail !== user.email && (
                        <div
                          key={index}
                          className={`${styles.member} flexbox-space-between`}
                        >
                          <div className="flexbox-center">
                            <div
                              className={`${styles.emailInitial} flexbox-center`}
                            >
                              {member.memberEmail.substring(0, 2)}
                            </div>
                            <div className={`${styles.email} inter-500`}>
                              {member.memberEmail}
                            </div>
                          </div>
                          <div
                            className={`${styles.assignBtn} poppins-500 cursor-pointer font-14`}
                            onClick={(e) => {
                              setTaskData({
                                ...taskData,
                                assignedTo: member.memberEmail,
                              });
                              setShowMember(false);
                            }}
                          >
                            Assign
                          </div>
                        </div>
                      )
                  )}
                </InfiniteScroll>
              </div>
            )}
          </div>
        )}
      <div className={styles.checkList}>
        <div
          className={`${styles.title} inter-500 font-14`}
          style={{ marginBottom: "10px" }}
        >
          Checklist ({checkCount}/{taskData?.checkList?.length}){" "}
          <span className={styles.required}>*</span>
        </div>
        <div className={styles.checkListContainer}>
          {taskData?.checkList?.length > 0 &&
            taskData.checkList.map((task, index) => (
              <div className={`${styles.listItem}`} key={index}>
                <div className={styles.inputContinaer}>
                  <div className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      checked={task.checked}
                      className={`${styles.checkbox} inter-400`}
                      onChange={() => handleChecked(index)}
                    />
                    <span className={styles.checkmark}></span>
                  </div>
                  <input
                    name="Listitem"
                    className={`${styles.listInput} border-none`}
                    value={task.Listitem}
                    onChange={(e) => handleTask(e, index)}
                    placeholder="Enter Task"
                  />
                  <div
                    className={`${styles.deleteIcon} cursor-pointer`}
                    onClick={(e) => deleteItemFromCheckList(index)}
                  >
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.9059 4.36922C17.2301 4.36922 17.5 4.63838 17.5 4.98088V5.29754C17.5 5.63171 17.2301 5.90921 16.9059 5.90921H3.09488C2.76988 5.90921 2.5 5.63171 2.5 5.29754V4.98088C2.5 4.63838 2.76988 4.36922 3.09488 4.36922H5.52464C6.01821 4.36922 6.44775 4.01839 6.55879 3.5234L6.68603 2.95507C6.88378 2.18091 7.53458 1.66675 8.27939 1.66675H11.7206C12.4573 1.66675 13.1154 2.18091 13.3059 2.91424L13.442 3.52256C13.5522 4.01839 13.9818 4.36922 14.4762 4.36922H16.9059ZM15.6715 15.9449C15.9252 13.5808 16.3694 7.96418 16.3694 7.90751C16.3856 7.73585 16.3296 7.57335 16.2186 7.44252C16.0995 7.32002 15.9487 7.24752 15.7826 7.24752H4.22379C4.05684 7.24752 3.89799 7.32002 3.78776 7.44252C3.67592 7.57335 3.62081 7.73585 3.62891 7.90751C3.6304 7.91792 3.64634 8.11576 3.67298 8.44652C3.79134 9.91589 4.121 14.0084 4.33401 15.9449C4.48476 17.3716 5.42084 18.2682 6.77674 18.3007C7.82305 18.3249 8.90096 18.3332 10.0032 18.3332C11.0414 18.3332 12.0958 18.3249 13.1745 18.3007C14.5774 18.2766 15.5127 17.3957 15.6715 15.9449Z"
                        fill="#CF3636"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {taskError.checkListError && (
          <div className={styles.error}>{taskError.checkListError}</div>
        )}
        <div onClick={handleAdd} className={`${styles.addItem} inter-500`}>
          <IoMdAdd className={styles.addicon} />
          Add New
        </div>
      </div>
      <div className="flexbox-space-between">
        <div className={styles.date}>
          <label className={`${styles.datepicker} poppins-500`}>
            {taskData.dueDate ? (
              <span style={{ color: "black" }}>
                {" "}
                {formatDateForDisplay(taskData.dueDate)}
              </span>
            ) : (
              "Select Due Date"
            )}
            <input
              type="date"
              value={taskData.dueDate}
              onChange={(e) =>
                setTaskData({ ...taskData, dueDate: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
            />
          </label>
        </div>
        <div className={styles.btns}>
          <button
            className={`${styles.cancel} poppins-600 cursor-pointer bg-white`}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className={`${styles.save} poppins-600 border-none cursor-pointer white`}
            onClick={handleSubmit}
          >
            {processing ? <Spinner /> : isUpdating ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTodo;
