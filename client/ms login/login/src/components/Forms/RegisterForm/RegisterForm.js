import { useState } from 'react';
import styles from '../Forms.module.css'
import FormInput from '../FormInput/FormInput';
import { useFormik } from 'formik';
import { object, string, date, ref } from 'yup'
import PropTypes from 'prop-types';
import { v4 as uniqid } from 'uuid';
import { Container, Button, Form } from 'react-bootstrap';
import { getStorage, setUserId, setUserInStorage } from '../../../utils/storage';
import { login, register } from '../../../actions/users.js'

const RegisterForm = ({ onLogin }) => {
    const [submit, setSubmit] = useState(false)

    const formik = useFormik({
        initialValues: {
            username: '',
            fullName: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: object({
            username: string().required('please enter your username')
                .max(15, 'your username must be 15 characters or less')
                .min(4, 'your username must be 4 characters or more'),
            fullName: string().required('please enter your full name')
                .min(4, 'your username must be 4 characters or more'),
            password: string().required('please enter your password')
                .min(8, 'your password must be 8 characters or more')
                .matches(/^(?=.*[a-z]).{8,}$/, 'invalid password')
                .matches(/^(?=.*[A-Z])(?=.*[a-zA-Z])/, 'password must contain uppercase letters')
                .matches(/^(?=.*\d)/, 'password must contain a digit'),
            confirmPassword: string().required('please enter your confirm password')
                .oneOf([ref('password')], 'your confirm password must match'),
        }),
        onSubmit: async (values, { setFieldError }) => {
            const res = await register(values)

            if (res && res.status === 200)
                window.location.replace('http://192.168.100.7:3006/?sessionID=' + res.data.sessionID)
            else {
                setFieldError('username', 'username already exist!')
            }

            // console.log(res);
            // if (getStorage('users')) {
            //     const [isIterateUsername, isIterateEmail] = checkUser(values.username, values.email)

            //     if (isIterateUsername) 
            //         setFieldError('username', 'please change your username')
            //     else {
            //         const userId = uniqid()
            //         const users = getStorage('users')
            //         const user = { id: userId, ...values, isLogin: true, }
            //         users.push(user)

            //         setUserId(userId)
            //         setUserInStorage('users', users)
            //         onRegister()
            //     }
            // } else {
            //     const userId = uniqid()
            //     const users = [{ id: userId, ...values, isLogin: true, }]

            //     setUserId(userId)
            //     setUserInStorage('users', users)
            //     onRegister()
            // }
        }
    })

    // const checkUser = (username, email) => {
    //     const users = getStorage('users')
    //     const isIterateUsername = users.some(user => user.username === username)
    //     const isIterateEmail = users.some(user => user.email === email)

    //     return [isIterateUsername , isIterateEmail]
    // }

    return (
        <Container fluid className={`${styles.container} d-flex justify-content-center align-items-center px-5`}>
            <div className="shadow p-3 mb-5 bg-white rounded">

                <Form noValidate className={styles.form} onSubmit={formik.handleSubmit}>
                    <h2>Register</h2>

                    <FormInput
                        className="mt-5 mb-4"
                        controlId="usernameInp"
                        name="username"
                        text="Username"
                        placeholder="Enter your username"
                        invalid={submit && formik.errors.username ? true : false}
                        errMsg={formik.errors.username || ''}
                        valid={submit && !formik.errors.username ? true : false}
                        successMsg="done"
                        {...formik.getFieldProps('username')}
                    />
                    <FormInput
                        className="mb-4"
                        controlId="fullNameInp"
                        name="fullName"
                        text="Full name"
                        placeholder="Enter your full name"
                        invalid={submit && formik.errors.fullName ? true : false}
                        errMsg={formik.errors.fullName || ''}
                        valid={submit && !formik.errors.fullName ? true : false}
                        successMsg="done"
                        {...formik.getFieldProps('fullName')}
                    />

                    <FormInput
                        className="mb-4"
                        type="password"
                        controlId="passwordInp"
                        name="password"
                        text="Password"
                        placeholder="Enter your Password"
                        invalid={submit && formik.errors.password ? true : false}
                        errMsg={formik.errors.password || ''}
                        valid={submit && !formik.errors.password ? true : false}
                        successMsg="done"
                        {...formik.getFieldProps('password')}
                    />

                    <FormInput
                        className="mb-4"
                        type="password"
                        controlId="confirmPasswordInp"
                        name="confirmPassword"
                        text="Confirm Password"
                        placeholder="Enter your Confirm Password"
                        invalid={submit && formik.errors.confirmPassword ? true : false}
                        errMsg={formik.errors.confirmPassword || ''}
                        valid={submit && !formik.errors.confirmPassword ? true : false}
                        successMsg="done"
                        {...formik.getFieldProps('confirmPassword')}
                    />

                    <Button
                        className={`${styles["submit-btn"]} w-100`}
                        onClick={() => setSubmit(true)}
                        disabled={submit && !formik.isValid ? true : false}
                        variant="primary"
                        type="submit">
                        Register
                    </Button>

                    <Button
                        onClick={() => onLogin('login')}
                        className='mt-4 p-2'
                        type="button"
                        variant="">
                        do you have an account ? Login instead...
                    </Button>
                </Form>
            </div>
        </Container>
    )
}

// validate component
RegisterForm.propTypes = {
    // onRegister: PropTypes.func.isRequired,
    // onLogin: PropTypes.func.isRequired,
}

export default RegisterForm