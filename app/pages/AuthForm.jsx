import React from 'react';
import Input from '../components/Input.jsx';
import ErrorText from '../components/ErrorText.jsx';
import Home from '../pages/Home.jsx';
import Loader from '../components/Loader.jsx';

import {Controller} from '../controllers/Controller.jsx';

class AuthForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			login: '',
			password: '',
			btnLoading: false,
			errorText: false,
			isLoad: true
		};

		Controller.isAuth()
			.then((result) => {
				if(result.data.success) {
					this.setState({isLoad: false});
					window.location = '/';
				}
			})
			.catch((e) => {
				this.setState({isLoad: false});
				console.log('error', e);
			});
	}

	onLoginChange(e) {
		var val = e.target.value;
		this.setState({ login: val });
	}

	onPassChange(e) {
		var val = e.target.value;
		this.setState({ password: val })
	}

	handleSubmit(e) {
		e.preventDefault();
		this.setState({btnLoading: true, errorText: false});

		Controller.checkAuth(this.state.login, this.state.password)
			.then((result) => {
				if(result.data.error) {
					this.setState({btnLoading: false, errorText: result.data.message});
				} else {
					sessionStorage.setItem('authToken', result.data.token);
					window.location = '/';
				}
			})
			.catch((e) => {
				this.setState({btnLoading: false, errorText: e.message});
			});
	}
               
  render() {
		if (this.state.isLoad)
			return <Loader />

		if (!this.state.isLoad)
			return <div className="wrapper vh-100 bg-light">
				<div className="container h-100 d-flex justify-content-center align-items-center">
					<div className="auth-container border border-dark rounded w-50">
						<div className="bg-dark p-2 text-center">
							<h2 className="my-0 text-white">Optimargin</h2>
							<p className="m-0 text-white">admin panel</p>
						</div>

						<form className="p-3">
							<Input className="form-control" classContainer="form-group" title="Login" type="text" placeholder="Login" value={this.state.login} onChange={(e) => this.onLoginChange(e)} />
							<Input className="form-control" classContainer="form-group" title="Password" type="password" placeholder="Password" value={this.state.password} onChange={(e) => this.onPassChange(e)} />
							{ this.state.errorText && <ErrorText text={this.state.errorText} />}

							<div className="d-flex justify-content-end">
								<button
									className="btn btn-dark w-25"
									onClick={(e) => this.handleSubmit(e)}
								>
									{ !this.state.btnLoading && 'Enter' }
									{ this.state.btnLoading && <img src="./images/load.gif" height="24" /> }
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
  }
}

export default AuthForm;
