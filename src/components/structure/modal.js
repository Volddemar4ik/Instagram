import { url } from "../../App"

import React, { useContext } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useHistory, useLocation, useParams } from "react-router-dom";

import {
    Typography,
    Box,
    Stack,
    Backdrop,
    Modal,
    Fade,
    Divider,
    IconButton,
    Avatar,
    CardHeader
} from '@mui/material'
import Button from '@mui/material-next/Button';

import { Close } from '@mui/icons-material'

import {
    ModalForCountsContext,
    UpdateProfile
} from "../../App";

import { actionFullUpdateProfile } from "../../redux/thunks";

import './style.scss'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 'fit-content',
    bgcolor: 'background.paper',
    boxShadow: 24,
    outline: 0,
    borderRadius: 3,
    padding: '5px 0'
};



// Компонент карточка юзера с кнопкой подписки/отписки (нужно делать всегда двойную проверку data.owner.id || data.id (идет вызов модалки на комменте || посте), потому что у нас разные сущности на лайках и на подписчиках)
export function RecommendedCard({ data }) {
    const history = useHistory()
    const dispatch = useDispatch()

    // контекст обновления профиля
    const [updateProfile, setUpdateProfile] = useContext(UpdateProfile)

    // контекст модального окна
    const [modalName, setModalName, modalArray, setModalArray, openModal, setOpenModal, handleOpenModal, handleCloseModal] = useContext(ModalForCountsContext)

    // проверка, является ли пользователь моим подписчиком
    const myData = useSelector(state => state?.promise?.AboutMe?.payload)
    const isFollowing = myData?.following && (myData?.following).some(item => item._id === (data?.owner?._id || data?._id))

    // проверка текущего id страницы
    const currentId = useLocation().pathname.split('/')[useLocation().pathname.split('/').length - 1]

    // мой id
    const myid = myData?._id

    // функция подписки/отписки
    function isSubscribing() {
        // при клике на посте
        const newData = {
            ...updateProfile, following: (isFollowing
                ? updateProfile.following.filter(item => item._id !== (data?.owner?._id || data?._id)) // отписка
                : [...updateProfile.following, { _id: (data?.owner?._id || data?._id) }] // подписка
            )
        }

        dispatch(actionFullUpdateProfile(newData, currentId))
    }

    // переход на аккаунт
    function toAccount() {
        history.push(data?.owner?._id ? `/user/${data?.owner?._id}` : `/user/${data?._id}`)
        setModalArray(false)
    }


    return (
        <CardHeader
            avatar={
                <Avatar
                    src={url + (data?.owner?.avatar?.url || data?.avatar?.url)}
                    aria-label="recipe"
                    sx={{
                        width: 36,
                        height: 36
                    }}
                />
            }
            title={
                <Typography
                    className="cursor-pointer"
                    variant="subtitle2"
                    color='text.secondary'
                    onClick={toAccount}
                    sx={{
                        width: 'fit-content',
                        maxWidth: '155px',
                        whiteSpace: 'nowrap', // запрещает перенос текста на новую строку
                        overflowX: 'hidden', // скрывает текст, который выходит за пределы контейнера
                        textOverflow: 'ellipsis' // троеточие при выходе за пределы контейнера
                    }}
                >
                    {data?.owner?.login || data?.login || 'anon user'}
                </Typography >
            }
            action={//сначала проверка на меня - если не я, рисуем кнопку
                ((myData?.following && (data?.owner?._id || data?._id) != myid)) &&
                <Box
                    onClick={isSubscribing}
                >
                    <Button
                        variant={isFollowing
                            ? "elevated"
                            : "filledTonal"}
                        size="small"
                        sx={{
                            minWidth: '140px',
                            padding: '5px 10px'
                        }}
                    >
                        {(isFollowing
                            ? 'Отписаться'
                            : 'Подписаться')}
                    </Button>
                </ Box>
            }
        />
    )
}


function ModalWindow() {
    // контекст модального окна
    const [modalName, setModalName, modalArray, setModalArray, openModal, setOpenModal, handleOpenModal, handleCloseModal] = useContext(ModalForCountsContext)

    return (
        <React.Fragment>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }
                }
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade
                    in={openModal}
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
                                {modalName}
                            </Typography>

                            <IconButton
                                title='Закрыть'
                                onClick={handleCloseModal}
                            >
                                <Close
                                    fontSize='medium'
                                    sx={{
                                        position: 'absolute',
                                        color: 'black'
                                    }}
                                />
                            </IconButton>
                        </Stack>

                        <Divider />

                        <Box
                            className='recommendedBox'
                            sx={{
                                margin: '8px 0 8px 8px',
                                width: '95%',
                                minHeight: 'fit-content',
                                maxHeight: 350,
                                overflowY: 'auto',
                                overflowX: 'hidden'
                            }}
                        >
                            {modalArray.length != 0
                                ? modalArray?.map(item => <RecommendedCard
                                    key={item._id}
                                    data={item}
                                />)
                                : <Typography
                                    variant="subtitle1"
                                    align='center'
                                    color='text.secondary'
                                    gutterBottom
                                >
                                    Пока-что здесь никого нет...
                                </Typography>}
                        </Box>
                    </Box>
                </Fade>
            </Modal >
        </React.Fragment>
    )
}

export default ModalWindow