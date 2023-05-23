import Box from '@mui/material/Box';
import { CircularProgress } from '@material-ui/core';

const Spinner = () => {
    return(
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        >
          <CircularProgress size={80} />
        </Box>
    );
}

export default Spinner;