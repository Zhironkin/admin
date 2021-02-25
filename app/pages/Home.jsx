var React = require('react');
import {Switch} from 'react-router';
import {mainRoutes, paths, pageNames} from '../pages/Routes.jsx';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {RouteWithSubRoutes} from '../components/RouteWithSubRoutes.jsx';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {

				};
    }
               
    render() {
        return(
					<div className="wrapper mvh-100 bg-light">
						<Header />

						<div className="container-fluid">
						  <div className="row">
						    <Sidebar items={pageNames} />

						    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
									<div className="py-3">
										<Switch>
											{mainRoutes.map((route, index) => <RouteWithSubRoutes key={index} {...route} />)}
										</Switch>
									</div>
						    </main>
						  </div>
						</div>
					</div>
				);
    }
}
 
export default Home;
