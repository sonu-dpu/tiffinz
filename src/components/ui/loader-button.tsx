import React from 'react'
import { Button } from './button'

export default function LoaderButton({isLoading=false, fallbackText="", children}:{isLoading:boolean, fallbackText:string, children:React.ReactNode}) {
  return (
    <Button>{isLoading?fallbackText:children}</Button>
  )
}

