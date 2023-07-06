import React from 'react';
import { useSelector } from "react-redux"

import {
    Typography,
    Box
} from '@mui/material';

import { RecommendedCard } from '../structure/modal';

import './style.scss'


// Блок с рекомендациями
function Recommended() {
    const myId = useSelector(state => state?.auth?.payload?.sub?.id)
    const followers = useSelector(state => state?.promise?.FindFollowers?.payload)
    const followings = useSelector(state => state?.promise?.FindFollowings?.payload)
    const myFollowings = useSelector(state => state?.promise?.AboutMe?.payload?.following)

    let recommendedList = []

    // собираем список подписок и подписчиков моих подписок и подписчиков и удаляем из него повторы и моих подписок
    if (followers && followings && myFollowings) {
        const joinArr = ([
            ...followers,
            ...followings.filter((item) =>
                !followers.some((current) => current._id === item._id)
            )
        ].filter((item) =>
            !myFollowings.some((current) => current._id === item._id)
        )).filter(currentItem => currentItem._id !== myId)


        // теперь оставляем в массиве только random рандомных элементов элементов
        const random = 20
        if (joinArr.length != 0) {
            for (let i = 0; i < random; i++) {
                const randomIndex = Math.floor(Math.random() * joinArr.length)
                recommendedList.push(joinArr[randomIndex])

                // удаляем элементы из массива, чтобы снова их не показывать
                joinArr.splice(randomIndex, 1)
            }
        }
    }


    return (
        <React.Fragment>
            {recommendedList?.length != 0 &&
                <Box
                    sx={{
                        marginTop: '10px'
                    }}
                >
                    <Box
                        sx={{
                            padding: '0 24px'
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            color='text.secondary'
                            gutterBottom
                        >
                            Рекомендации для Вас
                        </Typography>
                    </Box>

                    <Box
                        className='recommendedBox'
                        sx={{
                            margin: '8px',
                            width: '95%',
                            height: '400px',
                            overflowY: 'auto'
                        }}
                    >
                        {recommendedList?.map(item => <RecommendedCard key={item._id} data={item} />)}
                    </Box>
                </Box>}
        </React.Fragment>
    )
}

export default Recommended