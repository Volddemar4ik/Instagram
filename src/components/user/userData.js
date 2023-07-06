import { url } from "../../App"

import React, {
    useContext,
    useState,
    useEffect
} from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useHistory, useParams } from 'react-router-dom';

import {
    CardContent,
    Typography,
    Stack,
    Avatar,
    Box,
    Container,
    IconButton
} from '@mui/material';
import Button from '@mui/material-next/Button';

import {
    PersonRemoveRounded,
    PersonAddRounded,
    ManageAccountsRounded,
    ImageSearchRounded
} from '@mui/icons-material';

import {
    actionUserPageSubscribing,
    actionFilesUpload
} from "../../redux/thunks";

import { ModalForCountsContext, UpdateProfile } from "../../App";

import { EditProfile } from ".";

import ModalWindow from '../structure/modal';

import ChangeData from "./change_data";

// Функция отображения кнопки редактирования своего профиля/отписки или подписки на другого юзера
function UptadeProfileButton({ data }) {
    const history = useHistory()
    const { userId } = useParams()
    const dispatch = useDispatch()

    // контекст обновления профиля
    const [updateProfile, setUpdateProfile] = useContext(UpdateProfile)

    // отслеживание нажатия кнопки редактирования профиля
    const [isEditProfile, setIsEditProfile] = useContext(EditProfile)


    // определяем мой id
    const myId = updateProfile?._id

    // определяем всех моих подписчиков
    const myFollowingList = updateProfile?.following?.map(user => user?._id)

    // проверка, является ли пользователь моим подписчиком
    const isFollowing = myFollowingList && (myFollowingList)?.some(item => item === (data?.owner?._id || data?._id))

    // функция подписки/отписки - это чисто кнопка
    function isSubscribing() {
        // при клике на посте
        const newData = {
            ...updateProfile, following: (isFollowing
                ? updateProfile?.following?.filter(item => item?._id !== (data?.owner?._id || data?._id)) // отписка
                : updateProfile?.following
                    ? [...updateProfile?.following, { _id: (data?.owner?._id || data?._id) }] // подписка, если уже есть кто-то в подписках
                    : [{ _id: (data?.owner?._id || data?._id) }] // подписка, если это первая подписка
            )
        }

        dispatch(actionUserPageSubscribing(newData, userId))
    }

    // функция перехода на редактирование профиля
    function upsertProfile() {
        setIsEditProfile(true)
    }


    return (
        <Box
            className='user-data-actions-button'
            onClick={
                (userId === myId && upsertProfile) ||
                (myFollowingList?.includes(userId) && isSubscribing) ||
                ((userId !== myId && !myFollowingList?.includes(userId)) && isSubscribing)}
        >
            <Button
                size="small"
                variant={
                    ((userId === myId) && 'elevated') ||
                    ((myFollowingList?.includes(userId)) && 'elevated') ||
                    ((userId !== myId && !myFollowingList?.includes(userId)) && 'filledTonal')
                }
                startIcon={
                    ((userId === myId) && <ManageAccountsRounded />) ||
                    ((myFollowingList?.includes(userId)) && <PersonRemoveRounded />) ||
                    ((userId !== myId && !myFollowingList?.includes(userId)) && <PersonAddRounded />)
                }
                disableRipple
                sx={{
                    minWidth: '250px'
                }}
            >
                <Typography
                    variant='button'
                    display='block'
                >
                    {(userId === myId) && 'Редактировать аккаунт' ||
                        (myFollowingList?.includes(userId)) && 'Отписаться' ||
                        (userId !== myId && !myFollowingList?.includes(userId)) && 'Подписаться'
                    }
                </Typography>
            </Button>
        </Box>
    )
}

// блок пользовательских данных
export default function BasicCard({ userData }) {
    const dispatch = useDispatch()

    // определяем количество постов пользоваеля
    const userPostsCount = useSelector(state => state?.promise?.UserPostsCount?.payload)

    // контекст обновления профиля
    const [updateProfile, setUpdateProfile] = useContext(UpdateProfile)

    // отслеживание нажатия кнопки редактирования профиля
    const [isEditProfile, setIsEditProfile] = useContext(EditProfile)

    // контекст модального окна
    const [modalName, setModalName, modalArray, setModalArray, openModal, setOpenModal, handleOpenModal, handleCloseModal] = useContext(ModalForCountsContext)

    // отслеживание статуса изменения пароля
    const [changePassword, setChangePassword] = useState(false)

    // отслеживаем добавление файлов
    const [selectedFile, setSelectedFile] = useState(null)

    // установка урла аватара
    const [userAvatarUrl, setUserAvatarUrl] = useState(url + userData?.avatar?.url);


    // функция загрузки файлов с компа
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        // setSelectedFile(file);
        if (!Array.isArray(file)) {
            const arr = []
            arr.push(file)
            setSelectedFile(arr);
        } else {
            setSelectedFile(file)
        }



    }

    // отправляем все на бек когда добавили картинки с компа
    useEffect(() => {
        if (selectedFile) {
            dispatch(actionFilesUpload(selectedFile)).then((res) => {
                // ставим на аватар после загрузки
                const newAvatarUrl = url + res[0]?.url;
                // console.log('newUrl', res)
                setUserAvatarUrl(newAvatarUrl)

                setUpdateProfile({ ...updateProfile, avatar: { _id: res[0]?._id } })
            })
        }
    }, [selectedFile])

    // меняем аватарку, если переходим между пользователями или отменяем изменения
    useEffect(() => {
        setUserAvatarUrl(url + userData?.avatar?.url)
    }, [userData, isEditProfile])

    // открытие поля редактирвоания пароля
    // function changePasswordButton() {
    //     setChangePassword(true)
    // }

    // открытие модального окна с подписчиками
    function userFollowers() {
        handleOpenModal({
            arr: userData?.followers, name: `Подписчики ${userData?.login}`
        })
    }

    // открытие модального окна с подписками
    function userFollowing() {
        handleOpenModal({
            arr: userData?.following, name: `Подписки ${userData?.login}`
        })
    }


    return (
        <Container
            className='user-data-box'
            sx={{
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    display: 'inline-block'
                }}
            >
                <Avatar
                    alt={userData?.login}
                    src={userAvatarUrl}
                    sx={{
                        width: 130,
                        height: 130
                    }}
                />
                {isEditProfile &&
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1,
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                zIndex: -1,
                                borderRadius: '50%',
                            }
                        }}
                    >
                        <IconButton
                            color="primary"
                            aria-label="upload avatar"
                            component="label"
                        >
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                className='getphoto'
                                onChange={handleFileSelect}
                            />

                            <ImageSearchRounded
                                sx={{
                                    color: '#FFF',
                                    fontSize: '40px'
                                }}
                            />
                        </IconButton>
                    </Box>}
            </Box>

            {!isEditProfile &&
                <Box className='user-data-cart' >
                    <CardContent
                        sx={{
                            flex: '1 0 auto'
                        }}
                    >
                        <Stack
                            className="user-data-container"
                            direction="row"
                            spacing={2}
                        >
                            <Typography
                                component="div"
                                variant="h4"
                            >
                                {userData?.login}
                            </Typography>

                            <UptadeProfileButton
                                data={userData}
                            />
                        </Stack>

                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                        >
                            {userData?.nick || ''}
                        </Typography>
                    </CardContent>

                    <Stack
                        direction="row"
                        spacing={5}
                        padding={2}
                        paddingTop={1}
                    >
                        <Typography
                            variant="subtitle1"
                        >
                            {userPostsCount || '0'} публикаций
                        </Typography>

                        <Typography
                            className="cursor-pointer"
                            variant="subtitle1"
                            onClick={userFollowers}
                        >
                            {userData?.followers?.length || '0'} подписчиков
                        </Typography>

                        <Typography
                            className="cursor-pointer"
                            variant="subtitle1"
                            onClick={userFollowing}
                        >
                            {userData?.following?.length || '0'} подписок
                        </Typography>
                    </Stack>
                </Box>}

            {isEditProfile && <ChangeData />}

            {modalArray && <ModalWindow />}
        </Container>
    )
}