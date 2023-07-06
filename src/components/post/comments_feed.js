import React, { useEffect } from "react";

import { connect, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import { actionFullFindCommentsPostOne } from "../../redux/thunks";

import CommentCard from "./comments_feed_card";

import './style.scss';


function CommentsFeed({ comments = [], loadComments }) {
    const { postId } = useParams()

    const addNewComment = useSelector(state => state?.promise?.CreateComment?.payload)

    const addNewCommentTo = useSelector(state => state?.promise?.CreateCommentTo?.payload)

    // перезагрузка ленты комментариев на посте, если только зашли на сраницу или отправили новый коммент
    useEffect(() => {
        loadComments(postId)
    }, [postId, addNewComment, addNewCommentTo])

    // функция построения дерева комментариев
    function commentsTreeConstructor(arr, answerToId = null) {
        const result = []

        for (const commentItem of arr) {
            if (commentItem.answerTo && commentItem.answerTo._id === answerToId) {
                commentItem.answers = commentsTreeConstructor(arr, commentItem._id)
                result.push(commentItem)
            }

            if (!commentItem.answerTo && !answerToId) {
                commentItem.answers = commentsTreeConstructor(arr, commentItem._id)
                result.push(commentItem)
            }
        }

        // сортируем от новых к старым
        return result.sort((x, y) => y.createdAt - x.createdAt)
    }

    const data = commentsTreeConstructor(comments)


    return (
        <React.Fragment>
            {data && data?.map(item => <CommentCard
                data={item}
                key={item._id}
            />
            )}
        </React.Fragment>
    )
}

const CCommentsFeed = connect(state => ({ comments: state?.promise?.FindComments?.payload }), { loadComments: actionFullFindCommentsPostOne })(CommentsFeed)

export default CCommentsFeed