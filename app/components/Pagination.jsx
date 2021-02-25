var React = require('react');
import { Link } from 'react-router-dom';
import {Controller} from '../controllers/Controller.jsx';

class Pagination extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		};
	}

	// handelClick(page) {
	// 	console.log(page.target.getAttribute('page'));
	// }

	render() {
		var list = [];
		var page = this.props.page,
				limit = this.props.limit,
				sort = this.state.sort,
				sortDir = this.state.sortDir,
				cntRecords = this.props.cntRecords;

		var current = page * limit;
		var offset = 4;

		if(cntRecords <= limit) return '';
		if(limit == 0) return '';

		var total_pages = Math.ceil(cntRecords / limit);
		var prev = (current - limit) / limit;

		if(total_pages <= 1) return '';

		var pagePrev = (prev > 0) ? prev + 1 : 1;
		let li_prev = <li key={-pagePrev} className="page-item"><div page={pagePrev} onClick={(e) => { this.props.onClick(e) }} className="page-link">&laquo;</div></li>;
		// let li_prev = <li key={-pagePrev} className="page-item"><Link page={pagePrev} onClick={(e) => { this.props.onClick(e) }} className="page-link" to={`?page=${pagePrev}`}>&laquo;</Link></li>;
		list.push(li_prev)

		var counter = 1;
		var current_page = parseInt(Math.floor((current + limit) / limit));

		while(counter <= total_pages) {
			let li = '';
			let li_dot = '';
			if(counter == current_page) {
				// li = <li key={current_page} className="page-item active"><Link className="page-link" to={`?page=${counter}`}>{ counter }</Link></li>;
				li = <li key={current_page} className="page-item active"><div className="page-link">{ counter }</div></li>;
				list.push(li)
			} else if((counter > current_page - offset && counter < current_page + offset) || counter == 1 || counter == total_pages) {
				if(counter == total_pages && current_page < total_pages - offset) {
					li_dot = <li key={0.5} className="page-item"><div className="page-link">...</div></li>;
					list.push(li_dot)
				}

				// li = <li key={counter} className="page-item"><Link page={counter} onClick={(e) => { this.props.onClick(e) }} className="page-link" to={`?page=${counter}`}>{ counter }</Link></li>;
				li = <li key={counter} className="page-item"><div page={counter} onClick={(e) => { this.props.onClick(e) }} className="page-link">{ counter }</div></li>;
				list.push(li)

				if(counter == 1 && current_page > 1 + offset) {
					li_dot = <li key={-0.5} className="page-item"><a className="page-link">...</a></li>;
					list.push(li_dot)
				}
			}

			counter++;
		}

		var next = current + limit;
		var nextPage = (cntRecords > next) ? next/limit + 1 : total_pages;
		// let li_next = <li key={-nextPage} className="page-item"><Link page={nextPage} onClick={(e) => { this.props.onClick(e) }} className="page-link" to={`?page=${nextPage}`}>&raquo;</Link></li>;
		let li_next = <li key={-nextPage} className="page-item"><div page={nextPage} onClick={(e) => { this.props.onClick(e) }} className="page-link">&raquo;</div></li>;
		list.push(li_next)


		// name, page, cntRecords-всего записей, limit-кол-во записей на страницу

		return(
			<nav className={this.props.className}>
				<ul className="pagination justify-content-end">
					{list}
				</ul>
			</nav>
		);
	}
}
 
export default Pagination;
