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

const Course = ({courseType, courseId, handleError}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTask, setSelectedTask] = useState('');
    const [courseTemplate, setCourseTemplate] = useState(null);
    const [courseEnrollment, setCourseEnrollment] = useState(null);
    const [isDataLoaded, setDataLoaded] = useState(true);
    const [isAuthor, setIsAuthor] = useState(false);
    const { store } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
      setDataLoaded(false); 
      fetchCourse();
    }, []);

    const checkIsAuthor = async (courseTemplateAuthorId) => {
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
            await checkIsAuthor(response.data[0].authorId);
            setDataLoaded(true);
          } else {
            setDataLoaded(true);
            navigate('/');
            handleError(response?.data?.message);
          }
        } else if (courseType === 'courseEnrollment') {
          response = await $api.get(`/courses/${courseId}/enrollment`);

          setCourseEnrollment(response.data[0]);

          if (response.status === 200) {
            const coursePresentationId = response.data[0].coursePresentationId;
            
            response = await $api.get(`/courses/${coursePresentationId}`);

            if (response.status === 200) {
                setCourseTemplate(response.data[0]);
                await checkIsAuthor(response.data[0].authorId);
                setDataLoaded(true);
            } else {
              setDataLoaded(true);
              navigate('/');
              handleError(response?.data?.message);
            }
          } else {
            setDataLoaded(true);
            navigate('/');
            handleError(response?.data?.message);
          }
        } else {
          setDataLoaded(true);
          navigate('/');
          handleError('Incorrect courseType.');
        }
      } catch (error) {
        setDataLoaded(true);
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
  
    const handleSelectTask = (task) => {
      setSelectedTask(task);
      setAnchorEl(null);
    };

    const handlePublishCourse = () => {
      
    }

    const handleChangeCourse = () => {
      if (courseType === 'courseTemplate') {
        navigate(`/courseTemplate/${courseId}/update`);
      } else {
        handleError('You can update only courseTemplates.');
      }
    }

    const handleDeleteCourse = () => {

    }

    const handleOpenFirstTask = () => {

    }

    if (!isDataLoaded) {
      return (
        <Spinner />
      );
    }
  
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{(courseTemplate) && courseTemplate.title}</h1>
        {courseTemplate && <p className={styles.englishLevel}>English Level: {(courseTemplate) && courseTemplate.englishLvl}</p>}
        {courseTemplate && (
          <div className={styles.tags}>
            {"Tags: "}
            {courseTemplate.tags.map((tag) => (
              <span key={tag}>{`#${tag} `}</span>
            ))}
          </div>
        )}
        <ReactMarkdown>{(courseTemplate) && courseTemplate.description}</ReactMarkdown>

        {(courseType === 'courseTemplate') ? <>
            {(courseTemplate && courseTemplate.public) ? (
              <Button variant="contained" color="primary" className={styles.button}>
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
                      <Button variant="contained" color="primary" className={styles.button} onClick={handleOpenFirstTask}>
                          Open first task
                      </Button>
                      <Button variant="contained" color="primary" className={styles.button} onClick={handleOpenMenu}>
                          Add task to course
                      </Button>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                      <MenuItem component={Link} to={`/courseTemplate/:courseId/taskTemplate/create/theory`} onClick={() => handleSelectTask('Theory')}>
                          Theory
                      </MenuItem>
                      <MenuItem component={Link} to={`/courseTemplate/:courseId/taskTemplate/create/test`} onClick={() => handleSelectTask('Test')}>
                          Test
                      </MenuItem>
                      <MenuItem component={Link} to={`/courseTemplate/:courseId/taskTemplate/create/fillInGaps`} onClick={() => handleSelectTask('FillInGaps')}>
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
            {(courseEnrollment && !courseEnrollment.isStarted) ? (
                <Button variant="contained" color="primary" className={styles.button}>
                    Start course
                </Button> ) : (
                <>
                    <Button variant="contained" color="primary" className={styles.button}>
                      Go to tasks
                    </Button>
                    {(courseEnrollment && !courseEnrollment.isCompleted) ? 
                      <Button variant="contained" color="primary" className={styles.button}>
                        Complete course
                    </Button> : <> </>}
                </>
            )}

            <Button variant="contained" color="primary" className={styles.button}>
                UnEnroll from course
            </Button>
            {(courseEnrollment && courseEnrollment.isCompleted) ? 
              <Button variant="contained" color="primary" className={styles.button}>
                Rate this course
              </Button> : <> </>}
            {((courseEnrollment) && courseEnrollment.isStarted) ? <h4>started at: {(courseEnrollment) && courseEnrollment.startedAt}</h4> : <> </>}
            {((courseEnrollment) && courseEnrollment.isCompleted) ? <h4>completed at: {(courseEnrollment) && courseEnrollment.completedAt}</h4> : <> </>}
            <h4> max available experience for course: {(courseEnrollment) && courseEnrollment.maxPossibleExpAmount}</h4>
            {((courseEnrollment) && courseEnrollment.isCompleted) ? <h4>gained experience for course: {(courseEnrollment) && courseEnrollment.statistics.resultExp}</h4> : <> </>}
        </>}
      </div>
    );
};

export default Course;