import { userState } from '@/state/user'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useRecoilValueLoadable } from 'recoil'

const ProtectedRoute: React.FC = () => {
    const navigate = useNavigate()
    const userInfoLoadable = useRecoilValueLoadable(userState)

    const loggedIn = userInfoLoadable.state === 'hasValue'
    const loginPending = userInfoLoadable.state === 'loading'

    useEffect(() => {
        if (!loginPending && !loggedIn) {
            navigate('/login')
        }
    }, [loggedIn, loginPending, navigate])

    if (!loggedIn) return null

    return <Outlet />
}

export default ProtectedRoute
