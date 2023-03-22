import { useState } from 'react'
import { login } from '../../../actions/users'
import styles from '../Forms.module.css'
import FormInput from '../FormInput/FormInput'
import { Container, Form, Button } from 'react-bootstrap'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import PropTypes from 'prop-types'

// import { getStorage, setUserId, updateStorage } from '../../../utils/storage'



const LoginForm = ({ onRegister }) => {
    const [submit, setSubmit] = useState(false)
    // const [auth, setAuth] = useState(false)

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: object({
            username: string().required('please enter your username')
                .max(15, 'your username must be 15 characters or less')
                .min(4, 'your username must be 4 characters or more'),
            // email: string().email('invalid email').required('please enter your email'),
            password: string().required('please enter your password')
                .min(8, 'your password must be 8 characters or more')
                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'invalid password'),
        }),
        onSubmit: async ({ username, password }, { setFieldError }) => {
            const res = await login({ username: username, password: password })
            console.log(res)

            if (res.status === 200) {
                // window.localStorage.setItem('sessionID', res.data.sessionID)
                // sessionStorage.setItem('sessionID', res.data.sessionID)

                // console.log(localStorage.getItem('sessionID'));
                // console.log(sessionStorage.getItem('sessionID'));
                window.location.replace('http://192.168.100.7:3006/?sessionID=' + res.data.sessionID)
                // window.location.href = 'http://localhost:3006?username=' + username
            }
            else {
                setFieldError('username', 'check your credentials!')
                setFieldError('password', 'check your credentials!')
            }

            // onLogin()
            // const users = getStorage('users')
            // const myVerifyUser = users && users.find(user => user.username === username)

            // if (users && myVerifyUser) {
            //     if (myVerifyUser.password === password)
            //         login(myVerifyUser)
            //     // else if (myVerifyUser.email !== email)
            //     //     setFieldError('email', `your email isn't true`)
            //     else 
            //         setFieldError('password', `your password isn't correct`)
            // } else
            //     setFieldError('username', 'your username not found')
        }
    })

    // const login = (myVerifyUser) => {
    //     const users = getStorage('users')
    //     updateStorage(users, myVerifyUser, true)
    //     setUserId(myVerifyUser.id)
    //     onLogin()
    // }

    return (
        <>
            <Container fluid className={`${styles.container} d-flex justify-content-center align-items-center px-5`}>
                <div className="shadow p-3 mb-5 bg-white rounded">
                    <Form
                        noValidate className={styles.form} onSubmit={formik.handleSubmit}>
                        <h2>Login</h2>

                        <FormInput
                            className="mb-4 mt-5"
                            name="username"
                            controlId="username-input"
                            text="Username"
                            placeholder="Enter your Username"
                            errMsg={formik.errors.username || ''}
                            successMsg="done"
                            invalid={submit && formik.errors.username ? true : false}
                            valid={submit && !formik.errors.username ? true : false}
                            {...formik.getFieldProps('username')}
                        />

                        <FormInput
                            className="mb-4"
                            name="password"
                            controlId="password-input"
                            text="Password"
                            placeholder="Enter your Password"
                            type="password"
                            errMsg={formik.errors.password || ''}
                            successMsg="done"
                            invalid={submit && formik.errors.password ? true : false}
                            valid={submit && !formik.errors.password ? true : false}
                            {...formik.getFieldProps('password')}
                        />

                        <Button
                            className={`${styles["submit-btn"]} w-100`}
                            onClick={() => setSubmit(true)}
                            disabled={submit && !formik.isValid ? true : false}
                            variant="primary"
                            type="submit">
                            Login
                        </Button>

                        <Button
                            onClick={() => onRegister('register')}
                            className='shadow-none mt-4 p-0'
                            type="button"
                            variant="">
                            you dont' have any account?, register...
                        </Button>

                    </Form>
                </div>
            </Container>
        </>
    )
}

// // validate the component
// LoginForm.propTypes = {
//     onRegister: PropTypes.func.isRequired,
//     onLogin: PropTypes.func.isRequired,
// }

export default LoginForm