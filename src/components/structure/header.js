import { url } from '../../App';

import React, {
    useState,
    cloneElement
} from 'react';

import { connect, useDispatch, useSelector } from 'react-redux';

import { useHistory, useLocation } from 'react-router-dom';

import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Menu,
    Container,
    Avatar,
    Tooltip,
    MenuItem,
    IconButton,
    Stack,
    useScrollTrigger,
    TextField
} from '@mui/material'
import Button from '@mui/material-next/Button';

import {
    AddAPhotoRounded,
    SearchRounded,
    LogoutRounded,
    ManageAccountsRounded,
    TouchAppRounded
} from '@mui/icons-material';

import { styled } from '@mui/material/styles';

import {
    actionFullLogout,
    actionFullSearch
} from '../../redux/thunks';

// Стилизация иконки поиска
const StyledInputBase = styled(TextField)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(0),
        cursor: 'pointer',
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '7ch',
            '&:focus': {
                width: '15ch',
            },
        },
        [theme.breakpoints.down('xs')]: {
            width: 0,
            '&:focus': {
                width: '15ch',
            }
        },

    },
}))

// Тень на хедере при прокручивании
function ElevationScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}


function UserMenu({ user }) {
    const history = useHistory()
    const dispatch = useDispatch()

    // потому что запрос на логин не отдает аватар, а только id и login
    const userData = useSelector(state => state?.promise?.AboutMe?.payload)

    // открытие/закрытие меню на лого справа
    const [anchorElUser, setAnchorElUser] = useState(null)
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    }
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    }

    // Запрос на разлогин
    async function onLogout() {
        dispatch(actionFullLogout())
    }

    // ссылка на создание поста
    function toCreatepost() {
        history.push('/upsert/create')
    }

    // Запрос на переход на мой аккаунт
    function toMyAccount() {
        history.push(`/user/${user?.id}`)
    }


    return (
        <Box
            sx={{ flexGrow: 0 }}
        >
            <Tooltip
                title='Меню пользователя'
                placement="bottom-end"
            >
                <IconButton
                    onClick={handleOpenUserMenu}
                >
                    <Avatar
                        alt={user?.login}
                        src={url + userData?.avatar?.url}
                    />
                </IconButton>
            </Tooltip>

            <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                // keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                sx={{
                    mt: '45px'
                }}
            >
                <MenuItem
                    onClick={toMyAccount}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <ManageAccountsRounded
                            fontSize="small"
                        />
                        <Typography
                            textAlign="center"
                        >
                            <span>
                                {user?.login}
                            </span>
                        </Typography>
                    </Stack>
                </MenuItem>

                <MenuItem
                    onClick={toCreatepost}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <AddAPhotoRounded
                            fontSize="small"
                        />
                        <Typography
                            textAlign="center">
                            <span>
                                Добавить пост
                            </span>
                        </Typography>
                    </Stack>
                </MenuItem>

                <MenuItem
                    onClick={onLogout}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <LogoutRounded
                            fontSize="small"
                        />
                        <Typography
                            textAlign="center">
                            <span>
                                Выйти
                            </span>
                        </Typography>
                    </Stack>
                </MenuItem>
            </Menu>
        </Box>
    )
}

function Header({ login }) {
    const history = useHistory()
    const location = useLocation().pathname === ('/search')
    const dispatch = useDispatch()

    // отслеживание введенного текста в поиске
    const [searchText, setSearchText] = useState('')

    // отслеживаем, запустили поиск или нет
    const [searching, setSearching] = useState(false);

    // функция вызова поиска
    const onSearch = () => {
        if (searching) {
            return
        }

        setSearching(true)

        const newData = new RegExp(searchText.split(' ').join('|')).toString()

        dispatch(actionFullSearch(newData)).finally(() => {
            setSearching(false)
            setSearchText('')
        });

        history.push('/search')
    }

    function toMain() {
        history.push('/')
    }


    return (
        <React.Fragment>
            <ElevationScroll {...login}>
                <AppBar
                    color='inherit'
                    position='sticky'
                    sx={{
                        borderBottom: '1px solid #E8E8E8'
                    }}
                >
                    <Container
                        maxWidth="xl"
                    >
                        <Toolbar
                            disableGutters
                        >
                            <Stack
                                direction='row'
                                sx={{
                                    display: 'flex',
                                    flexGrow: '1'
                                }}
                            >
                                <Box
                                    className="cursor-pointer"
                                    onClick={toMain}
                                >
                                    <img
                                        src='./images/logo3.png'
                                        style={{ width: '28px' }}
                                    />
                                </Box>

                                <Typography
                                    variant="h6"
                                    noWrap
                                    sx={{
                                        mr: 2,
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                        marginLeft: '8px'
                                    }}
                                >
                                    Hipstagram
                                </Typography>
                            </Stack>

                            {login && !location &&
                                <Box
                                    sx={{
                                        position: 'relative',
                                        marginLeft: 0
                                    }}
                                >
                                    <Box
                                        sx={{
                                            padding: '0 16px',
                                            height: '100%',
                                            position: 'absolute',
                                            pointerEvents: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <SearchRounded />
                                    </Box>

                                    <StyledInputBase
                                        placeholder="Поиск..."
                                        className='search-field'
                                        id='searchField'
                                        variant="standard"
                                        value={searchText}
                                        onChange={e => setSearchText(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.code === 'Enter') {
                                                e.preventDefault()
                                                onSearch()
                                            }
                                        }}
                                        InputProps={{
                                            'disableUnderline': true,
                                            'aria-label': 'search',
                                            endAdornment:
                                                <Typography
                                                    className="cursor-pointer search-button"
                                                    variant='subtitle2'
                                                    align='right'
                                                    color='primary.main'
                                                    sx={{
                                                        alignSelf: 'center',
                                                        margin: '0 8px',
                                                        fontWeight: '700',
                                                    }}>
                                                    {searchText !== '' &&
                                                        <Box
                                                            onClick={onSearch}
                                                        >
                                                            <Button
                                                                className='header-search-button-standart'
                                                                startIcon={<TouchAppRounded />}
                                                                color="primary"
                                                                size="small"
                                                                variant="filledTonal"
                                                                sx={{
                                                                    padding: '5px 10px'
                                                                }}
                                                            >
                                                                Искать
                                                            </Button>

                                                            <Button
                                                                className='header-search-button-small'
                                                                startIcon={<TouchAppRounded />}
                                                                color="primary"
                                                                size="small"
                                                                variant="text"
                                                                sx={{
                                                                    padding: '2px'
                                                                }}
                                                            />
                                                        </Box>}
                                                </Typography>
                                        }}
                                    />
                                </Box>}

                            {login && <UserMenu user={login} />}
                        </Toolbar>
                    </Container>
                </AppBar>
            </ElevationScroll>
        </React.Fragment >
    )
}

export const CHeader = connect(state => ({ login: state?.auth?.payload?.sub }))(Header)
