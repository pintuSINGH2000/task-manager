import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./dashboard.module.css";
import Navbar from "../Navbar/Navbar";
import moment from "moment";
import { LuUsers2 } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { VscCollapseAll } from "react-icons/vsc";
import { IoMdAdd } from "react-icons/io";
import { DateFilter, TaskCategory } from "../../utils/constant";
import { Modal } from "antd";
import CreateTodo from "../CreateTodo/CreateTodo";
import { AuthContext } from "../../context/authContext/AuthContext";
import { getTask } from "../../api/task";
import Task from "../Task/Task";
import AddContact from "../AddContact/AddContact";
import BufferingSpinner from "./../BufferingSpinner/BufferingSpinner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState(2);
  const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isMemberAdded, setIsMemberAdded] = useState();
  const [modalInitial, setModalInitial] = useState(false);
  const isFirstRender = useRef(true);
  const [firstProcess, setFirstProcess] = useState(false);
  const [processing, setProcessing] = useState({
    backlogTasks: false,
    todoTasks: false,
    inProgressTasks: false,
    doneTasks: false,
  });
  const [tasks, setTasks] = useState({
    backlogTasks: [],
    todoTasks: [],
    inProgressTasks: [],
    doneTasks: [],
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleShowFiltre = () => {
    setShowFilter(!showFilter);
  };

  const handleFilter = (filter) => {
    setFilter(filter);
  };

  // Add task modal
  const handleTodoAdd = () => {
    setModalInitial(!modalInitial);
    setIsAddTodoModalOpen(true);
  };

  const handleTodoModalCancel = () => {
    setIsAddTodoModalOpen(false);
  };

  // Add contact modal

  const handleAddContact = () => {
    setIsAddContactModalOpen(true);
  };

  const handleAddContactCancel = () => {
    setIsAddContactModalOpen(false);
    setIsMemberAdded(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (Object.values(processing).some((value) => value === true)) return;
      if (isFirstRender.current) {
        isFirstRender.current = false;
        setFirstProcess(true);
      }
      setProcessing((prev) => {
        const updatedProcessing = {};
        Object.keys(prev).forEach((key) => {
          updatedProcessing[key] = true;
        });
        return updatedProcessing;
      });
      const categorizedTasks = {
        backlogTasks: [],
        todoTasks: [],
        inProgressTasks: [],
        doneTasks: [],
      };
      const res = await getTask(filter, user?.token);
      if (res?.isUnauthorized) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      if (res) {
        res?.tasks?.forEach((task) => {
          const taskWithIsCollapsed = {
            ...task,
            isCollapsed: true,
            showMenu: false,
          };
          switch (task.progress) {
            case 1:
              categorizedTasks.backlogTasks.push(taskWithIsCollapsed);
              break;
            case 2:
              categorizedTasks.todoTasks.push(taskWithIsCollapsed);
              break;
            case 3:
              categorizedTasks.inProgressTasks.push(taskWithIsCollapsed);
              break;
            case 4:
              categorizedTasks.doneTasks.push(taskWithIsCollapsed);
              break;
            default:
              break;
          }
        });
        setProcessing((prev) => {
          const updatedProcessing = {};
          Object.keys(prev).forEach((key) => {
            updatedProcessing[key] = false;
          });
          return updatedProcessing;
        });
        setFirstProcess(false);
        setTasks(categorizedTasks);
      } else {
        setProcessing((prev) => {
          const updatedProcessing = {};
          Object.keys(prev).forEach((key) => {
            updatedProcessing[key] = false;
          });
          return updatedProcessing;
        });
        setFirstProcess(false);
      }
    };
    fetchData();
    //eslint-disable-next-line
  }, [filter]);

  const toggleCollapseAll = (category) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [TaskCategory[category - 1]]: prevTasks[TaskCategory[category - 1]].map(
        (task) => ({ ...task, isCollapsed: true })
      ),
    }));
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.dashboard}>
        {firstProcess ? (
          <div className={`${styles.spinner} flexbox-center`}>
            <BufferingSpinner />
          </div>
        ) : (
          <>
            <div className={`${styles.user} poppins-600`}>
              Welcome! {user.name}
            </div>
            <div className={`${styles.date} poppins-500`}>
              {moment().format("Do MMM, YYYY")}{" "}
            </div>
            <div className={`${styles.header} flexbox-space-between`}>
              <div className={styles.headerContainer}>
                <div className={`${styles.title} poppins-500`}>Board</div>
                <div
                  className={`${styles.contact} poppins-500 cursor-pointer font-14`}
                  onClick={handleAddContact}
                >
                  <LuUsers2 className={styles.icon} /> Add People
                </div>
              </div>
              <div
                className={`${styles.filter} poppins-400`}
                onClick={handleShowFiltre}
              >
                {DateFilter[filter - 1]}
                {showFilter ? (
                  <IoIosArrowUp className={styles.icon} />
                ) : (
                  <IoIosArrowDown className={styles.icon} />
                )}
                {showFilter && (
                  <div
                    className={`${styles.filterMenu} bg-white font-14 poppins-500`}
                  >
                    {DateFilter.map((filter, index) => (
                      <div
                        key={index}
                        onClick={() => handleFilter(index + 1)}
                        className="cursor-pointer"
                      >
                        {filter}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.taskTraker}>
              <div className={styles.taskPosition}>
                <div
                  className={`${styles.tasktrakerHeader} flexbox-space-between`}
                >
                  <div className={`${styles.taskHeaderTitle} poppins-500`}>
                    Backlog
                  </div>
                  <div>
                    <VscCollapseAll
                      className={styles.icon}
                      onClick={(e) => toggleCollapseAll(1)}
                    />
                  </div>
                </div>
                <div className={styles.taskContainer}>
                  {processing.backlogTasks
                    ? Array.from({
                        length: Math.max(tasks?.backlogTasks?.length, 1),
                      }).map((_, index) => (
                        <div
                          className={`${styles.animatedBackground} ${styles.card}`}
                        ></div>
                      ))
                    : tasks?.backlogTasks?.map((task, index) => (
                        <Task
                          task={task}
                          btns={[2, 3, 4]}
                          setTasks={setTasks}
                          setProcessing={setProcessing}
                          processing={processing}
                        />
                      ))}
                </div>
              </div>
              <div className={styles.taskPosition}>
                <div
                  className={`${styles.tasktrakerHeader} flexbox-space-between`}
                >
                  <div className={`${styles.taskHeaderTitle} poppins-500`}>
                    To Do
                  </div>
                  <div className={styles.todo}>
                    <IoMdAdd className={styles.icon} onClick={handleTodoAdd} />
                    <VscCollapseAll
                      className={styles.icon}
                      onClick={(e) => toggleCollapseAll(2)}
                    />
                  </div>
                </div>
                <div className={styles.taskContainer}>
                  {processing.todoTasks
                    ? Array.from({
                        length: Math.max(tasks?.todoTasks?.length, 1),
                      }).map((_, index) => (
                        <div
                          className={`${styles.animatedBackground} ${styles.card}`}
                        ></div>
                      ))
                    : tasks?.todoTasks?.map((task, index) => (
                        <Task
                          task={task}
                          btns={[1, 3, 4]}
                          setTasks={setTasks}
                          setProcessing={setProcessing}
                          processing={processing}
                        />
                      ))}
                </div>
              </div>
              <div className={styles.taskPosition}>
                <div
                  className={`${styles.tasktrakerHeader} flexbox-space-between`}
                >
                  <div className={`${styles.taskHeaderTitle} poppins-500`}>
                    In progress
                  </div>
                  <div>
                    <VscCollapseAll
                      className={styles.icon}
                      onClick={(e) => toggleCollapseAll(3)}
                    />
                  </div>
                </div>
                <div className={styles.taskContainer}>
                  {processing.inProgressTasks
                    ? Array.from({
                        length: Math.max(tasks?.inProgressTasks?.length, 1),
                      }).map((_, index) => (
                        <div
                          className={`${styles.animatedBackground} ${styles.card}`}
                        ></div>
                      ))
                    : tasks?.inProgressTasks?.map((task, index) => (
                        <Task
                          task={task}
                          btns={[1, 2, 4]}
                          setTasks={setTasks}
                          setProcessing={setProcessing}
                          processing={processing}
                        />
                      ))}
                </div>
              </div>
              <div className={styles.taskPosition}>
                <div
                  className={`${styles.tasktrakerHeader} flexbox-space-between`}
                >
                  <div className={`${styles.taskHeaderTitle} poppins-500`}>
                    Done
                  </div>
                  <div>
                    <VscCollapseAll
                      className={styles.icon}
                      onClick={(e) => toggleCollapseAll(4)}
                    />
                  </div>
                </div>
                <div className={styles.taskContainer}>
                  {processing.doneTasks
                    ? Array.from({
                        length: Math.max(tasks?.doneTasks?.length, 1),
                      }).map((_, index) => (
                        <div
                          className={`${styles.animatedBackground} ${styles.card}`}
                        ></div>
                      ))
                    : tasks?.doneTasks?.map((task, index) => (
                        <Task
                          task={task}
                          btns={[1, 2, 3]}
                          setTasks={setTasks}
                          setProcessing={setProcessing}
                          processing={processing}
                        />
                      ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        closable={false}
        footer={null}
        open={isAddTodoModalOpen}
        width={800}
      >
        <CreateTodo
          onCancel={handleTodoModalCancel}
          modalInitial={modalInitial}
          setTasks={setTasks}
          task={tasks}
        />
      </Modal>
      <Modal
        closable={false}
        footer={null}
        open={isAddContactModalOpen}
        width={700}
      >
        <AddContact
          onCancel={handleAddContactCancel}
          setIsMemberAdded={setIsMemberAdded}
          isMemberAdded={isMemberAdded}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
