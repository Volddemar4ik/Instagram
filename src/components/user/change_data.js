import React, {
    useContext,
    useEffect,
    useState
} from 'react';

import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
    Typography,
    Stack,
    Box,
    TextField,
    Backdrop,
    Modal,
    Fade,
    IconButton,
    Divider,
    Input
} from '@mui/material';
import Button from '@mui/material-next/Button';

import {
    AccountCircle,
    HttpsRounded,
    Close
} from '@mui/icons-material';

import {
    actionFullPassChange,
    actionFullLogout,
    actionFullUpdateProfile
} from "../../redux/thunks";

import { UpdateProfile } from "../../App";

import { EditProfile } from ".";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-52.5%, -52.5%)',
    width: 350,
    height: 'fit-content',
    bgcolor: 'background.paper',
    boxShadow: 24,
    outline: 0,
    borderRadius: 3,
    padding: '5px 0'
};



export default function ChangeData() {
    const { userId } = useParams()
    const dispatch = useDispatch()

    // отслеживание в полях ввода новые данные для пароля
    const [newPasswordData, setNewPasswordData] = useState({ login: '', oldPassword: '', newPassword: '' })

    // контекст обновления профиля
    const [updateProfile, setUpdateProfile] = useContext(UpdateProfile)

    // отслеживание нажатия кнопки редактирования профиля
    const [isEditProfile, setIsEditProfile] = useContext(EditProfile)

    // отслеживание данных в полях ввода логин и пароль
    const [loginNickData, setLOginNIckData] = useState({ login: updateProfile.login, nick: updateProfile.nick })

    // отслеживаем состояние открытия модального окна
    const [changePassword, setChangePassword] = useState(false)

    // отслеживаем, удачно изменился пароль или нет
    const [isSuccessChange, setIsSuccessChange] = useState(false)

    // отображение окна о том, удачно/нет завершилось обновление пароля
    const [alertSuccess, setAlertSuccess] = useState(true)

    // отслеживание валидации нового пароля
    const [isDataValid, setIsDataValid] = useState(false)
    // паттерн валидации
    const patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    useEffect(() => {
        setIsDataValid(patternPassword.test(newPasswordData.newPassword))
    }, [newPasswordData.newPassword])

    // открытие модального окна редактирвоания пароля
    function changePasswordOpen() {
        setChangePassword(true)
    }

    // закрытие модального окна редактирвоания пароля
    function changePasswordClose() {
        setChangePassword(false)
    }

    // отправка запроса на изменение пароля
    async function editNewPassword() {
        if (isDataValid) {
            // бекапим токен
            let backupToken = localStorage.getItem('authToken');

            // удаляем токен из локала
            localStorage.removeItem('authToken')

            // диспатчим смену пароля
            dispatch(actionFullPassChange(newPasswordData.login, newPasswordData.oldPassword, newPasswordData.newPassword))
                .then(result => {
                    if (result) {
                        // закрываем окно с полями ввода для нового пароля
                        setIsSuccessChange(true)

                        // открываем окно, что пошло все так
                        setAlertSuccess(true)
                    } else {
                        // записываем обратно в локал токен, чтобы не выбросило с акка
                        localStorage.setItem('authToken', backupToken)

                        // закрываем окно с полями ввода для нового пароля
                        setIsSuccessChange(true)

                        // открываем окно, что пошло что-то не так
                        setAlertSuccess(false)
                    }
                })
        }
    }

    // действие кнопки на окне удачного/неудачного изменения пароля (НЕудачно - снова открываем поля ввода пароля, удачно - выбрасываем из ака)
    function isSuccess() {
        if (!alertSuccess) {
            setIsSuccessChange(false)
        } else {
            dispatch(actionFullLogout())
        }
    }

    // запрос на полное изменение данных
    async function fullChangeData() {
        const newData = {
            ...updateProfile,
            ...loginNickData
        }

        // console.log('newData', newData)
        dispatch(actionFullUpdateProfile(newData, userId))

        setIsEditProfile(false)
    }

    // отмена внесения изменений
    function editCancell() {
        setIsEditProfile(false)
    }


    return (
        <React.Fragment>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '50px '
                }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-end'
                        }}>
                        <AccountCircle
                            sx={{
                                color: 'action.active',
                                mr: 1, my: 0.5
                            }}
                        />
                        <Input
                            placeholder="Новый логин"
                            value={loginNickData.login}
                            onChange={e => setLOginNIckData({ ...loginNickData, login: e.target.value })}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-end'
                        }}>
                        <AccountCircle
                            sx={{
                                color: 'action.active',
                                mr: 1, my: 0.5
                            }}
                        />
                        <Input
                            placeholder="Новый ник-нейм"
                            value={loginNickData.nick}
                            onChange={e => setLOginNIckData({ ...loginNickData, nick: e.target.value })}
                        />
                    </Box>
                </Stack>

                <Stack
                    sx={{
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                    }}
                    spacing={0.5}
                >
                    <Box
                        onClick={changePasswordOpen}
                        sx={{
                            width: 'fit-content'
                        }}
                    >
                        <Button
                            sx={{
                                padding: '5px 20px'
                            }}
                            size="small"
                            variant="text"
                        >
                            Редактировать пароль
                        </Button>
                    </Box>

                    <Box
                        onClick={fullChangeData}
                        sx={{
                            width: 'fit-content',
                            marginTop: '10px'
                        }}
                    >
                        <Button
                            size="small"
                            variant="filledTonal"
                            sx={{
                                maxWidth: '300px'
                            }}
                        >
                            Сохранить изменения
                        </Button>
                    </Box>

                    <Box
                        onClick={editCancell}
                        sx={{
                            width: 'fit-content'
                        }}
                    >
                        <Button
                            size="small"
                            variant="text"
                            sx={{
                                padding: '5px 20px'
                            }}
                        >
                            Отменить правки
                        </Button>
                    </Box>
                </Stack>
            </Box>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={changePassword}
                // onClose={changePasswordClose}
                closeAfterTransition
                slots={{
                    backdrop: Backdrop
                }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade
                    in={changePassword}
                >
                    <Box
                        sx={style}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                                padding: '0 24px'
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                color='text.primary'
                                gutterBottom
                            >
                                Редактирование пароля
                            </Typography>

                            {!isSuccessChange &&
                                <IconButton
                                    onClick={changePasswordClose}
                                    title='Закрыть'
                                >
                                    <Close
                                        sx={{
                                            position: 'absolute',
                                            color: 'black'
                                        }}
                                        fontSize='medium'
                                    />
                                </IconButton>}
                        </Stack>

                        <Divider />

                        {!isSuccessChange &&
                            <Box
                                sx={{
                                    margin: '8px 0 8px 8px',
                                    width: '95%',
                                    minHeight: 'fit-content',
                                    maxHeight: 350,
                                    overflowY: 'auto'
                                }}
                            >
                                <Stack
                                    direction="column"
                                    spacing={2}
                                    sx={{
                                        alignItems: 'center',
                                        paddingBottom: '5px'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            width: '90%'
                                        }}
                                    >
                                        <AccountCircle
                                            sx={{
                                                color: 'action.active',
                                                mr: 1, my: 0.5,
                                            }}
                                        />
                                        <TextField
                                            id="input-new-login"
                                            label="Логин"
                                            variant="standard"
                                            fullWidth
                                            value={newPasswordData.login}
                                            onChange={e => setNewPasswordData({ ...newPasswordData, login: e.target.value })}
                                            sx={{
                                                width: '100%'
                                            }}
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            width: '90%'
                                        }}
                                    >
                                        <HttpsRounded
                                            sx={{
                                                color: 'action.active',
                                                mr: 1, my: 0.5
                                            }}
                                        />
                                        <TextField
                                            id="input-new-login"
                                            label="Старый пароль"
                                            variant="standard"
                                            fullWidth
                                            value={newPasswordData.oldPassword}
                                            onChange={e => setNewPasswordData({ ...newPasswordData, oldPassword: e.target.value })}
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            width: '90%'
                                        }}
                                    >
                                        <HttpsRounded
                                            sx={{
                                                color: 'action.active',
                                                mr: 1, my: 0.5
                                            }}
                                        />
                                        <TextField
                                            error={!isDataValid}
                                            id="input-new-login"
                                            label="Новый пароль"
                                            variant="standard"
                                            fullWidth
                                            value={newPasswordData.newPassword}
                                            onChange={e => setNewPasswordData({ ...newPasswordData, newPassword: e.target.value })}
                                        />
                                    </Box>

                                    <Box
                                        onClick={editNewPassword}
                                    >
                                        <Button
                                            disabled={!isDataValid}
                                            size="small"
                                            variant="filledTonal"
                                            sx={{
                                                padding: '5px 20px'
                                            }}
                                        >
                                            Сохранить изменения
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>}

                        {isSuccessChange &&
                            <React.Fragment>
                                {alertSuccess &&
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            paddingBottom: '10px'
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            color='text.primary'
                                            align='center'
                                            sx={{
                                                margin: '25px auto',
                                                padding: '16px'
                                            }}
                                        >
                                            Данные успешно изменены. Повторите вход в аккаунт.
                                        </Typography>

                                        <Box
                                            onClick={isSuccess}
                                        >
                                            <Button
                                                sx={{
                                                    padding: '5px 20px',
                                                }}
                                                size="small"
                                                variant="filledTonal"
                                            >
                                                Авторизоваться
                                            </Button>
                                        </Box>

                                    </Box>}

                                {!alertSuccess &&
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            paddingBottom: '10px'
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            color='text.primary'
                                            align='center'
                                            sx={{
                                                margin: '25px auto',
                                                padding: '16px'
                                            }}
                                        >
                                            Вы ввели неправильные логин или пароль. Повторите попытку
                                        </Typography>

                                        <Box
                                            onClick={isSuccess}
                                        >
                                            <Button
                                                sx={{
                                                    padding: '5px 20px',
                                                }}
                                                size="small"
                                                variant="filledTonal"
                                            >
                                                Ок
                                            </Button>
                                        </Box>
                                    </Box>
                                }
                            </React.Fragment>
                        }
                    </Box>
                </Fade>
            </Modal>
        </React.Fragment >
    )
}
