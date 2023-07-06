// Функция формирования даты поста
export function createDate(date) {
    const dateOfPost = new Date(date)

    const months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря'
    ]

    return `${dateOfPost.getDate() < 10 ? '0' + dateOfPost.getDate() : dateOfPost.getDate()} ${months[dateOfPost.getMonth()]} ${dateOfPost.getFullYear()}  ${dateOfPost.getHours()}:${dateOfPost.getMinutes() < 10 ? '0' + dateOfPost.getMinutes() : dateOfPost.getMinutes()}`
}



// функция проверки пароля на валидность
