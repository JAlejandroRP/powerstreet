import axios from 'axios'

const docsUrl = 'http://192.168.100.7:3001/docs'
const docsTitlesUrl = 'http://192.168.100.7:3004/docs'
const docsReadUrl = 'http://192.168.100.7:3003/docs'
const usersUrl = 'http://192.168.100.7:3000/users'

export const saveDoc = async (params) => {
    // console.log(doc)
    return await axios.post(docsUrl + '/save', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const readDoc = async (params) => {
    // console.log(params)
    return await axios.post(docsReadUrl + '/read', params)
}

export const updateDoc = async (params) => {
    // console.log(doc)
    return await axios.patch(docsUrl + '/update', params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
export const getDocs = async (sessionID) => {
    // console.log(sessionID);
    return await axios.get(docsTitlesUrl + '/getdocs')
}

export const logOut = async (sessionID) => {
    return await axios.post(usersUrl + '/logout', { sessionID: sessionID })
}

export const isUserLogged = async (sessionID) => {
    // console.log(new Date() + username);
    const res = await axios.post(usersUrl + '/islogged', { sessionID: sessionID }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    // console.log("api/isuserlogged " + res.data)
    return JSON.parse(res.data)
}
// export const findUser = (user) => axios.post(url + '/login', user)