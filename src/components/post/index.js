import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { useParams } from 'react-router-dom';

import { Box, Paper } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import { styled } from '@mui/material/styles';

import { actionFindPostOne } from '../../redux/action';

import { MyCarouselPost } from './carousel';
import { CardPost } from './comments';

const Item = styled(Paper)(() => ({
    borderRadius: 0,
    boxShadow: 'none',
}))


export function Comments({ post = {}, loadPost }) {
    const { postId } = useParams()
    useEffect(() => { loadPost(postId) }, [postId])
    // console.log('post: ', post)

    return (
        <React.Fragment>
            <Grid2
                className='post-container'
                container
                sx={{
                    height: '80vh',
                }}
            >
                <Grid2
                    className='post-container-carousel'
                    xs={7.5}
                >
                    <Item
                        sx={{
                            backgroundColor: "black",
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <MyCarouselPost
                            postImages={post?.images}
                        />
                    </Item>
                </Grid2>

                <Grid2
                    className='post-container-comments'
                    xs={4.5}
                >
                    <Item >
                        <Box
                            style={{
                                backgroundColor: "yellow"
                            }}
                        >
                            <CardPost
                                postData={post}
                            />
                        </Box>
                    </Item>
                </Grid2>
            </Grid2>
        </React.Fragment>
    )
}

export const CComments = connect(state => ({ post: state?.promise?.PostFindOne?.payload }), { loadPost: actionFindPostOne })(Comments)

