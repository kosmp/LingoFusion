import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Grid, FormControl, NativeSelect, Button } from '@material-ui/core';
import CoursePreview from '../../components/CoursePreview';
import Spinner from '../../components/Spinner';
import $api from "../../http/index";
import styles from './CourseCatalog.module.scss';

export const CourseCatalog = ({handleError}) => {
  const [ratingFilter, setRatingFilter] = useState('');
  const [englishLvlFilter, setEnglishLvlFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [publicVisibleCourseCount, setPublicVisibleCourseCount] = useState(8);
  const [enrollmentVisibleCourseCount, setEnrollmentVisibleCourseCount] = useState(8);
  const [createdVisibleCourseCount, setCreatedVisibleCourseCount] = useState(8);
  const [publicCourses, setPublicCourses] = useState([]);
  const [courseTemplatesOfEnrollments, setCourseTemplatesOfEnrollments] = useState([]);
  const [courseEnrollments, setCourseEnrollments] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [lastFilter, setLastFilter] = useState(null);
  const [isDataLoaded, setDataLoaded] = useState(true);

  useEffect(() => { 
    fetchData();
  }, []);

  const fetchPublicCourses = async () => {
    try {
      const response = await $api.get(`/courses/templates/all`);
      if (response.status === 200) {
        const data = await response.data;
        setPublicCourses(data);
        return data;
      } else {
        handleError(response?.data?.message);
      }
    } catch (error) {
      handleError('Error fetching public courses');
    }
  }

  const fetchCourseEnrollments = async () => {
    try {
      const response = await $api.get(`/courses/enrollments`);
      if (response.status === 200) {
        setCourseEnrollments(response.data);
        // need to get course Templates with id from fields 'coursePresentationId' of course Enrollments 
        const courseTemplateIds = response.data.map((course) => course.coursePresentationId);
        
        const arrayOfAllPublicTemplates = await fetchPublicCourses();
      
        const finalArrayOfTemplates = arrayOfAllPublicTemplates.filter((template) =>
          courseTemplateIds.includes(template._id)
        );    
        setCourseTemplatesOfEnrollments(finalArrayOfTemplates);;
      } else {
        handleError(response?.data?.message);
      } 
    } catch (error) {
      handleError('Error fetching course Enrollments');
    }
  }

  const fetchCreatedCourses = async () => {
    try {
      const response = await $api.get(`/courses/templates/mine`);
      if (response.status === 200) {
        const data = await response.data;
        setCreatedCourses(data);
        return data;
      } else {
        handleError(response?.data?.message);
      }
    } catch (error) {
      handleError('Error fetching user created courses');
    }
  }

  const fetchData = async() => {
    setDataLoaded(false);
    Promise.all([fetchPublicCourses(), fetchCourseEnrollments(), fetchCreatedCourses()]).then(() => {
      setDataLoaded(true);
    });
  }

  const fetchPublicCoursesByEnglishLvl = async () => {
    try {
      setDataLoaded(false);
      const response = await $api.get(`/courses/templates/englishlvl/${englishLvlFilter}`);
      if (response.status === 200) {
        const data = await response.data;
        setPublicCourses(data);
        setDataLoaded(true);
        return data;
      } else {
        setDataLoaded(true);
        handleError(response?.data?.message);
      }
    } catch (error) {
      setDataLoaded(true);
      handleError('Error fetching public courses by englishLvl');
    }
  }

  const fetchPublicCoursesByRating = async () => {
    try {
      setDataLoaded(false);
      const response = await $api.get(`/courses/templates/rated/${ratingFilter}`);
      if (response.status === 200) {
        const data = await response.data;
        setPublicCourses(data);
        setDataLoaded(true);
        return data;
      } else {
        setDataLoaded(true);
        handleError(response?.data?.message);
      }
    } catch (error) {
      setDataLoaded(true);
      handleError('Error fetching public courses by rating');
    }
  }

  const fetchPublicCoursesByTag = async () => {
    try {
      setDataLoaded(false);
      const response = await $api.get(`/courses/templates/search-by-tag/${tagFilter}`);
      if (response.status === 200) {
        const data = await response.data;
        setPublicCourses(data);
        setDataLoaded(true);
        return data;
      } else {
        setDataLoaded(true);
        handleError(response?.data?.message);
      }
    } catch (error) {
      setDataLoaded(true);
      handleError('Error fetching public courses by tag');
    }
  }

  const searchByOneFilter = async () => {
    if (lastFilter === 'englishlvl') {
      await fetchPublicCoursesByEnglishLvl();
      //setEnglishLvlFilter('');
    } else if (lastFilter === 'rating') {
      await fetchPublicCoursesByRating();
      //setRatingFilter('');
    } else if (lastFilter === 'tag') {
      await fetchPublicCoursesByTag();
    } else {
      handleError('No filter selected');
    }
  }

  const handleRatingChange = (event) => {
    setRatingFilter(event.target.value);
    setLastFilter('rating');
  };

  const handleEnglishLvlChange = async (event) => {
    setEnglishLvlFilter(event.target.value);
    setLastFilter('englishlvl');
  };

  const handleChangeFindByTag = async (event) => {
    let tag = event.target.value;
    if (tag.length !== 0 && tag !== null && tag[0] === '#') {
      tag = tag.slice(1);
    }
    setTagFilter(tag);
    setLastFilter('tag');
  }

  const handlePublicShowMore = () => {
    setPublicVisibleCourseCount((prevCount) => prevCount + 8);
  };

  const handleEnrollmentShowMore = () => {
    setEnrollmentVisibleCourseCount((prevCount) => prevCount + 8);
  };

  const handleCreatedShowMore = () => {
    setCreatedVisibleCourseCount((prevCount) => prevCount + 8);
  };
  
  const renderCoursePreviews = (courses, visibleCourseCount, renderCourseTypes, courseEnrollments = null) => {
    return courses.slice(0, visibleCourseCount).map((course) => {
      let currentCourseEnrollment = null;
      // if currentCoursePreview is courseEnrollment then need to get current courseEnrollment, so as to use correct id for enrollment in site url
      // if courseTemplate - then courseTemplateId, if courseEnrollment - then courseEnrollmentId
      if (renderCourseTypes === 'courseEnrollment' && courseEnrollments !== null) {
        for (const courseEnrollment of courseEnrollments) {
          if (courseEnrollment.coursePresentationId === course._id) {
            currentCourseEnrollment = courseEnrollment;
            break;
          }
        }
      }

      return (
        <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
          <CoursePreview course={course} courseType={renderCourseTypes} courseEnrollment={currentCourseEnrollment}/>
        </Grid>
      );
    });
  };

  if (!isDataLoaded) {
    return (
      <Spinner />
    );
  }

  return (
    <>
      <Container className={styles.root}>
        <Typography variant="h4" component="h1" align="center">
          Catalog of courses
        </Typography>

        <div className={styles.filterContainer}>
          <Typography variant="h5" component="h2" className={styles.typography}>
            Public courses:
          </Typography>
          <div className={styles.filterControls}>
            <TextField label="Find by tag" variant="outlined" size="small" className={styles.filterInput} onChange={handleChangeFindByTag}/>
            <FormControl className={styles.filterSelect}>
              <NativeSelect value={englishLvlFilter} onChange={handleEnglishLvlChange}>
                <option value="" disabled>
                  EngLvl
                </option>
                <option value="A0">A0</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </NativeSelect>
            </FormControl>
            <FormControl className={styles.filterSelect}>
              <NativeSelect value={ratingFilter} onChange={handleRatingChange}>
                <option value="" disabled>
                  Rating
                </option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </NativeSelect>
            </FormControl>
            <Button variant="contained" color="primary" onClick={searchByOneFilter} className={styles.buttons}>
              Search by last
            </Button>
          </div>
        </div>

        <Grid container spacing={3} className={styles.courseContainer}>
          {renderCoursePreviews(publicCourses, publicVisibleCourseCount, 'courseTemplate')}
        </Grid>
        {publicVisibleCourseCount < publicCourses.length && (
          <Button variant="contained" color="default" onClick={handlePublicShowMore} className={styles.showMoreButton}>
            Show More
          </Button>
        )}

        <Grid container spacing={3} className={styles.courseContainer}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" className={styles.typography}>
              Your course enrollments:
            </Typography>
          </Grid>
          {renderCoursePreviews(courseTemplatesOfEnrollments, enrollmentVisibleCourseCount, 'courseEnrollment', courseEnrollments)}
        </Grid>
        {enrollmentVisibleCourseCount < courseTemplatesOfEnrollments.length && (
          <Button variant="contained" color="default" onClick={handleEnrollmentShowMore} className={styles.showMoreButton}>
            Show More
          </Button>
        )}

        <Grid container spacing={3} className={styles.courseContainer}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" className={styles.typography}>
              Your created courses:
            </Typography>
          </Grid>
          {renderCoursePreviews(createdCourses, createdVisibleCourseCount, 'courseTemplate')}
        </Grid>
        {createdVisibleCourseCount < createdCourses.length && (
          <Button variant="contained" color="default" onClick={handleCreatedShowMore} className={styles.showMoreButton}>
            Show More
          </Button>
        )}
      </Container>
    </>
  );
};
