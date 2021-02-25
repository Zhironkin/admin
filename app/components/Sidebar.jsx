var React = require('react');
import { Link } from 'react-router-dom';
 
const location = window.location;

class Sidebar extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			items: this.props.items
		}
	}

	toggleItems(e) {
		e.target.parentNode.classList.toggle("open");
	}

	render() {
		return (
			<nav className="col-md-2 d-none d-md-block bg-light sidebar">
				<div className="sidebar-sticky">
					<ul className="nav flex-column">
						{
							this.state.items.map((item) => {
								let subItems = item.items ?
									(<ul className="sub-menu nav flex-column">{
										item.items.map((subItem) => {
											return <li className="nav-item"><Link
												className={location.pathname === subItem.path ? 'nav-link active' : 'nav-link'}
												to={subItem.path}>{subItem.name}</Link>
											</li>
										})}
									</ul>) : '';
								return <li
									className={item.items && item.items.filter((item) => location.pathname === item.path).length ? 'nav-item open' : 'nav-item'}
									onClick={(e) => this.toggleItems(e)}><Link
									className={location.pathname === item.path ? 'nav-link active' : 'nav-link'}
									to={item.path}>{item.name}</Link>
									{subItems}
								</li>
							})
						}
					</ul>
				</div>
			</nav>
		);
	}
}
 
export default Sidebar;
