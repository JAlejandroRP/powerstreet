import * as api from '../api/index.js'

export const register = async (user) => await api.register(user)
// {
//     try {
//         const res = await api.createUser(user)
//         return res
//         console.log(res)
//     } catch(error){
//         console.error(error.message)
//     }
// }

export const login = async(user) => await api.login(user)
// {
//     try{
//         return await api.findUser(user)
//     } catch(error){
//         console.log(error);
//     }
// }