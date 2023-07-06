import { url } from "../../App"

import React, { useContext } from 'react';

import { useSelector, connect } from 'react-redux'

import { useHistory } from 'react-router-dom'

import {
    Avatar,
    Typography,
    Stack,
    CardHeader,
} from '@mui/material'

import ModalWindow from '../structure/modal';

import { ModalForCountsContext } from "../../App";

import './style.scss'


function AboutMe({ aboutMe = {} }) {
    let history = useHistory()

    const myPostsCount = useSelector(state => state?.promise?.MyPostsCount?.payload)

    // контекст модального окна
    const [modalName, setModalName, modalArray, setModalArray, openModal, setOpenModal, handleOpenModal, handleCloseModal] = useContext(ModalForCountsContext)

    function myFollower() {
        handleOpenModal({ arr: aboutMe?.followers, name: 'Ваши подписчики' })
    }

    function myFollowings() {
        handleOpenModal({ arr: aboutMe?.following, name: 'Ваши подписки' })
    }

    function toMyAccount() {
        history.push(`/user/${aboutMe?._id}`)
    }


    return (
        <React.Fragment>
            <CardHeader
                avatar={
                    <Avatar
                        sx={{
                            width: 50,
                            height: 50
                        }}
                        alt={aboutMe?.login}
                        src={url + aboutMe?.avatar?.url}
                    />
                }

                title={
                    <Typography
                        className='cursor-pointer'
                        variant='h6'
                        onClick={toMyAccount}
                    >
                        {aboutMe?.login}
                    </Typography>
                }

                subheader={
                    <Typography
                        variant='subtitle1'
                        color='text.secondary'
                    >
                        {aboutMe?.nick}
                    </Typography>
                }
            />

            <Stack
                direction="row"
                spacing={1}
                padding={2}
                sx={{
                    paddingTop: 0,
                }}
            >
                <Typography
                    className='cursor-pointer'
                    variant='body2'
                    onClick={toMyAccount}
                >
                    {myPostsCount || '0'} публикаций
                </Typography>

                <Typography
                    className='cursor-pointer'
                    variant='body2'
                    onClick={myFollower}
                >
                    {aboutMe?.followers?.length || '0'} подписчиков
                </Typography>

                <Typography
                    className='cursor-pointer'
                    variant='body2'
                    onClick={myFollowings}
                >
                    {aboutMe?.following?.length || '0'} подписок
                </Typography>
            </Stack>

            {modalArray && <ModalWindow />}
        </React.Fragment>
    )
}

export const CAboutMe = connect(state => ({ aboutMe: state?.promise?.AboutMe?.payload }))(AboutMe)