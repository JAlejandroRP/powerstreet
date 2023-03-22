import 'bootstrap/dist/css/bootstrap.min.css';
import DocsAdmin from './components/AdminDocs/admin';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

const App = () => {
    return (
        <>
            <SnackbarProvider maxSnack={5} autoHideDuration={1000}>

                <DocsAdmin></DocsAdmin>
            </SnackbarProvider>
        </>
    )
}

export default App