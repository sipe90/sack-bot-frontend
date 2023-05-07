import { userState } from '@/state/user'
import { useRecoilValueLoadable } from 'recoil'

const useLoginState = () => {

    const userInfoLoadable = useRecoilValueLoadable(userState)

    const loggedIn = userInfoLoadable.state === 'hasValue'
    const loginPending = userInfoLoadable.state === 'loading'

    return {
        loggedIn,
        loginPending,
    }
}

export default useLoginState