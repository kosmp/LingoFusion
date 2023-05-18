import React from 'react';
import { useParams } from 'react-router-dom';
import TestTaskEnrollment from '../../components/TestTaskEnrollment';
import FillInGapsTaskEnrollment from '../../components/FillInGapsTaskEnrollment';
import TheoryTaskEnrollment from '../../components/TheoryTaskEnrollment';

export const TaskEnrollment = () => {
  const { taskTypeEnrollment } = useParams();

  let selectedComponent;
  if (taskTypeEnrollment === 'testTaskEnrollment') {
    selectedComponent = <TestTaskEnrollment />;
  } else if (taskTypeEnrollment === 'fillInGapsTaskEnrollment') {
    selectedComponent = <FillInGapsTaskEnrollment />;
  } else if (taskTypeEnrollment === 'theoryTaskEnrollment') {
    selectedComponent = <TheoryTaskEnrollment />;
  }

  return <div>{selectedComponent}</div>;
};