import { useEffect, useState, useCallback } from 'react';
import RegisterForm from './components/Forms/RegisterForm/RegisterForm'
import LoginForm from './components/Forms/LoginForm/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const [toggle, setToggle] = useState('login');
  const changeToggle = (toggle) => setToggle(toggle)

  // const checkUserIsRegister = useCallback(() => {
  //   if (checkIsInitStorage()) {
  //     const userId = getStorage('id')
  //     const users = getStorage('users')

  //     const [userRegistered] = users.filter(user => user.id === userId)

  //     userRegistered.isLogin && changeToggle('panel')
  //     !userRegistered.isLogin && changeToggle('login')
  //   } else changeToggle('register')
  // }, [])

  // useEffect(() => {
  //   checkUserIsRegister()
  // }, [checkUserIsRegister])


  // console.log(toggle);
  return (
    <>

      {toggle === 'register' && <RegisterForm
        onLogin={changeToggle}
      />
      }
      {toggle === 'login' && <LoginForm onRegister={changeToggle}  />}
      {/* { toggle === 'register' && <RegisterForm onRegister={checkUserIsRegister}  onLogin={changeToggle} /> } */}
      {/* { toggle === 'login' && <LoginForm onRegister={changeToggle} onLogin={checkUserIsRegister} /> } */}
    </>
  )
}

export default App