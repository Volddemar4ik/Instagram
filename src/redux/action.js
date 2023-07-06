const url = '/graphql/'


// функция getGql
function getGql(endpoint) {
  return async function gql(query, variables = {}) {

    let headers = {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json',
    }
    if (('authToken' in localStorage)) {
      headers.Authorization = 'Bearer ' + localStorage.authToken
    }

    let result = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables
      })
    }).then(res => res.json())

    if (('errors' in result) && !('data' in result)) {
      throw new Error(JSON.stringify(result.errors))
    }

    result = Object.values(result.data)[0]

    return result
  }
}

const gql = getGql(url)

// акшоны для promiseReducer
export const actionPending = (type, nameOfPromise) => ({ nameOfPromise, type, status: 'PENDING' })
export const actionFulfilled = (type, nameOfPromise, payload) => ({ nameOfPromise, type: type, status: 'FULFILLED', payload })
export const actionRejected = (type, nameOfPromise, error) => ({ nameOfPromise, type: type, status: 'REJECTED', error })

export const actionPromise = (type, nameOfPromise, promise) =>
  async dispatch => {
    dispatch(actionPending(type, nameOfPromise)) //сигнализируем redux, что промис начался
    try {
      const payload = await promise //ожидаем промиса
      dispatch(actionFulfilled(type, nameOfPromise, payload)) //сигнализируем redux, что промис успешно выполнен
      return payload //в месте запуска store.dispatch с этим thunk можно так же получить результат промиса
    }
    catch (error) {
      dispatch(actionRejected(type, nameOfPromise, error)) //в случае ошибки - сигнализируем redux, что промис несложился
    }
  }

// ================================================================================================== 


// акшон логинизации
export const actionAuthLogin = token => ({ type: 'AUTH_LOGIN', token })


// акшон разлогинивания
export const actionAuthLogout = () => ({ type: 'AUTH_LOGOUT' })


// Запрос на регистрацию юзера
export const actionRegistration = (login, password) => actionPromise('PROMISE', 'Registration', gql(`mutation Registration($login:String!, $password:String!) {
   createUser(login:$login, password:$password) {
    _id login
  }
}`, {
  login,
  password
}))


// Запрос на логинизацию юзера
export const actionLogin = (login, password) => actionPromise('PROMISE', 'Login', gql(`query Login($login: String!, $password: String!) {
login(login: $login, password: $password)
}`, {
  login,
  password
}))


// Запрос на изменение пароля юзера
export const actionPassChange = (loginChange, passwordChange, passwordNew) => actionPromise('PROMISE', 'PassChange', gql(`mutation PasswordChange($loginChange: String!, $passwordChange: String!, $passwordNew: String!) {
  changePassword(
    login: $loginChange, password: $passwordChange, newPassword: $passwordNew
  ) {
       _id login

  }
}`, {
  loginChange,
  passwordChange,
  passwordNew
}))


// Запрос на поиск конкретного поста
export const actionFindPostOne = _id => actionPromise('PROMISE', 'PostFindOne', gql(`query OnePostFind ($postOne: String){
  PostFindOne (query: $postOne) {
    _id createdAt title text likesCount
    images {
      _id url
    }
    comments {
      _id createdAt text likesCount
      owner {
        _id login
        avatar {
          url
        }
      }
      answers {
        _id createdAt text likes {
          _id
        }
        likesCount owner {
          _id login nick  avatar {
            _id url
          }
        }
      }
    }
    owner {
      _id login nick avatar {
        _id url
      }
    }
    likes {
      _id owner{
        _id login avatar {
          _id url
        }
      }
    }
  }
}`, {
  postOne: JSON.stringify([{ _id }])
}))


// запрос на поиск конкретного юзера(folowwing - это те, на кого я подписан. followers - те, кто на меня подписан)
export const actionFindUserOne = (_id, promiseName = 'UserFindOne') => actionPromise('PROMISE', promiseName, gql(`query OneUserFind ($userOne: String) {
    UserFindOne(query: $userOne) {
      _id createdAt login nick 
      avatar {
        _id url
      } 
       followers {
        _id login avatar {_id url}
      }
      following {
         _id login avatar {_id url}
      }
    }
  }`, {
  userOne: JSON.stringify([{ _id }])
}))


// Запрос на поиск всех постов на беке (нигде не должен использоваться, но пусть будет)
export const actionfindPosts = () => actionPromise('PROMISE', 'PostsFind', gql(`query AllPostsFind ($allPosts: String){
  PostFind(query: $allPosts){
    _id createdAt title text likesCount
    images {
      url
    }
    owner {
      _id login nick
    }
    
  }
}`, {
  allPosts: JSON.stringify([{}])
}))


// Запрос на поиск ленты постов для юзера
export const actionFeedFindOne = (arr, sortOne, limitOne, promiseName = 'Feed', promiseType = 'FEED', skipOne = 0) => actionPromise(promiseType, promiseName, gql(`query FeedFindOne ($feedOne: String){
	PostFind(query: $feedOne){
            _id createdAt title text owner{
              _id login avatar{
                url
              }
            }
            comments {
              _id
            }
    images{
      _id url
    }
    likes{
      _id owner{
        _id login avatar{
          _id url
        }
      }
    }
    	}
    }`, {
  // вот тут прописал limit - количество постов, которые отображаются в ленте
  feedOne: JSON.stringify([{ ___owner: { $in: arr } }, { sort: [{ _id: sortOne }], limit: [limitOne], skip: [skipOne] }])
}))


// Запрос ленты с пропуском определенного количества постов/комментов (нигде больit не используется, можно будет кикать после проверки на фронте)
export const actionFeedFindOneSkip = (arr, sortOne, skipOne, limitOne, promiseName = 'Feed') => actionPromise('FEED', promiseName, gql(`query FeedFindOne ($feedOne: String){
	PostFind(query: $feedOne){
            _id createdAt title text likesCount owner{
              _id login avatar{
                url
              }
            }
            comments {
              _id
            }
    images{
      url
    }
    likes{
      _id owner{
        _id login
      }
    }
    	}
    }`, {
  // вот тут прописал limit - количество постов, которые отображаются в ленте
  feedOne: JSON.stringify([{ ___owner: { $in: arr } }, { sort: [{ _id: sortOne }], skip: [skipOne], limit: [limitOne] }])
}))


// Запрос на подсчет количества постов юзера
export const actionPostsCount = (id, promiseName) => actionPromise('PROMISE', promiseName, gql(`query PostsCount ($postsCount: String){
  PostCount(query: $postsCount)
}`, {
  postsCount: JSON.stringify([{ ___owner: id }])
}))


// Запрос на создание поста
export const actionCreatePost = params => actionPromise('PROMISE', 'CreatePost', gql(`mutation CreatePost($createNewPost: PostInput){
  PostUpsert(post: $createNewPost){
    _id
  }
}`, {
  createNewPost: params
}))


// запрос на создание комментария с последующим добавлением его к посту
export const actionAddComment = (NameOfPromise, params) => actionPromise('PROMISE', NameOfPromise, gql(`mutation AddComment($createComment: CommentInput){
  CommentUpsert(comment: $createComment){
    _id createdAt text
  }
}`, {
  createComment: params
}))


// запрос на поиск всех ответов, которые есть у данного комментария (нигде не используется, значит можно удалить после проверки на фронте)
export const actionFindCommentsAnswerTo = id => actionPromise('PROMISE', 'FindCommentsAnswerTo', gql(`query FindCommentAnswers2($answerTo: String) {
  CommentFind(query: $answerTo){
  _id createdAt text likesCount
    answers{
      _id
    }
    owner{
      _id login avatar{
        url
      }
    }
  }
}`, {
  answerTo: JSON.stringify([{ 'answerTo._id': id }])
}))


// запрос на поиск всех комментариев, которые есть у поста (парсим все, потом сортируем)
export const actionFindCommentsPostOne = id => actionPromise('PROMISE', 'FindComments', gql(`query FindCommentsToPost($commentsToPost: String) {
  CommentFind(query: $commentsToPost){
  _id createdAt text likesCount
    answerTo{
      _id
    }
    owner{
      _id login avatar{
        url
      }
    }
    likes {
      _id owner{
        _id login avatar{
          _id url
        }
      }
    }
  }
}`, {
  commentsToPost: JSON.stringify([{ 'post._id': id }, { sort: [{ _id: -1 }] }])
}))


// поиск всех подписчиков конкретных юзеров(бек фильтрует все дубли)
export const actionFindFollowers = arr => actionPromise('PROMISE', 'FindFollowers', gql(`query FindFollowers($findFollowers: String){
  UserFind(query: $findFollowers){
      _id login
      avatar{
        _id url
    }
  }
}`, {
  findFollowers: JSON.stringify([{ 'followers._id': { $in: arr } }])
}))


// поиск всех подписок конкретных юзеров(бек фильтрует все дубли)
export const actionFindFollowing = arr => actionPromise('PROMISE', 'FindFollowings', gql(` query FindFollowing($findFollowing: String){
  UserFind(query: $findFollowing){
      _id login
      avatar{
        _id url
    }
  }
}`, {
  findFollowing: JSON.stringify([{ 'following._id': { $in: arr } }])
}))


// добавление  лайка к посту/комментарию
export const actionAddLike = params => actionPromise('PROMISE', 'AddLike', gql(`mutation addLike($addLike: LikeInput){
  LikeUpsert(like: $addLike){
    _id
    post{
      _id title likes{
        _id 
      }
    }
    comment{
      _id likes{
        _id 
      }
      post{
        _id
      }
    }
    owner{
      _id 
    }
  }
}`, {
  addLike: params
}))


// удаление лайка с поста/комментария
export const actionDeleteLike = params => actionPromise('PROMISE', 'DeleteLike', gql(`mutation deleteLike($deleteLike: LikeInput){
  LikeDelete(like: $deleteLike){
    _id post{
      _id
    }
    comment{
      _id post{
        _id
      }
    }
  }
}`, {
  deleteLike: params
}))


//обновление профиля (установка аватара, ник-нейма, логина?, добавления/удаления подписчиков)
export const actionUpdateProfile = params => actionPromise('PROMISE', 'UpdateProfile', gql(`mutation setUser($updateProfile: UserInput){
    UserUpsert(user: $updateProfile){
        _id
    }
}`, {
  updateProfile: params
}))


// массив запросов на поиск на беке ===================================================================================

// запрос поиска по юзерам
export const actionSearchUser = (params, name) => actionPromise('SEARCH', name, gql(`query UserSearch($findUser: String){
  UserFind(query: $findUser){
      _id login nick avatar{
        _id url
      }
  }
}`, {
  findUser: JSON.stringify(params)
}))

// запрос поиска по постам
export const actionSearchPost = (params, name) => actionPromise('SEARCH', name, gql(`query PostSearch($findPost: String){
  PostFind(query: $findPost){
      _id title text owner{
        _id login nick avatar{
          _id url
        }
      }
  }
}`, {
  findPost: JSON.stringify(params)
}))

// запрос поиска по клмментам
export const actionSearchComment = (params, name) => actionPromise('SEARCH', name, gql(`query CommentSearch($findComment: String){
  CommentFind(query: $findComment){
      _id text
    post{
        _id
      }
    owner{
        _id login nick
      avatar{
          _id url
        }
      }
  }
}`, {
  findComment: JSON.stringify(params)
}))



// запрос на создание коллекцции
export const actionCreateCollection = params => actionPromise('COLLECTIONS', 'CreateCollection', gql(`mutation CreateCollection($createCollection: CollectionInput){
  CollectionUpsert(collection: $createCollection){
    _id text posts {
      _id
    }
    owner {
      _id login
    }
  }
}`, {
  createCollection: params
  // { text: "third collection", posts: [{ _id: "642959c340044d3f605c28c4" }, { _id: "6426f7cd40044d3f605c28a2" }, { _id: "6426f8a540044d3f605c28a7" }] }
}))


// запрос на поиск всех коллекций одного юзера
export const actionFindCollections = (id, sortOne) => actionPromise('COLLECTIONS', 'FindCollections', gql(`query FindCollections($findCollections: String){
  CollectionFind(query: $findCollections){
    _id text owner {
      _id login
    }
posts {
  _id images {
    _id url
  }
}
  }
}`, {
  findCollections: JSON.stringify([{ ___owner: id }, { sort: [{ _id: sortOne }] }])
}))


// запрос на поиск конкретной коллекции
export const actionFindCollectionOne = id => actionPromise('COLLECTIONS', 'FindCollectionOne', gql(`query FindCollectionOne($findCollectionOne: String){
  CollectionFindOne(query:$findCollectionOne){
    _id text owner {
      _id login
    }
posts {
  _id createdAt title text likesCount
    images {
      _id url
    }
    comments {
      _id createdAt text answers {
        _id createdAt text likes {
          _id
        }
        likesCount owner {
          _id login nick  avatar {
            _id url
          }
        }
      }
      likesCount
    }
    owner {
      _id login nick
    }
}
  }
}`, {
  findCollectionOne: JSON.stringify([{ _id: id }])
}))