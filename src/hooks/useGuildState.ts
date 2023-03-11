import { guildMembersState, guildsState, selectedGuildIdState, selectedGuildMembershipState, selectedGuildState } from '@/state/guild'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

const useGuildState = () => {
    const guilds = useRecoilValue(guildsState)
    const selectedGuild = useRecoilValue(selectedGuildState)
    const [selectedGuildId, setSelectedGuildId] = useRecoilState(selectedGuildIdState)
    const selectedGuildMembership = useRecoilValue(selectedGuildMembershipState)
    const guildMembers = useRecoilValue(guildMembersState)

    useEffect(() => {
        if (guilds.length && selectedGuildId === null) {
            setSelectedGuildId(guilds[0].id)
        }
    }, [guilds, selectedGuildId, setSelectedGuildId])

    return {
        guilds,
        selectedGuild,
        selectedGuildId,
        selectedGuildMembership,
        setSelectedGuildId,
        guildMembers
    }
}

export default useGuildState
