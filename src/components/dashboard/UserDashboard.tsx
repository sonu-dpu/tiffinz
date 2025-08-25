import { IUser } from '@/models/user.model'
import React from 'react'

function UserDashboard({user}:{user:IUser}) {
    return (
        <div>welcome {user.fullName}</div>
    )
}

export default UserDashboard