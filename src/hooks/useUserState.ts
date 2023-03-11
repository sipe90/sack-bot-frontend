import { selectedGuildState } from '@/state/guild'
import { userState } from '@/state/user'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

const useUserState = () => {

    const userInfoLoadable = useRecoilValueLoadable(userState)
    const selectedGuild = useRecoilValue(selectedGuildState)

    const userInfo = userInfoLoadable.valueMaybe() || null
    const loggedIn = userInfoLoadable.state === 'hasValue'
    const loginPending = userInfoLoadable.state === 'loading'
    const isAdmin = selectedGuild?.isAdmin || false

    return {
        userInfo,
        loggedIn,
        loginPending,
        isAdmin
    }
}

export default useUserState