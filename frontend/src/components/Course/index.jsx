import ReactMarkdown from 'react-markdown';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './Course.module.scss';
import $api from "../../http/index";
import Spinner from '../../components/Spinner';
import { Context } from '../../index';

const Course = ({courseType, courseId, handleError, handleSuccessfulOperation}) => {
  const { store } = useContext(Context);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDataLoaded, setDataLoaded] = useState(true);
    const [courseTemplate, setCourseTemplate] = useState(null);
    const [courseEnrollment, setCourseEnrollment] = useState(null);
    const [startedAt, setStartedAt] = useState(false);
    const [completedAt, setCompletedAt] = useState(false);
    const [ratingForCourse, setRatingForCourse] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      setDataLoaded(false); 
      
      const fetchData = async () => {
        await fetchCourse();

        setDataLoaded(true);
      }

      fetchData();
    }, [courseId]);
    
    const checkIsAuthor = (courseTemplateAuthorId) => {
      if (store.user._id === courseTemplateAuthorId) {
        setIsAuthor(true);
      } else {
        setIsAuthor(false);
      }
    }

    const fetchCourse = async () => {
      try {
        let response;
        if (courseType === 'courseTemplate') {
          response = await $api.get(`/courses/${courseId}`);

          if (response.status === 200) {
            setCourseTemplate(response.data[0]);
            setIsPublic(Boolean(response.data[0].public));
            checkIsAuthor(response.data[0].authorId);
          } else {
            navigate('/');
            handleError(response?.data?.message);
          }
        } else if (courseType === 'courseEnrollment') {
          response = await $api.get(`/courses/${courseId}/enrollment`);

          setCourseEnrollment(response.data[0]);
          setStartedAt(response.data[0].startedAt);
          setCompletedAt(response.data[0].completedAt);
          setRatingForCourse(response.data[0].ratingForCourse);

          if (response.status === 200) {
            const coursePresentationId = response.data[0].coursePresentationId;
            
            response = await $api.get(`/courses/${coursePresentationId}`);

            if (response.status === 200) {
                setCourseTemplate(response.data[0]);
                setIsPublic(Boolean(response.data[0].public));
                checkIsAuthor(response.data[0].authorId);
            } else {
              navigate('/');
              handleError(response?.data?.message);
            }
          } else {
            navigate('/');
            handleError(response?.data?.message);
          }
        } else {
          navigate('/');
          handleError('Incorrect courseType.');
        }
      } catch (error) {
        navigate('/');
        handleError(`Error fetching ${courseType} with id ${courseId}.`);
      }
    };

    const handleOpenMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleCloseMenu = () => {
      setAnchorEl(null);
    };

    const handlePublishCourse = async () => {
      try {
        setDataLoaded(false);
        const response = await $api.post(`/courses/${courseId}/publish`);

        if (response.status === 200) {
          navigate(`/courseTemplate/${courseId}`);
          setIsPublic(true);
          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      } catch (error) {
        handleError(`Error with publishing courseTemplate. ${error?.response?.data?.message}`);
      } finally {
        setDataLoaded(true);
      }
    }

    const handleChangeCourse = () => {
      if (courseType === 'courseTemplate') {
        navigate(`/courseTemplate/${courseId}/update`);
      } else {
        handleError('You can update only courseTemplate.');
      }
    }

    const handleDeleteCourse = async () => {
      try {
        setDataLoaded(false);
        const response = await $api.delete(`/courses/${courseId}`);

        if (response.status === 200) {
          navigate('/');
          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      } catch (error) {
        handleError(`Error with deleting courseTemplate. ${error?.response?.data?.message}`)
      } finally {
        setDataLoaded(true);
      }
    }

    const handleOpenFirstTaskTemplate = () => {
      try {
        const taskTemplates = courseTemplate.taskTemplates;

        if (taskTemplates && taskTemplates.length !== 0) {
          navigate(`/courseTemplate/${courseId}/${taskTemplates[0].taskType}/${taskTemplates[0]._id}`);          
        } else {
          handleError(`No taskTemplates in this course. No first task.`);
        }
      } catch (error) {
        handleError(`Error with opening first TaskTemplate. ${error?.response?.data?.message}`)
      }
    }

    const handleEnrollInCourse = async () => {
      try {
        setDataLoaded(false);
        const response = await $api.post(`/courses/${courseId}/enroll`);

        if (response.status === 200) {
          navigate(`/courseEnrollment/${response.data.result._id}`);
          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      } catch (error) {
        handleError(`Error with enrolling in courseTemplate. ${error?.response?.data?.message}`)
      } finally {
        setDataLoaded(true);
      }
    }

    const handleStartCourse = async () => {
      try {
        setDataLoaded(false);
        const response = await $api.post(`/courses/${courseId}/start`);
        await fetchCourse();
        if (response.status === 200) {
          setStartedAt(response.data.result[0].startedAt);
          setDataLoaded(true);
          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      } catch (error) {
        handleError(`Error with starting courseTemplate. ${error?.response?.data?.message}`);
      } finally {
        setDataLoaded(true);
      }
    }

    const handleGoToTasks = () => {
      try {
        navigate(`/courseEnrollment/${courseId}/${courseEnrollment.currentTaskType}/${courseEnrollment.currentTaskId}`);
      } catch (error) {
        handleError(`Error with opening current taskEnrollment. ${error?.response?.data?.message}`);
      }
    }

    const handleCompleteCourse = async () => {
      try {
        setDataLoaded(false);
        const response = await $api.post(`/courses/${courseId}/complete`);

        if (response.status === 200) {
          await fetchCourse();
          setCompletedAt(response.data.completedAt);
          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      } catch (error) {
        handleError(`Error with completing courseTemplate. ${error?.response?.data?.message}`);
      } finally {
        setDataLoaded(true);
      }
    }

    const handleUnEnrollFromCourse = async () => {
      try {
        setDataLoaded(false);
        const response = await $api.post(`/courses/${courseId}/unenroll`);

        if (response.status === 200) {
          setCourseEnrollment(null);
          navigate(`/courseTemplate/${courseEnrollment.coursePresentationId}`);
          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      } catch (error) {
        handleError(`Error with unenrolling from courseEnrollment. ${error?.response?.data?.message}`);
      } finally {
        setDataLoaded(true);
      }
    }

    const handleRateThisCourse = async (rating) => {
      try {
        setDataLoaded(false);
        const response = await $api.put(`/courses/${courseId}/rating`, {rating});

        if (response.status === 200) {
          setRatingForCourse(rating);
          handleSuccessfulOperation();
        } else {
          handleError(response?.data?.message);
        }
      } catch (error) {
        handleError(`Error with unenrolling from courseEnrollment. ${error?.response?.data?.message}`);
      } finally {
        setDataLoaded(true);
        setAnchorEl(null);
      }
    }
    
    if (!isDataLoaded) {
      return (
        <Spinner />
      );
    }
  
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{courseTemplate?.title}</h1>
        {courseTemplate && <p className={styles.englishLevel}>English Level: {courseTemplate?.englishLvl}</p>}
        {courseTemplate && (
          <div className={styles.tags}>
            {"Tags: "}
            {courseTemplate?.tags?.map((tag) => (
              <span key={tag}>{`#${tag} `}</span>
            ))}
          </div>
        )}
        <h3>Description:</h3>
        <ReactMarkdown>{courseTemplate?.description}</ReactMarkdown>

        {(!courseEnrollment) ? <>
            {(isPublic) ? (
              <Button variant="contained" color="primary" className={styles.button} onClick={handleEnrollInCourse}>
                Enroll in course
              </Button>
            ) : (
              <>
                {isAuthor ? (
                  <>
                      <Button variant="contained" color="primary" className={styles.button} onClick={handlePublishCourse}>
                          Publish
                      </Button>
                      <Button variant="contained" color="primary" className={styles.button} onClick={handleChangeCourse}>
                          Change course
                      </Button>
                      <Button variant="contained" color="primary" className={styles.button} onClick={handleDeleteCourse}>
                          Delete course
                      </Button>
                      <Button variant="contained" color="primary" className={styles.button} onClick={handleOpenFirstTaskTemplate}>
                          Open first task
                      </Button>
                      <Button variant="contained" color="primary" className={styles.button} onClick={handleOpenMenu}>
                          Add task to course
                      </Button>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                      <MenuItem component={Link} to={`/courseTemplate/${courseId}/taskTemplate/create/theory`} onClick={() => setAnchorEl(null)}>
                          Theory
                      </MenuItem>
                      <MenuItem component={Link} to={`/courseTemplate/${courseId}/taskTemplate/create/test`} onClick={() => setAnchorEl(null)}>
                          Test
                      </MenuItem>
                      <MenuItem component={Link} to={`/courseTemplate/${courseId}/taskTemplate/create/fillInGaps`} onClick={() => setAnchorEl(null)}>
                          Fill in Gaps
                      </MenuItem>
                      </Menu>
                  </>
              ) : (
                <>

                </>
              )}
              </>
            )}
        </> : <>
            {(!startedAt) ? (
                <Button variant="contained" color="primary" className={styles.button} onClick={handleStartCourse}>
                    Start course
                </Button> ) : (
                <>
                    <Button variant="contained" color="primary" className={styles.button} onClick={handleGoToTasks}>
                      Go to tasks
                    </Button>
                    {(!completedAt) ? 
                      <Button variant="contained" color="primary" className={styles.button} onClick={handleCompleteCourse}>
                        Complete course
                    </Button> : <> </>}
                </>
            )}

            <Button variant="contained" color="primary" className={styles.button} onClick={handleUnEnrollFromCourse}>
                UnEnroll from course
            </Button>
            {(completedAt) ? 
              <>
                <Button variant="contained" color="primary" className={styles.button} onClick={handleOpenMenu} >
                  Rate this course
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <MenuItem key={rating} onClick={() => handleRateThisCourse(rating)}>
                      {rating}
                    </MenuItem>
                  ))}
                </Menu>
              </> : <> </>}
            {(startedAt) ? <h4>started at: {startedAt}</h4> : <> </>}
            {(completedAt) ? <h4>completed at: {completedAt}</h4> : <> </>}
            <h4> max available experience for course: {courseEnrollment?.maxPossibleExpAmount}</h4>
            {(completedAt) ? <h4>gained experience for course: {courseEnrollment?.statistics?.resultExp}</h4> : <> </>}
            {(ratingForCourse) ? <h4>Your rating for this course: {ratingForCourse}</h4> : <> </>}
        </>}
      </div>
    );
};

export default Course;