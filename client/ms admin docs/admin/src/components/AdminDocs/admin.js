import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DocSelect from '../SearchInput/SearchInput';
import Stack from '@mui/material/Stack';
import { Card, CardContent, Divider, Skeleton, TextField } from '@mui/material';
import { updateDoc, getDocs, saveDoc, readDoc } from '../../actions/docs';
import { isUserLogged, logOut } from '../../actions/user';
import { useSnackbar } from 'notistack'
import ReactMarkdown from 'react-markdown'
import io from 'socket.io-client'
import MyNavbar from '../MyNavbar/MyNavbar.js';
import SideMenu from '../SideMenu/SideMenu.js';
import Details from '../Details/Details.js';
import FileUploadSingle from '../File/FileInput';

const socket = io('http://192.168.100.7:3001/')

const saveSessionId = () => {
    let sessID = window.location.search//.replace('?sessionID=')
    if (!sessID)
        return
    sessID = sessID.replace('?sessionID=', '')
    document.cookie = `sessionID=${sessID}; expires=${new Date()}; path=/`
    window.localStorage.setItem('sessionID', sessID)
}


let Doc = {
    sessionID: '',
    _id: '',
    titulo: '',
    documento: '',
    autor:
    {
        usuario: '',
        nombre: ''
    },
    modificado_por: {
        usuario: '',
        nombre: ''
    },
    fecha_creacion: '',
    fecha_modificacion: '',
    historial_cambios: []
}


export default function DocsAdmin() {
    saveSessionId()
    const sessionID = localStorage.getItem('sessionID')
    Doc.sessionID = sessionID
    const cleanDoc = Doc
    const { enqueueSnackbar } = useSnackbar()
    const [docsTitles, setDocsTitles] = React.useState([])
    const [edit, setEdit] = React.useState(false)
    const [doc, setDoc] = React.useState(cleanDoc)
    const [user, setUser] = React.useState({})
    const [title, setTitle] = React.useState('')
    const [content, setContent] = React.useState('')
    const [modified, setModified] = React.useState({ modifiedBy: '', modifiedOn: '' })
    const [loadingDoc, setLoadingDoc] = React.useState(false)
    // const valueRef = React.useRef('')

    React.useEffect(() => {
        const checkIfLogged = async () => {
            const res = await isUserLogged(sessionID)
            if (!res)
                window.location.replace('http://192.168.100.7:3005')
            setUser(res.user)
        }

        const getDocsTitles = async () => {
            const res = await getDocs(sessionID)
            const arr = JSON.parse(res.data)
            arr.unshift({ id: 0, title: '*** new doc ***' })
            setDocsTitles(arr)
        }

        const receivedMsg = ({ body }) => {
            console.log(body);
            getDocsTitles()
            enqueueSnackbar(`${body.nombre} updated/created a doc!`, { variant: 'info', autoHideDuration: 2000 })
        }

        checkIfLogged()
        getDocsTitles()
        socket.on('message', receivedMsg)

        return () => {
            socket.off('message', receivedMsg)
        }

    }, [])

    const handleCancel = () => {
        if (doc.autor.usuario === '')
            return enqueueSnackbar(`nothing to revert!`, { variant: 'success', autoHideDuration: 2000 })

        let docTemp = doc
        const ultimoCambio = doc.historial_cambios.slice(-1)[0]
        if (!ultimoCambio) {
            setTitle('Gimme a title!')
            setContent('Edit me!')
            return enqueueSnackbar(`changes reverted!`, { variant: 'success', autoHideDuration: 2000 })
        }
        // console.log(ultimoCambio);
        docTemp.titulo = doc.titulo
        docTemp.documento = ultimoCambio.documento
        // console.log(docTemp);

        setTitle(docTemp.titulo)
        setContent(docTemp.documento)
        setDoc(docTemp)
        enqueueSnackbar(`changes reverted!`, { variant: 'success', autoHideDuration: 2000 })
    }

    const handleReadDoc = async (docId) => {
        setLoadingDoc(true)
        // for (let index = 0; index < 50000; index++) {
        // console.log('');
        // }
        const res = await readDoc({ id: docId, session: sessionID })

        console.log(res);
        if (res && res.status === 200) {
            let docTemp = { ...res.data }
            docTemp.sessionID = sessionID
            console.log(docTemp);
            setDoc(docTemp)
            setTitle(res.data.titulo)
            setContent(res.data.documento)
            setModified({
                modifiedBy: res.data.modificado_por.nombre,
                modifiedOn: res.data.fecha_modificacion
            })
            setLoadingDoc(false)
        }
        else {
            handleResponse(res)
            setLoadingDoc(false)
        }
    }

    const handleLogout = async () => {
        await logOut(sessionID)// isLogged()
        //redirect to login page
        window.location.replace('http://192.168.100.7:3005')
    }

    const handleSetNewDoc = (title, content) => {
        setContent(content)
        setTitle(title)
        const dateNow = new Date().toLocaleString()
        const doctemp = {
            ...cleanDoc,
            _id: '',
            documento: content,
            titulo: title,
            autor: {
                usuario: user.usuario,
                nombre: user.nombre
            },
            // fecha_modificacion sera actualizada al momento de querer guardar el documento
            fecha_creacion: dateNow,
            modificado_por: {
                usuario: user.usuario,
                nombre: user.nombre
            }
        }
        console.log(doctemp);
        setDoc(doctemp)
        setModified({
            modifiedBy: doctemp.modificado_por.nombre,
            modifiedOn: doctemp.fecha_creacion
        })
    }

    const updateDocBeforeSave = () => {
        Doc = doc
        Doc.titulo = title
        Doc.documento = content
        Doc.fecha_modificacion = new Date().toLocaleString()

        setDoc(Doc)
    }

    const handleSaveDoc = async () => {
        updateDocBeforeSave()
        // return
        if (doc.autor.nombre === '')
            return enqueueSnackbar('click create new doc in Docs Search!', { variant: 'info', autoHideDuration: 3000 })

        if (doc.titulo === '' || doc.documento === '')
            return enqueueSnackbar('fill title and content!', { variant: 'warning', autoHideDuration: 2000 })

        const res = doc._id ? await updateDoc(doc) : await saveDoc(doc)

        console.log(res);
        if (res && res.status === 200) {
            socket.emit('message', user)
            if (!doc._id) {
                doc._id = doc._id === '' ? res.data.insertedId : doc._id
                addInsertedDocToArr(doc.titulo, doc._id)
            }
            else {
                updateTitleInArr(doc.titulo, doc._id)
            }
            setModified({
                modifiedBy: doc.modificado_por.nombre,
                modifiedOn: doc.fecha_modificacion
            })
            setEdit(true)
            return enqueueSnackbar('Doc save success!', { variant: "success", autoHideDuration: 2000 })
        }
        handleResponse(res)
    }

    const updateTitleInArr = (name, id) => {
        const arr = docsTitles
        const idx = arr.findIndex(e => e.id === id)
        arr[idx].title = name

        setDocsTitles(arr)
    }

    const addInsertedDocToArr = (name, id) => {
        const arr = docsTitles
        arr.splice(1, 0, { id: id, title: name })
        console.log(arr);
        setDocsTitles(arr)
    }

    const handleResponse = (res) => {
        if (!res)
            return enqueueSnackbar('Service unavailable', { variant: 'error', autoHideDuration: 2000 })

        // unauthorized
        if (res.response.status === 401)
            return window.location.replace('http://localhost:3005')

        if (res.response.status === 404)
            return enqueueSnackbar('not found!', { variant: 'error', autoHideDuration: 2000 })
        // another error from axios
        if (res.name === "AxiosError")
            return enqueueSnackbar('an error ocurred!', { variant: 'error', autoHideDuration: 2000 })
    }

    const handleDocClick = async (option) => {
        if (option.id === 0) {
            handleSetNewDoc('Gimme a title!', 'Edit me!')
        }
        else {
            await handleReadDoc(option.id)
        }
        enqueueSnackbar('start editing the doc!', { variant: 'info', autoHideDuration: 2000 })
    }

    const enqueueSB = (msg, variant, duration) => enqueueSnackbar(msg, { variant: variant, autoHideDuration: duration })

    return (
        <Box sx={{
            display: 'flex',
            flexGrow: 1,
            width: '100%'
        }}>
            <MyNavbar user={user} onLogout={handleLogout} />
            <SideMenu docsTitles={docsTitles} handleDocClick={handleDocClick} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Box
                    sx={{
                        display: {
                            xl: 'none',
                            lg: 'none',
                            md: 'none',
                            sm: 'block',
                            xs: 'block'
                        }
                    }}
                >
                    <DocSelect
                        titles={docsTitles}
                        onDocClick={async (e) => await handleDocClick(e)}
                    />
                </Box>
                <Divider component="div" role="presentation">
                    <Typography variant="h6">Doc Actions</Typography>
                </Divider>
                <Toolbar
                    sx={{ justifyContent: 'center' }}
                >
                    <Stack spacing={2} direction="row">
                        <Button
                            // disabled={content}
                            variant='outlined'
                            color='success'
                            onClick={handleSaveDoc}>Save doc</Button>
                        <Button
                            // disabled={content}
                            variant='outlined'
                            onClick={() => {
                                // !edit && valueRef.current.focus()
                                setEdit(!edit)
                            }}>{edit ? 'Edit' : 'Visualization'}</Button>
                        <Button
                            onClick={async () => await handleCancel()}
                            // disabled={content}
                            color='error'
                            variant='outlined'
                        >Cancel
                        </Button>
                        <FileUploadSingle
                            onLoad={handleSetNewDoc}
                            enqueueSnackbar={enqueueSB}
                        />

                    </Stack>
                </Toolbar>
                <Box
                // minHeight={'300px'}
                >
                    <Divider component="div" role="presentation">
                        <Typography variant="h6">
                            {/* idx:{historyIdx} - {doc.id} */}
                            Doc {!edit ? 'Edition' : 'Visualization'}</Typography>
                    </Divider>
                    <TextField id="outlined-basic" label="Title" variant="outlined"
                        sx={{ marginBottom: '20px' }}
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value)
                            // console.log(title)
                        }}
                    />
                    <Box
                        sx={{
                            // width: 500,
                            height: '350px',
                            maxWidth: '100%',
                            maxHeight: '100%',
                        }}
                        overflow={edit && 'auto'}
                    >
                        {/* // markdown inputbox */}
                        {loadingDoc &&
                            <>
                                <Skeleton />
                                <Skeleton variant='rectangular' />
                                <Skeleton variant='rectangular' />
                                <Skeleton />
                                <Skeleton />
                            </>
                        }
                        {!edit && !loadingDoc && <TextField
                            // inputRef={valueRef}
                            fullWidth label="" id="fullWidth" multiline rows={13}
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value)
                                // console.log(content)
                            }}
                        />}

                        {edit && !loadingDoc &&
                            <Card
                                variant='outlined'
                                sx={{ overflow: 'auto', marginBottom: '20px', padding: '5px' }}
                            >
                                <CardContent >
                                    <ReactMarkdown>{content}</ReactMarkdown>
                                </CardContent>
                            </Card>
                        }
                    </Box>
                </Box>
                <Details modified={modified} document={doc} />
            </Box>
        </Box>
    )
}
