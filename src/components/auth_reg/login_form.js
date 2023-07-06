import React, {
    forwardRef,
    useState
} from 'react';

import { useDispatch } from 'react-redux';

import {
    useHistory,
    useLocation
} from "react-router-dom";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Button,
    Stack,
    OutlinedInput,
    IconButton,
    InputLabel,
    InputAdornment,
    FormControl,
    Slide,
    Tooltip,
    ClickAwayListener
} from "@mui/material";

import {
    Visibility,
    VisibilityOff,
    Refresh,
    Person
} from '@mui/icons-material';

import {
    actionFullLogin,
    actionFullRegistration
} from "../../redux/thunks";


// анимация появление модального окна
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
})

// поля ввода и кнопки
function LoginForm() {
    const location = useLocation().pathname === '/';
    const dispatch = useDispatch()
    const history = useHistory();

    // отслеживаем введение данных в полях логин/пароль
    const [data, setData] = useState({ login: '', pass: '', confirmPass: '' })

    // проверяем данные на валидность, чтобы активировать кнопку
    const [isDataValid, setIsDataValid] = useState(false)

    // проверяем данные только после ухода с фокуса(чтобы при открытии страницы сразу не горело красным все)
    const [passwordInFocus, setPassworInFocus] = useState(false)

    //  модальное окно ошибки при реге открытие/закрытие
    const [open, setOpen] = useState(false);
    const openModalAlertWindow = () => {
        setOpen(true);
    }
    const closeModalAlertWindow = () => {
        setOpen(false);
    }

    // функция проверки пароля, которая запускается, когда уходит фокус с поля пароля
    function isPasswordValid() {
        setPassworInFocus(true)

        // регулярка для проверка пароля
        const patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // регулярка для проверки логина на латинские символы и цифры
        const patternLogin = /^[a-zA-Z0-9]+$/

        // сама проверка на валидность сразу всего
        setIsDataValid(patternLogin.test(data.login) && patternPassword.test(data.pass) && (data.pass === data.confirmPass))
    }

    // функция генерации случайного логина
    function generateRandomLogin() {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        const length = Math.floor(Math.random() * (10 - 5 + 1) + 5) // генерируем длину слова от 5 до 10 символов
        let word = ''
        for (let i = 0; i < length; i++) {
            word += characters[Math.floor(Math.random() * characters.length)] // выбираем случайный символ из списка доступных символов
        }
        return word
    }

    // генерируем новый логин при клике на иконку
    function generateLogin() {
        const newLogin = generateRandomLogin()

        document.getElementById('login').focus()

        setData({ ...data, login: newLogin })

        // и проворачиваем иконку
        const rotate = document.getElementById('loginUpdate')
        rotate.classList.add('rotate');
        setTimeout(() => {
            rotate.classList.remove('rotate');
        }, 2000)
    }

    // включаем,выклюаем отображение пароля
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // включаем,выклюаем отображение подтверждения пароля
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const handleClickShowPasswordConfirm = () => setShowPasswordConfirm((show) => !show);
    const handleMouseDownPasswordConfirm = (event) => {
        event.preventDefault();
    };

    // отрабатывание Tooltips при клике на логин
    const [openToolTipsLogin, setOpenToolTipsLogin] = useState(false);
    const handleTooltipCloseLogin = () => {
        setOpenToolTipsLogin(false);
    };
    const handleTooltipOpenLogin = () => {
        setOpenToolTipsLogin(true);
    };

    // отрабатывание Tooltips при клике на пароль
    const [openToolTipsPass, setOpenToolTipsPass] = useState(false);
    const handleTooltipClose = () => {
        setOpenToolTipsPass(false);
    };
    const handleTooltipOpen = () => {
        setOpenToolTipsPass(true);
    };

    // Регистрация
    function fullRegistration() {
        dispatch(actionFullRegistration(data.login, data.confirmPass))
            .then(token => {
                if (token === null) {
                    openModalAlertWindow()
                } else {
                    history.push('/')
                }
            })
    }

    // Авторизация
    function fullLogin() {
        dispatch(actionFullLogin(data.login, data.pass))
            .then(token => {
                if (token === null) {
                    openModalAlertWindow()
                }
            })
    }


    return (
        <React.Fragment>
            <Stack spacing={2}>
                <ClickAwayListener onClickAway={handleTooltipCloseLogin}>
                    <Tooltip
                        PopperProps={{
                            disablePortal: true,
                        }}
                        onClose={handleTooltipClose}
                        open={openToolTipsLogin}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={!location &&
                            'Сгенерируйте или введите пароль (только латинские буквы и цифры)'
                        }
                        arrow
                    >
                        <FormControl
                            variant="outlined"
                            onClick={handleTooltipOpenLogin}
                            error={!location && passwordInFocus && !isDataValid}
                        >
                            <InputLabel
                                htmlFor="outlined-adornment-password"
                            >
                                Логин
                            </InputLabel>

                            <OutlinedInput
                                fullWidth
                                id="login"
                                label="Логин"
                                size="normal"
                                type='text'
                                value={data.login}
                                onChange={e => setData({ ...data, login: e.target.value })}
                                onBlur={isPasswordValid}
                                endAdornment={
                                    <InputAdornment
                                        position="end"
                                    >
                                        {!location &&
                                            <IconButton
                                                aria-label="login"
                                                onClick={generateLogin}
                                                edge="end"
                                                title='Сгенерировать логин'
                                            >
                                                <Refresh id='loginUpdate' />
                                            </IconButton>}

                                        {location &&
                                            <IconButton
                                                aria-label="login"
                                                edge="end"
                                                title='Логин'
                                            >
                                                <Person />
                                            </IconButton>}
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Tooltip>
                </ClickAwayListener>

                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <Tooltip
                        PopperProps={{
                            disablePortal: true,
                        }}
                        onClose={handleTooltipClose}
                        open={openToolTipsPass}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={!location &&
                            'Минимум 8 символов (большие и маленькие латинские буквы, цифры и спецсимволы)'
                        }
                        arrow
                    >
                        <FormControl
                            variant="outlined"
                            onClick={handleTooltipOpen}
                            error={!location && passwordInFocus && !isDataValid}
                        >
                            <InputLabel
                                htmlFor="outlined-adornment-password"
                            >
                                Пароль
                            </InputLabel>

                            <OutlinedInput
                                fullWidth
                                id="password"
                                label="Пароль"
                                size="normal"
                                type={showPassword
                                    ? 'text'
                                    : 'password'}
                                value={data.pass}
                                onChange={e => setData({ ...data, pass: e.target.value })}
                                onBlur={isPasswordValid}
                                endAdornment={
                                    <InputAdornment
                                        position="end"
                                    >
                                        <IconButton
                                            aria-label="visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            title={showPassword
                                                ? 'Скрыть пароль'
                                                : 'Показать пароль'}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Tooltip>
                </ClickAwayListener>

                {!location &&
                    <FormControl
                        variant="outlined"
                        error={passwordInFocus && !isDataValid}
                    >
                        <InputLabel
                            htmlFor="outlined-adornment-password"
                        >
                            Подтвердите пароль
                        </InputLabel>

                        <OutlinedInput
                            fullWidth
                            id="confirmPassword"
                            label="Подтвердите пароль"
                            size="normal"
                            type={showPasswordConfirm
                                ? 'text'
                                : 'password'}
                            value={data.confirmPass}
                            onChange={e => setData({ ...data, confirmPass: e.target.value })}
                            onBlur={isPasswordValid}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="visibility"
                                        onClick={handleClickShowPasswordConfirm}
                                        onMouseDown={handleMouseDownPasswordConfirm}
                                        edge="end"
                                        title={showPasswordConfirm
                                            ? 'Скрыть пароль'
                                            : 'Показать пароль'}
                                    >
                                        {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>}

                <Button
                    size="large"
                    variant="contained"
                    disabled={location
                        ? (isDataValid || false)
                        : !isDataValid}
                    onClick={location
                        ? fullLogin
                        : fullRegistration}
                >
                    {location
                        ? 'Войти'
                        : 'Регистрация'}
                </Button>
            </Stack>

            <Dialog
                open={open}
                onClose={closeModalAlertWindow}
                TransitionComponent={Transition}
            >
                <DialogTitle>
                    Что-то пошло не так!
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        {
                            location
                                ? 'Вы ввели неправильный логин или пароль. Повторите попытку.'
                                : 'Этот логин уже зарегистрирован. Используйте другой логин или войдите в свою учетную запись.'
                        }
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={closeModalAlertWindow}
                    >
                        Ок
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default LoginForm