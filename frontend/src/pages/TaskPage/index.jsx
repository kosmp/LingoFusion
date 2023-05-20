import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TestTask from '../../components/TestTask';
import FillInGapsTask from '../../components/FillInGapsTask';
import TheoryTask from '../../components/TheoryTask';

export const TaskPage = () => {
  const { taskType, courseType } = useParams();
  const [taskIds, setTaskIds] = useState([]);
  const [singleTask, setSingleTask] = useState(null);

  useEffect(() => {
    fetch('')
      .then((response) => response.json())
      .then((data) => {
        setSingleTask(data);
      })
      .catch((error) => {
        console.error('Error fetching single task:', error);
      });

    fetch('')
      .then((response) => response.json())
      .then((data) => {
        const ids = data.map((obj) => obj.taskId);
        setTaskIds(ids);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  let selectedComponent;
  if (courseType === 'courseTemplate' || courseType === 'courseEnrollment') {
    if (taskType === 'testTask') {
      selectedComponent = <TestTask singleTask={singleTask} taskIds={taskIds} courseType={courseType} />;
    } else if (taskType === 'fillInGapsTask') {
      selectedComponent = <FillInGapsTask singleTask={singleTask} taskIds={taskIds} courseType={courseType} />;
    } else if (taskType === 'theoryTask') {
      selectedComponent = <TheoryTask singleTask={singleTask} taskIds={taskIds} courseType={courseType} />;
    }
  }

  return <div>{selectedComponent}</div>;
};
