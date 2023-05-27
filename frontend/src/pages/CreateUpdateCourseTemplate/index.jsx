import React from 'react';
import CreateUpdateCourse from '../../components/CreateUpdateCourse';

export const CreateUpdateCourseTemplate = ({action, handleError, handleSuccessfulOperation}) => {
  return (
    (action === 'create' || action === 'update') && <div>
      <h1>{action.charAt(0).toUpperCase() + action.slice(1)} Course Template</h1>
      <CreateUpdateCourse action={action} handleError={handleError} handleSuccessfulOperation={handleSuccessfulOperation} />
    </div>
  );
};