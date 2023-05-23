import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const PopUpWindow = ({error, handleCloseError}) => {
    return(
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
            <MuiAlert onClose={handleCloseError} severity="error">
                {error}
            </MuiAlert>
        </Snackbar>
    );
}

export default PopUpWindow;