// import { url } from "../App"


import {
    actionPromise,
    actionLogin,
    actionAuthLogin,
    actionRegistration,
    actionAuthLogout,
    actionFindUserOne,
    actionPostsCount,
    actionFeedFindOne,
    actionCreatePost,
    actionFindPostOne,
    actionFindCommentsPostOne,
    actionAddComment,
    actionFindFollowers,
    actionFindFollowing,
    actionAddLike,
    actionDeleteLike,
    actionUpdateProfile,
    actionSearchUser,
    actionSearchPost,
    actionSearchComment,
    actionPassChange,
    actionCreateCollection,
    actionFindCollections,
    actionFindCollectionOne
} from "./action"

const url = '/graphql/'


// Логин и последующая логинизация в authReduser
export const actionFullLogin = (login, password) =>
    async dispatch => {
        localStorage.clear()

        const token = await dispatch(actionLogin(login, password))

        if (token !== null) {
            if (typeof (token) === 'string') {
                dispatch(actionAuthLogin(token))
                localStorage.authToken = token
            }
        }

        return token
    }


// Регистрация и последующая логинизация
export const actionFullRegistration = (login, password) =>
    async dispatch => {
        const token = await dispatch(actionRegistration(login, password))

        if (token !== null) {
            dispatch(actionFullLogin(login, password))
        }

        return token
    }



// Разлогин и последующая полна очистка localStorage
export const actionFullLogout = () =>
    async dispatch => {
        const res = await dispatch(actionAuthLogout())

        if (res) localStorage.clear()

        return res
    }


// запрос на изменение пароля
export const actionFullPassChange = (login, oldPass, newPass) =>
    async dispatch => {
        const result = await dispatch(actionPassChange(login, oldPass, newPass))

        return result
    }


// Запрос юзера (данные о пользователе + количество его постов + все его посты(100 шт - лимит))
export const actionFullUserFindOne = _id =>
    dispatch => {
        const requestsAboutUser = [
            actionFindUserOne(_id, 'UserFindOne'),
            actionPostsCount(_id, 'UserPostsCount'),
            actionFeedFindOne([_id], -1, 22, 'UserFeed'),
            actionFeedFindOne([], -1, 15, 'AddUserFeed')
        ]

        return Promise.all(requestsAboutUser?.map(item => dispatch(item)))
    }


// Запрос AboutMe для главной
export const actionAboutMe = () =>
    async (dispatch, getState) => {
        const myId = getState()?.auth?.payload?.sub?.id

        // диспатчим запрос AboutMe (о себе)
        await dispatch(actionFindUserOne(myId, 'AboutMe'))
            .then(myData => {
                // собираем список id моих подписок
                let followingList = []
                if (myData?.following) {
                    followingList = myData?.following?.map(user => user?._id)
                }

                // собираем id моих подписок и подписчиков
                const podpisotaList = []
                for (const key in myData) {
                    if (key === 'following' || key === 'followers') {
                        if (myData[key]) {
                            for (const item of myData[key]) {
                                if (!podpisotaList.includes(item._id)) {
                                    podpisotaList.push(item._id)
                                }
                            }
                        }
                    }
                }

                // шлем все запросы на меня одновременно, только после выполнения dispatch(actionFindUserOne(myId, 'AboutMe'))
                const requestsAboutMe = [
                    actionPostsCount(myId, 'MyPostsCount'),
                    actionFeedFindOne(followingList, -1, 10, 'MyFeed'),
                    actionFindFollowers(podpisotaList),
                    actionFindFollowing(podpisotaList)
                ]

                return Promise.all(requestsAboutMe?.map(item => dispatch(item)))
            })
    }


// Запрос на догрузку ленты моих постов
export const actionDownloadFeed = () =>
    async (dispatch, getState) => {
        const followingList = (getState()?.promise?.AboutMe?.payload?.following)?.map(user => user?._id)

        const myFeed = (getState()?.feed?.MyFeed?.payload)

        const result = await dispatch(actionFeedFindOne(followingList, -1, 10, 'AddFeed', myFeed?.length))

        return result
    }


// Запрос на догрузку ленты постов юзера
export const actionDownloadUserFeed = () =>
    async (dispatch, getState) => {
        const userId = getState()?.promise?.UserFindOne?.payload?._id

        const userFeed = (getState()?.feed?.UserFeed?.payload)

        const result = await dispatch(actionFeedFindOne([userId], -1, 15, 'AddUserFeed', userFeed?.length))

        return result
    }


// запрос на загрузку картинок на бек
function fileUpload(file) {
    const formData = new FormData()
    formData.append('photo', file)

    return (
        fetch((url + 'upload'), {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.authToken
            },
            body: formData
        }).then(res => res.json())
    )
}

function filesUpload(files) {
    // console.log('files', files)

    // if (files.length > 1) {
    return Promise.all(files?.map(fileUpload))
    // } else {
    //     return Promise(fileUpload(files))
    // }
}

export const actionFilesUpload = files => actionPromise('PROMISE', 'FilesUpload',
    filesUpload(files)
)


// запрос на создание поста и последующий переход на него
export const actionFullCreatePost = (params) =>
    async dispatch => {
        const newPost = await dispatch(actionCreatePost(params))

        if (newPost) {
            dispatch(actionFindPostOne(newPost._id))
        }

        return newPost
    }


// Загрузка всех комментариев к посту с последующей их сортировкой и построением дерева комментариве
export const actionFullFindCommentsPostOne = id =>
    async dispatch => {
        const comments = await dispatch(actionFindCommentsPostOne(id))

        return comments
    }


// создание комментария с последующей загрузкой с бека списка всех постов, которые относятся к этой записи
export const actionFullAddComment = (nameOfPromise, params, id) =>
    async dispatch => {
        const newComment = await dispatch(actionAddComment(nameOfPromise, params))

        if (typeof newComment._id === 'string') {
            dispatch(actionFullFindCommentsPostOne(id))
        }

        return newComment
    }


// создание лайка с последующим добавлением к определенной сущности и последующим обновление определенной сущности
export const actionFullAddLike = params =>
    async dispatch => {
        const res = await dispatch(actionAddLike(params))

        // обновляем данные поста с бека, если лайк был для поста
        if (res?.post) {
            dispatch(actionFindPostOne(res?.post?._id))
            dispatch(actionAboutMe())
        }

        // обновляем данные с бека, если лайк был для комментария
        if (res?.comment) {
            dispatch(actionFullFindCommentsPostOne(res?.comment?.post?._id))
        }

        return res
    }


// удаление лайка с последующим обновлением определенной сущности
export const actionFullDeleteLike = params =>
    async dispatch => {
        const res = await dispatch(actionDeleteLike(params))

        // обновляем данные поста с бека, если лайк был для поста
        if (res?.post) {
            dispatch(actionFindPostOne(res.post._id))
            dispatch(actionAboutMe())
        }

        // обновляем данные с бека, если лайк был для комментария
        if (res?.comment) {
            dispatch(actionFullFindCommentsPostOne(res?.comment?.post?._id))
        }

        return res
    }


// запрос на обновление моего профиля и последующая отправка запроса обо мне на бек
export const actionFullUpdateProfile = (params, id) =>
    async dispatch => {
        const res = await dispatch(actionUpdateProfile(params))

        if (res._id) {
            dispatch(actionAboutMe())
        }

        // нужно, чтоб обновлялась инфа на моем профиле, если он открыт как обычный юзер
        if (res._id === id) {
            dispatch(actionFullUserFindOne(id))
        }

        return res
    }


// запрос на подписку/отписку на странице пользователя
export const actionUserPageSubscribing = (params, id) =>
    async dispatch => {
        const res = await dispatch(actionUpdateProfile(params))

        if (res._id) {
            dispatch(actionAboutMe())
            dispatch(actionFullUserFindOne(id))
        }

        return res
    }


// запрос на поиск элементов
export const actionFullSearch = param =>
    async dispatch => {
        const searchPromises = [
            actionSearchUser([{ login: param }], 'userLogin'),
            actionSearchUser([{ nick: param }], 'userNick'),
            actionSearchPost([{ title: param }], 'postTitle'),
            actionSearchPost([{ text: param }], 'postText'),
            actionSearchComment([{ text: param }], 'commetText'),
        ]

        // запускаем все акшоны
        const result = await Promise.all(searchPromises?.map(item => dispatch(item)))

        return result
    }


// запрос на поиск всех коллекций конкретного пользователя
export const actionFullFindCollections = id =>
    async dispatch => {
        const result = await dispatch(actionFindCollections(id, -1))

        return result
    }


// запрос на поиск конкретной коллекции
export const actionFullFinCollectionOne = id =>
    async dispatch => {
        const result = await dispatch(actionFindCollectionOne(id))

        return result
    }


// запрос на создание коллекции
export const actionFullCreateCollection = params =>
    async dispatch => {
        const result = await dispatch(actionCreateCollection(params))

        return result
    }