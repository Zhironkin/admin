var React = require('react');
var ReactDOM = require('react-dom');

import {BrowserRouter, Route} from 'react-router-dom';
import {Switch} from 'react-router';

import PrivateRoute from './components/PrivateRoute.jsx';
import AuthForm from './pages/AuthForm.jsx';
import Home from './pages/Home.jsx';
import {paths} from './pages/Routes.jsx';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/main.css';

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<Route exact path={paths.Login} component={AuthForm}/>
			<PrivateRoute path={paths.Home} component={Home}/>
		</Switch>
	</BrowserRouter>,
	document.getElementById("app")
);
