import React, { useEffect, useState } from 'react';
import CreateUpdateCourse from '../../components/CreateUpdateCourse';
import { useNavigate, useParams } from 'react-router-dom';
import $api from "../../http/index";
import Spinner from '../../components/Spinner';

export const CreateUpdateCourseTemplate = ({action, handleError, handleSuccessfulOperation}) => {
  const { courseId } = useParams();
  const [isDataLoaded, setDataLoaded] = useState(true);
  const [courseTemplate, setCourseTemplate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setDataLoaded(false); 
      
    const fetchData = async () => {
      if (action === 'update') {
        await fetchCourseTemplate();
      }

      setDataLoaded(true);
    }

    fetchData();
  }, []);

  const fetchCourseTemplate = async () => {
    try {
      const response = await $api.get(`/courses/${courseId}`);

        if (response.status === 200) {
          setCourseTemplate(response.data[0]);
        } else {
          navigate('/');
          handleError(response?.data?.message);
        }
    } catch (error) {
      navigate('/');
      handleError(`Error fetching courseTemplate with id ${courseId}.`);
    }
  };

  if (!isDataLoaded) {
    return (
      <Spinner />
    );
  }

  return (
    (action === 'create' || action === 'update') && <div>
      <h1>{action.charAt(0).toUpperCase() + action.slice(1)} Course Template</h1>
      <CreateUpdateCourse action={action} handleError={handleError} handleSuccessfulOperation={handleSuccessfulOperation} courseTemplate={courseTemplate} />
    </div>
  );
};