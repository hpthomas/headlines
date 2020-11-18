import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
//import logo from './logo.svg';
import './App.css';
import TopBar from './TopBar';
import { Auth0Provider } from "@auth0/auth0-react";

class App extends React.Component {
	render() {
		console.log('render app')
		return (
			<Auth0Provider
				domain="bsnews.us.auth0.com"
				clientId="fBYlQtS90FAD3OqTgoAvSHHh4ihRqxLC"
				audience="https://bottomshelfnews.com"
				scope="read:current_user update:current_user_metadata"
				redirectUri={window.location.origin}
			>

				<Router>
					<TopBar/>
				</Router>

			</Auth0Provider>
		);
	}
}
export default App;
