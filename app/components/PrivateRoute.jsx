import React from 'react'
import Home from '../pages/Home.jsx';
import Loader from '../components/Loader.jsx';
import { Redirect, Route } from 'react-router-dom'
import {paths} from '../pages/Routes.jsx';

import {Controller} from '../controllers/Controller.jsx';

class PrivateRoute extends React.Component {

 constructor(props) {
		super(props);

		this.state = {
			succesLogin: false,
			isLoad: true
		};

		Controller.isAuth()
			.then((result) => {
				this.setState({ succesLogin: result.data.success, isLoad: false });
			})
			.catch((e) => {
				this.setState({isLoad: false });
			});
	};

	render() {
		let { succesLogin } = this.state
		let { isLoad } = this.state

		if (isLoad)
			return <Loader />

		if (!succesLogin && !isLoad)
			return <Redirect to={paths.Login} />

		return <Home />
	}
}

export default PrivateRoute
