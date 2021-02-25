var React = require('react');
import {Link} from 'react-router-dom';
import Switch from "./Switch.jsx";
import Icon from "./Icon.jsx";
import LoaderMini from './LoaderMini.jsx';
import {Controller} from '../controllers/Controller.jsx';

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.SignOut = this.SignOut.bind(this);

    

    this.state = {

    }

  }

  SignOut() {
    sessionStorage.removeItem('authToken');
  }


  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <Link className="navbar-brand col-sm-3 col-md-2 mr-0" to="/">Optimargin</Link>
       
       
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap">
              <Link className="nav-link" to="/login" onClick={this.SignOut}>Sign out</Link>
            </li>
          </ul>
        </nav>

        
      </React.Fragment>
    );
  }
}

export default Header;
