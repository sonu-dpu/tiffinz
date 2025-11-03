import { IUser } from '@/models/user.model'
import React from 'react'
import OrderMeal from './orders/OrderMeal'
import MealsContainer from './meals/MealsContainer'

function UserDashboard({user}:{user:IUser}) {
    return (
      <>
        <div>welcome {user.fullName}</div>
        <OrderMeal/>
        <MealsContainer></MealsContainer>
      </>
    )
}

export default UserDashboard