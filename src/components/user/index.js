import React, { createContext, useEffect, useState } from 'react';

import { connect } from 'react-redux';

import { useParams } from 'react-router-dom';

import {
    Box,
    Divider
} from '@mui/material';

import { actionFullUserFindOne } from '../../redux/thunks';

import BasicCard from './userData';
import { СStandardImageList } from './gallery';
import Collections from './collections';

import './style.scss'

export const EditProfile = createContext()


function User({ user = {}, loadUser }) {
    const { userId } = useParams()
    useEffect(() => { loadUser(userId) }, [userId])

    const [isEditProfile, setIsEditProfile] = useState(false)

    return (
        <EditProfile.Provider value={[isEditProfile, setIsEditProfile]}>
            <Box
                className='user-container'
                sx={{
                    // margin: "20px 50px"
                }}
            >
                <BasicCard
                    userData={user}
                />
            </Box>

            <Divider />

            <Collections userData={userId} />

            <React.Fragment>
                <СStandardImageList />
            </React.Fragment>
        </EditProfile.Provider >
    );
}

export const CUser = connect(state => ({ user: state?.promise?.UserFindOne?.payload }), { loadUser: actionFullUserFindOne })(User)





















// export const CUser = connect(state => ({ user: state?.promise?.UserFindOne?.payload }), { loadUser: actionFullUserFindOne })(User)

// export const CUser = connect(state => ({ user: state?.promise }), { loadUser: actionFullUserFindOne })(User)