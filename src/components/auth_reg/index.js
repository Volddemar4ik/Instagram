import * as React from 'react';

import {
    useHistory,
    useLocation
} from "react-router-dom";

import {
    Paper,
    Box,
    Typography,
    Container
} from "@mui/material";

import LoginForm from './login_form';

import './style.scss'


// ссылка на страницу регистрации/авторизации
function RegistrationLink() {
    const history = useHistory()
    let location = useLocation().pathname === '/'

    function regLogLink() {
        history.push(location ? '/registration' : '/')
    }

    return (
        <Typography
            className='registration-link'
            variant="subtitle1"
        >
            {location ? 'Нет аккаунта?' : 'Уже зарегистрированы? '}
            <Typography
                className='cursor-pointer'
                variant="body1"
                color='primary.main'
                onClick={regLogLink}
            >
                {location ? 'Зарегистрироваться' : `Войти`}
            </Typography >
        </Typography >
    )
}


// Основное окно регистрации (без полей ввода и кнопок)
function AuthReg() {
    return (
        <Container>
            <Paper
                className='block-auth-reg'
                elevation={4}
            >
                <Typography
                    className='logo'
                    variant="h4"
                >
                    Hipstagram
                </Typography>

                <Box className="login-form" >
                    <LoginForm />
                </Box>

                <RegistrationLink />
            </Paper>
        </Container >
    )
}

export default AuthReg