import { selectedGuildState } from '@/state/guild'
import { userState } from '@/state/user'
import { useRecoilValue } from 'recoil'

const useUserState = () => {
    const userInfo = useRecoilValue(userState)
    const selectedGuild = useRecoilValue(selectedGuildState)

    const isAdmin = selectedGuild?.isAdmin || false

    return {
        userInfo,
        isAdmin
    }
}

export default useUserState