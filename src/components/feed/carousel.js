import { url } from '../../App'

import React from 'react'

import { Box } from '@mui/material'

import Carousel from 'react-material-ui-carousel'

import './style.scss'

// контейнер для карусели
function DynamicItem({ item }) {
    return (
        <Box
            className='slider-box-dynamic'
            sx={{
                width: '100%',
                height: '625px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000'
            }}
        >
            <img
                alt='image'
                src={item?.url && (url + item?.url)}
                style={{
                    objectFit: 'contain',
                    height: 'inherit',
                    width: '100%'
                }}
            />
        </Box >
    )
}

// контейнер для одной картинки
function StaticItem({ item }) {
    return (
        <Box
            className='slider-box-static'
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000'
            }}
        >
            <img
                alt='image'
                src={item?.url && (url + item?.url)}
                style={{
                    objectFit: 'contain',
                    height: '100%',
                    width: '100%',
                    // maxHeight: '625px',
                    // maxWidth: '550px',
                }}
            />
        </Box>
    )
}

export function MyCarousel({ images }) {
    return (
        <React.Fragment>
            {images?.length > 1
                ? <Carousel
                    sx={{
                        // marginBottom: '25px',
                        // overflow: 'inherit'
                    }}
                    autoPlay={false}
                    cycleNavigation={false}
                    animation={'slide'}
                    indicatorContainerProps={{
                        style: {
                            marginTop: '-50px',
                            zIndex: 999,
                            position: 'inherit'
                        }
                    }}
                >
                    {images &&
                        images?.map((item) => <DynamicItem
                            key={item?._id}
                            item={item}
                        />)
                    }
                </Carousel>
                : images &&
                images?.map((item) => <StaticItem
                    key={item?._id}
                    item={item}
                />)
            }
        </React.Fragment>
    )
}

