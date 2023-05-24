import Paper from '@mui/material/Paper';
import Course from '../../components/Course';
import { useParams } from 'react-router-dom';

export const CoursePage = ({courseType}) => {
    const { courseId } = useParams();

    return (
        <Paper style={{ padding: 30 }}>
            {(courseType === 'courseTemplate' || courseType === 'courseEnrollment') ? <Course courseType={courseType} courseId={courseId}/> : <> </>}
        </Paper>
    );
}