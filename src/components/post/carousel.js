import { url } from '../../App';

import React from 'react';

import Carousel from 'react-material-ui-carousel'
import { Box } from '@mui/system';

// карусель
export function MyCarouselPost({ postImages }) {
    // console.log('postImages: ', postImages)

    return (
        <React.Fragment>
            {postImages?.length > 1
                ? <Carousel
                    autoPlay={false}
                    cycleNavigation={false}
                    animation={"slide"}
                    indicatorContainerProps={{
                        style: {
                            marginTop: '-50px',
                            zIndex: 999,
                            position: 'inherit'
                        }
                    }}
                    className='myCarousel'
                    sx={{
                        width: '100%',
                        height: '100%'
                    }}
                >
                    {postImages &&
                        postImages?.map(item =>
                            <Box
                                className='carousel-box'
                                key={item?.url}
                            >
                                <img src={url + item.url} />
                            </Box>
                        )}
                </Carousel>
                : postImages &&
                postImages?.map(item =>
                    <Box
                        className='carousel-box'
                        key={item?.url}
                    >
                        <img src={url + item.url} />
                    </Box>
                )}
        </React.Fragment>
    )
}

