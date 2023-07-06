import { url } from '../../App';

import { useSelector } from 'react-redux';

import { Box } from '@mui/material';

import Carousel from 'react-material-ui-carousel'

import { Comments } from '../post';

import CollectionPost from './collections_card_post';


export default function ModalCarousel() {

    // отслеживаем изменения в карусели
    const collection = useSelector(state => state?.collection?.FindCollectionOne?.payload)
    // console.log('collection: ', collection)



    return (
        <Carousel
            autoPlay={false}
            cycleNavigation={false}
            animation={"slide"}
            indicatorContainerProps={{
                style: {
                    marginTop: '-100px',
                    zIndex: 999,
                    position: 'inherit'
                }
            }}
            className='myCarousel'
            sx={{
                width: '100%',
                height: '90%'
            }}
        >
            {collection &&
                collection?.posts?.map(item =>
                    <Box
                        className='carousel-box'
                        key={item?._id}
                        sx={{
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '80%'
                            }}
                        >
                            <CollectionPost postData={item} />
                        </Box>
                    </Box>
                )}
        </Carousel>
    )
}