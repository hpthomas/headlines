import React from 'react'
import {useAuth0} from '@auth0/auth0-react'

function AuthZeroLogout() {
  const {isAuthenticated, logout} = useAuth0();
  if (isAuthenticated) {
    return (
      <button onClick={()=>logout({returnTo: window.location.origin})}>Log Out</button>
    );
  }
}
export default AuthZeroLogout;