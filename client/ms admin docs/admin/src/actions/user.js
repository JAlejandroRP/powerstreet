import * as api from '../api/index.js'

export const isUserLogged = async (sessionID) => {
    try {
        const res = await api.isUserLogged(sessionID)
        // console.log("actios/user/ "+res)
        return res
    } catch(error){
        console.error(error.message)
    }
}

export const logOut = async (sessionID) => {
    try {
        return await api.logOut(sessionID)
    }catch(error){
        console.error(error)
    }
}