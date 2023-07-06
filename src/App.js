import React, {
  createContext,
  useEffect,
  useState
} from 'react'

import {
  Provider,
  useSelector
} from 'react-redux';

import {
  Router,
  // HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import { store } from './redux/index';

import createHistory from "history/createBrowserHistory";

import './App.css';

import { CUser } from './components/user';
import { CFeed } from './components/feed';
import { CComments } from './components/post';
import { CreatePost } from './components/create_post';
import AuthReg from './components/auth_reg';
import { CHeader } from './components/structure/header';
import Footer from './components/structure/footer';
import Search from './components/search';
import Page404 from './components/404';

// url проекта
export const url = '/'

const history = createHistory()

// контексты модального окна для счетчиков и обновления профиля
export const ModalForCountsContext = createContext()
export const UpdateProfile = createContext()


const MyRoutes = () => {
  return (
    <Switch>
      <Route path="/" component={CFeed} exact />
      <Route path="/post/:postId" component={CComments} />
      <Route path="/user/:userId" component={CUser} />
      <Route path="/upsert/:postId" component={CreatePost} />
      <Route path='/search' component={Search} />
      <Route path="*" component={Page404} />
    </Switch>
  )
}


const MainRoutes = () => {
  const currentState = useSelector(state => state?.auth?.token)

  // функции управления открытием/закрытием модального окна
  const [modalName, setModalName] = useState('')
  const [modalArray, setModalArray] = useState(false)
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = (param) => {
    setOpenModal(true)

    // если массив = null, присваиваем ему пустой массив, иначе омодальное окно при клике не будет открываться
    if (!param.arr) param.arr = []

    param.arr && setModalArray([...param.arr]) // идет проверка на null, из-за баги на беке - на комментах отдается null?
    setModalName(param.name)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
    setModalArray(false)
  }


  // функция управления моими данными для обновления профиля
  const aboutMe = useSelector(state => state?.promise?.AboutMe?.payload)

  const [updateProfile, setUpdateProfile] = useState({
    _id: aboutMe?._id,
    login: aboutMe?.login,
    nick: aboutMe?.nick,
    avatar: { _id: aboutMe?.avatar?._id },
    following: (aboutMe?.following?.map(item => {
      return { _id: item._id }
    }))
  })

  // обновляем данные useState при обновлении aboutMe
  useEffect(() => {
    setUpdateProfile({
      _id: aboutMe?._id,
      login: aboutMe?.login,
      nick: aboutMe?.nick,
      avatar: { _id: aboutMe?.avatar?._id },
      following: (aboutMe?.following?.map(item => {
        return { _id: item._id };
      }))
    })
  }, [aboutMe])


  return (
    <main style={{ flexGrow: '1' }}>
      {currentState
        ? <UpdateProfile.Provider value={[updateProfile, setUpdateProfile]}>
          <ModalForCountsContext.Provider value={[modalName, setModalName, modalArray, setModalArray, openModal, setOpenModal, handleOpenModal, handleCloseModal]}>
            <MyRoutes />
          </ModalForCountsContext.Provider>
        </UpdateProfile.Provider>
        : <Switch>
          <Route path="/" component={AuthReg} exact />
          <Route path="/registration" component={AuthReg} />
          <Route path="*" component={Page404} />
        </Switch>
      }
    </main>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <div className="wrapper">
          <CHeader />
          <MainRoutes />
          <Footer />
        </div>
      </Router>
    </Provider>
  )
}