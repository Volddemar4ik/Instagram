import { Typography } from "@mui/material"

import { Container } from "@mui/system"

function Footer() {
    return (
        <footer>
            <Container>
                <Typography
                    gutterBottom
                    textAlign='center'
                    sx={{
                        mt: 10,
                        color: 'inherit',
                    }}>
                    Created by @Volddemar4ik
                </Typography>
            </Container >
        </footer>
    )
}

export default Footer


