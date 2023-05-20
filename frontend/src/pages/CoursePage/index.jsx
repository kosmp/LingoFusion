import Paper from '@mui/material/Paper';
import Course from '../../components/Course';
import { useParams } from 'react-router-dom';

export const CoursePage = () => {
    const { courseType } = useParams();

    return (
        <Paper style={{ padding: 30 }}>
            {(courseType === 'courseTemplate' || courseType === 'courseEnrollment') ? <Course courseType={courseType} /> : <h1>Incorrect path</h1>}
        </Paper>
    );
}