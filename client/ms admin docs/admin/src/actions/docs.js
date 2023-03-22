import * as api from '../api/index.js'

export const saveDoc = async (params) => {
    try {
        console.log(params);
        const res = await api.saveDoc(params)
        return res
    } catch(error){
        console.error(error.message)
        return error
    }
}

export const readDoc = async (params) => {
    try {
        const res = await api.readDoc(params)
        return res
    } catch(error){
        return error
        console.error(error.message)
    }
}

export const updateDoc = async (params) => {
    try {
        const res = await api.updateDoc(params)
        return res
    } catch(error){
        console.error(error.message)
        return error
    }
}


export const getDocs = async() => {
    try{
        const res = await api.getDocs()
        // console.log(res);
        return res
    }catch(error){
        console.error(error.message);
    }
}