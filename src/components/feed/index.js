import React, { useEffect } from 'react';

import {
    connect,
    useDispatch,
    useSelector
} from 'react-redux';

import {
    Box,
    Paper
} from '@mui/material';

import { styled } from '@mui/material/styles';
import { Container } from '@mui/system';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import {
    actionAboutMe,
    actionDownloadFeed
} from '../../redux/thunks';

import { CardFeed } from './card';
import { CAboutMe } from './aboutMe';
import Recommended from './recommended';

const Item = styled(Paper)(() => ({
    padding: '0 10px',
    marginBottom: 10,
    borderRadius: 0,
    boxShadow: 'none',
}))

function Feed({ feed, loadFeed }) {
    const dispatch = useDispatch()

    // функция отслеживания дна
    function handleScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            dispatch(actionDownloadFeed())
        }
    }

    // отслеживаем дозагрузку новых постов
    const newPosts = useSelector(state => state?.feed?.AddFeed?.payload)
    console.log('newPosts', newPosts)

    // когда пришли посты, делаем проверку на дубли и пушим в основную ленту
    if (newPosts) {
        newPosts.forEach((obj2) => {
            const obj1Exists = feed?.some((obj1) => obj1?._id === obj2?._id);
            if (!obj1Exists) {
                feed?.push(obj2);
            }
        });
    }

    // первая загрузка страницы и монтирование прослушки
    useEffect(() => {
        loadFeed()

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [])



    return (
        <Container
            sx={{
                width: '90%',
                mt: 1
            }}>
            <Box
                sx={{
                    flexGrow: 1
                }}>
                <Grid2
                    container
                    spacing={2}
                >
                    <Grid2 className='feed-box'
                        xs={7}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Item>
                            {feed && feed?.map(post => <Item key={post._id}><CardFeed postData={post} /></Item>)}
                        </Item>
                    </Grid2>

                    <Grid2 className='recommentation-box'
                        xs={5}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Item
                            sx={{
                                position: 'fixed',
                                width: '450px'
                            }}
                        >
                            <CAboutMe />

                            <Recommended />
                        </Item>
                    </Grid2>
                </Grid2>
            </Box>
        </Container>
    )
}

export const CFeed = connect(state => ({ feed: state.feed?.MyFeed?.payload }), { loadFeed: actionAboutMe })(Feed)





