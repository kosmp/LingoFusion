import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TestTask from '../../components/TestTask';
import FillInGapsTask from '../../components/FillInGapsTask';
import TheoryTask from '../../components/TheoryTask';

export const TaskPage = () => {
  const { taskType, courseType } = useParams();
  const [taskIds, setTaskIds] = useState([]);
  const [singleTask, setSingleTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);

  useEffect(() => {
    if (courseType === 'courseTemplate') {
      // get single task Template
      fetch('')
      .then((response) => response.json())
      .then((data) => {
        setSingleTask(data);
      })
      .catch((error) => {
        console.error('Error fetching single task:', error);
      });

      // get course Template
      fetch('')
      .then((response) => response.json())
      .then((data) => {
        const tasks = data.taskTemplates || [];
        const ids = tasks.map((task) => task._id);
        setTaskIds(ids);
      })
      .catch((error) => {
        console.error('Error fetching single task:', error);
      });
    } else if (courseType === 'courseEnrollment') {
      //get single task Enrollment
      fetch('')
      .then((response) => response.json())
      .then((data) => {
        setSingleTask(data);
      })
      .catch((error) => {
        console.error('Error fetching single task:', error);
      });

      // get course Enrollment
      fetch('')
      .then((response) => response.json())
      .then((data) => {
        const tasks = data.tasks || [];
        const ids = tasks.map((task) => task._id);
        setTaskIds(ids);
      })
      .catch((error) => {
        console.error('Error fetching single task:', error);
      });
    }
  }, []);

  let selectedComponent;
  if (courseType === 'courseTemplate' || courseType === 'courseEnrollment') {
    if (taskType === 'testTask') {
      selectedComponent = <TestTask singleTask={singleTask} taskStatus={taskStatus} taskIds={taskIds} courseType={courseType} />;
    } else if (taskType === 'fillInGapsTask') {
      selectedComponent = <FillInGapsTask singleTask={singleTask} taskStatus={taskStatus} taskIds={taskIds} courseType={courseType} />;
    } else if (taskType === 'theoryTask') {
      selectedComponent = <TheoryTask singleTask={singleTask} taskStatus={taskStatus} taskIds={taskIds} courseType={courseType} />;
    }
  }

  return <div>{selectedComponent}</div>;
};
