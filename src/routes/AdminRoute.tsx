import React from 'react'

import Admin from '@/components/Admin'
import useUserState from '@/hooks/useUserState'
import NotFound from '@/components/NotFound'

const AdminRoute: React.FC = () => {
    const { isAdmin } = useUserState()

    return isAdmin ? <Admin /> : <NotFound />
}

export default AdminRoute
