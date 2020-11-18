
import React from 'react'
import {useAuth0} from '@auth0/auth0-react'

function AuthZeroLogin() {
    const {
        isLoading,
        isAuthenticated,
        error,
        user,
        loginWithRedirect,
        logout,
      } = useAuth0();
    console.log(useAuth0()); 
    //return <button onClick = {()=>loginWithRedirect()}>Log In</button>
    if (isLoading) {
        return <div>Loading...</div>;
      }
      if (error) {
          console.log(error);
        return <div>Oops... {error.message}</div>;
      }
    
      if (isAuthenticated) {
        return (
          <div>
            Hello {user.name}{' '}
            <button onClick={() => logout({ returnTo: window.location.origin })}>
              Log out
            </button>
          </div>
        );
      } else {
        return <button onClick={loginWithRedirect}>Log in</button>;
      }
}
export default AuthZeroLogin;