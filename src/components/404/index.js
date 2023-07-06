import { useHistory } from 'react-router-dom'

import {
    Typography,
    Box
} from '@mui/material'

import './style.scss'

function Page404() {
    const history = useHistory()

    function toMain() {
        history.push('/')
    }

    return (
        <Box className='container-404'>
            <Typography
                variant="h6"
                color='text.primary'
                align='center'
                gutterBottom
            >
                К сожалению, эта страница недоступна.
            </Typography>

            <Typography
                variant="subtitle1"
                color='text.primary'
                align='center'
                gutterBottom
            >
                Возможно, вы воспользовались недействительной ссылкой или страница была удалена.
            </Typography>

            <Typography
                className='cursor-pointer'
                variant="subtitle1"
                color='text.primary'
                align='center'
                gutterBottom
                onClick={toMain}
            >
                Назад в Instagram.
            </Typography>
        </Box>
    )
}

export default Page404