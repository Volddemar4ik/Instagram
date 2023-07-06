import { Box } from "@mui/material"
import { MyCarouselPost } from "../post/carousel"

export default function CollectionPost({ postData }) {
    // console.log('postData: ', postData)

    return (
        <Box>
            {postData?.title}
            {postData?.text}
            <MyCarouselPost postImages={postData?.images} />
        </Box>
    )
}