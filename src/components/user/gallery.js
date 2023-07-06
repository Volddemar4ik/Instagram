import { url } from '../../App';

import React, { useContext, useEffect, useState } from 'react';

import { connect, useDispatch, useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';

import { Box } from '@mui/system';
import {
    ImageList,
    ImageListItem,
} from '@mui/material';

import {
    AutoAwesomeMotionRounded,
    BorderColorRounded
} from '@mui/icons-material';

import { actionDownloadUserFeed } from '../../redux/thunks';

import { EditProfile } from '.';


export default function StandardImageList({ images }) {
    const history = useHistory()
    const dispatch = useDispatch()

    // отслеживание старых постов
    const [currentPosts, setCurrentPosts] = useState(images)

    // без useEffect не срабатывает изменение аватара при переходе между профилями
    useEffect(() => {
        setCurrentPosts(images)
    }, [images])

    // отслеживание нажатия кнопки редактирования профиля
    const [isEditProfile, setIsEditProfile] = useContext(EditProfile)

    // функция отслеживания дна
    function handleScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            dispatch(actionDownloadUserFeed())
        }
    };

    // отслеживаем дозагрузку новых постов
    const newPosts = useSelector(state => state?.feed?.AddUserFeed?.payload)

    // когда пришли посты, делаем проверку на дубли и пушим в основную ленту
    if (newPosts) {
        newPosts.forEach((obj2) => {
            const obj1Exists = currentPosts?.some((obj1) => obj1?._id === obj2?._id);
            if (!obj1Exists) {
                currentPosts?.push(obj2);
            }
        });
    }

    // первая загрузка страницы и монтирование/размонтирование прослушки
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [])


    // стиль иконки на посте
    const iconStyle = {
        color: '#e8def8',
        position: 'absolute',
        right: '10px',
        top: '10px',
        fontSize: '32px'
    }

    // переход на пост при клике на его картинку
    function toPost(id) {
        if (isEditProfile) {
            history.push(`/upsert/${id}`)
        } else {
            history.push(`/post/${id}`)
        }

        setIsEditProfile(false)
    }


    return (currentPosts &&
        <ImageList
            cols={3}
            rowHeight={'auto'}
            sx={{
                width: "100%",
                minHeight: "100%"
            }}
        >
            {currentPosts?.map(item => (
                <ImageListItem
                    key={item?._id}
                >
                    {/* иконка галереи на посте в ленте */}
                    {(isEditProfile &&
                        <BorderColorRounded
                            sx={iconStyle}
                        />) ||
                        (item?.images?.length > 1) &&
                        <AutoAwesomeMotionRounded
                            sx={iconStyle}
                        />}

                    {/* пост в ленте */}
                    <Box
                        className="cursor-pointer"
                        onClick={() => {
                            toPost(item._id)
                        }}
                        sx={{
                            width: '100%',
                            paddingTop: '100%',
                            backgroundSize: 'cover',
                            backgroundColor: 'black',
                            backgroundImage: `url(/images/noPhoto.png)`,
                            backgroundRepeat: 'no-repeat',
                        }}
                        style={item?.images && (
                            item?.images[0]?.url &&
                            { backgroundImage: `url(${url + item?.images[0]?.url})` }
                        )}
                    />
                </ImageListItem>
            ))
            }
        </ImageList >
    )
}

export const СStandardImageList = connect(state => ({ images: state?.feed?.UserFeed?.payload }))(StandardImageList)