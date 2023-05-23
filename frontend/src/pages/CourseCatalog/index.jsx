import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Grid, FormControl, NativeSelect, Button } from '@material-ui/core';
import CoursePreview from '../../components/CoursePreview';
import Spinner from '../../components/Spinner';
import $api from "../../http/index";
import styles from './CourseCatalog.module.scss';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export const CourseCatalog = () => {
  const [ratingFilter, setRatingFilter] = useState('');
  const [englishLvlFilter, setEnglishLvlFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [publicVisibleCourseCount, setPublicVisibleCourseCount] = useState(8);
  const [enrollmentVisibleCourseCount, setEnrollmentVisibleCourseCount] = useState(8);
  const [createdVisibleCourseCount, setCreatedVisibleCourseCount] = useState(8);
  const [publicCourses, setPublicCourses] = useState([]);
  const [courseTemplatesOfEnrollments, setCourseTemplatesOfEnrollments] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [lastFilter, setLastFilter] = useState(null);
  const [isDataLoaded, setDataLoaded] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { 
    fetchData();
  }, []);

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const fetchPublicCourses = async () => {
    try {
      setDataLoaded(false);
      const response = await $api.get(`/courses/templates/all`);
      console.log(response);
      if (response.status === 200) {
        const data = await response.data;
        setPublicCourses(data);
        setDataLoaded(true);
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
      setDataLoaded(false);
      const response = await $api.get(`/courses/enrollments`);
      
      if (response.status === 200) {
        // need to get course Templates with id from fields 'coursePresentationId' of course Enrollments 
        const courseTemplateIds = response.data.map((course) => course.coursePresentationId);

        const arrayOfAllPublicTemplates = await fetchPublicCourses();
      
        const finalArrayOfTemplates = arrayOfAllPublicTemplates.filter((template) =>
          courseTemplateIds.includes(template._id)
        );    
        setCourseTemplatesOfEnrollments(finalArrayOfTemplates);;
        setDataLoaded(true);
      } else {
        setDataLoaded(true);
        handleError(response?.data?.message);
      } 
    } catch (error) {
      setDataLoaded(true);
      handleError('Error fetching course Enrollments');
    }
  }

  const fetchCreatedCourses = async () => {
    try {
      setDataLoaded(false);
      const response = await $api.get(`/courses/templates/mine`);
      console.log(response);
      if (response.status === 200) {
        const data = await response.data;
        setCreatedCourses(data);
        setDataLoaded(true);
        return data;
      } else {
        setDataLoaded(true);
        handleError(response?.data?.message);
      }
    } catch (error) {
      setDataLoaded(true);
      handleError('Error fetching user created courses');
    }
  }

  const fetchData = async () => {
    await fetchPublicCourses();
    await fetchCourseEnrollments();
    await fetchCreatedCourses();
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
      console.log(response.data)
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

  const renderCoursePreviews = (courses, visibleCourseCount) => {
    return courses.slice(0, visibleCourseCount).map((course) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
        <CoursePreview course={course} />
      </Grid>
    ));
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
                <option option value="A1">A1</option>
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
            <Button variant="contained" color="primary" onClick={searchByOneFilter}>
              Search by last
            </Button>
          </div>
        </div>

        <Grid container spacing={3} className={styles.courseContainer}>
          {renderCoursePreviews(publicCourses, publicVisibleCourseCount)}
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
          {renderCoursePreviews(courseTemplatesOfEnrollments, enrollmentVisibleCourseCount)}
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
          {renderCoursePreviews(createdCourses, createdVisibleCourseCount)}
        </Grid>
        {createdVisibleCourseCount < createdCourses.length && (
          <Button variant="contained" color="default" onClick={handleCreatedShowMore} className={styles.showMoreButton}>
            Show More
          </Button>
        )}
      </Container>
    <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <MuiAlert onClose={handleCloseError} severity="error">
          {error}
        </MuiAlert>
    </Snackbar>
    </>
  );
};
