import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const PopUpWindow = ({error, handleCloseError, success, handleCloseSuccess}) => {
    return(
<Snackbar open={!!error || !!success} autoHideDuration={6000} onClose={(!!error) ? handleCloseError : handleCloseSuccess}>
  {error ? (
    <MuiAlert onClose={handleCloseError} severity="error">
      {error}
    </MuiAlert>
  ) : (
    <MuiAlert onClose={handleCloseSuccess} severity="success">
      {success}
    </MuiAlert>
  )}
</Snackbar>

    );
}

export default PopUpWindow;