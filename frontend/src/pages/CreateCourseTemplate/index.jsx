import React from 'react';
import CreateUpdateCourse from '../../components/CreateUpdateCourse';

export const CreateCourseTemplate = () => {
  return (
    <div>
      <h1>Create Course Template</h1>
      <CreateUpdateCourse action='create' />
    </div>
  );
};