# fullstack

# USER_ROUTER

## GET Запросы:

`/accounts/following` - Мои подписки <br/>
`/accounts/followers` - Мои подписчики <br/>
`/accounts/<user_name>` - Профиль <br/>
`/accounts/search?user_name=<user_name>` - Поиск по user_name <br/>
<br/>

## POST Запросы:
### Регистрация:
`/accounts/signup/`
<br/>
`{ 
    user_name: <user_name>,
    password: <password>,
}`
### Login:

`/accounts/login/`
<br/>
`{ 
    user_name: <user_name>,
    password: <password>,
}`
<br/>
### Изменить профиль
`accounts/update`
<br/>
`{
    name: <text>,
    description: <text>,
    avatar: <jpg image>
}
`
### Подписаться на кого либо
`/accounts/following/`
<br/>
`{
    follow: <user_name>
}`
<br/>
### Отписаться
`/accounts/delete_follow`
<br/>
`{
    following: <user_name>
}
`
<br/>
### Отписать от себя кого либо 
`/accounts/delete_follower`
<br/>
`{
    follower: <user_name>
}
`
<br/>
<br/>
<br/>
<br/>
# FEED ROUTER 

## GET

`/` - Лента
<br/>
`/:id` - Post Detail
<br/>
`/:id/delete` - Delete Post
<br/>
`/:id/like` - Поставить лайк
<br/>
`/:id/like_delete` - Удалить лайк
<br/>
`/:id/comment_delete` - Удалить коммент P.S. ТУТ ID КОММЕНТА, НЕ ПОСТА, А ИМЕННО id КОММЕНТА
<br/>
## POST

### Добавить InstaPost
`/` 
<br/>
`{description: <text>, image: <jpg image>}`

### Изменить InstaPost
`/:id/update/`
<br/>
`{description: <text>}`

### Добавить коммент
`/:id/comment/`
<br/>
`{body: <text>}`



npm run dev --> to start server

ctrl c --> to stop server

rs --> to restart

