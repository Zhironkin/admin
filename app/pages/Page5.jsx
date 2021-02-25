var React = require('react');
import {Controller} from '../controllers/Controller.jsx';
import Table from '../components/Table.jsx';
import Input from '../components/Input.jsx';
import LoaderMini from '../components/LoaderMini.jsx';

import { Link } from 'react-router-dom';

const location = window.location;

class Page5 extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			loaderMini: true,
		};

		Controller.getLogUser('https://api.optimargin.com/logs/' + location.search.split('=')[1])
			.then((result) => {
				if(result.data.success) {
					this.setState({loaderMini: false});
					console.log('>>>>', result);
				}
			})
			.catch((e) => {
				this.setState({loaderMini: false});
				console.log('error', e);
			});
	}

	componentDidMount() {

	}


	render() {
			return(
				<div className="position-relative h-100">
					{ this.state.loaderMini && <LoaderMini /> }

					<h2 className="pb-3">Log user</h2>
					<div className="info-log mh-200"></div>
				</div>
			);
		}
}
 
export default Page5;
