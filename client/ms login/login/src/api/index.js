import axios from 'axios'

// axios.defaults.withCredentials = true
const url = process.env.USERS_URL || 'http://192.168.100.7:3000/users'

const headers = {
    headers: {
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
    },
}
export const register = async (user) => {
    try {
        console.log(url);
        const res = await axios.post(url + '/register', user, headers)
        return res
    } catch (error) {
        return error
    }
}

export const login = async (user) => {
    try {
        const res = await axios.post(url + '/login', user, headers)
        return res
    } catch (error) {
        return error
        // return JSON.parse(error)
    }
}