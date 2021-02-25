var React = require('react');
import {Controller} from '../controllers/Controller.jsx';
import Table from '../components/Table.jsx';
import Input from '../components/Input.jsx';
import LoaderMini from '../components/LoaderMini.jsx';

import { Link } from 'react-router-dom';

import JSONFormatter from 'json-formatter-js'
import moment from 'moment'

class Dynamic extends React.Component {
	markup (val) {
		return { __html: val }
	}

	render () {
		return <div dangerouslySetInnerHTML={{__html: this.props.html}} />;
	}
}

class Page4 extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			data: [],
			users: [],
			loaderMini: true,
			desc: false,

			page: 0,
			limit: 100,
			filter: {
				type: ['3','4']
			},
			showMore: true,
			checkboxChecked: {
				types: {
					1: false,
					2: false,
					3: true,
					4: true,
				}
			}
		};
	}

	componentDidMount() {
		Controller.getList('https://api.optimargin.com/users/list')
			.then((result) => {
				if(result.data.success) {
					this.setState({ users: result.data.data });
				}
			})
			.catch((e) => {
				console.log('error', e);
			});

		let query = Object.assign({}, this.state.filter, {offset: this.state.page * this.state.limit, limit: this.state.limit})
		Controller.getLogsList('https://api.optimargin.com/logs', query)
			.then((result) => {
				if(result.data.success) {
					this.setState({loaderMini: false, data: result.data.data});
				}
			})
			.catch((e) => {
				this.setState({loaderMini: false});
				console.log('error', e);
			});
	}

	textModal(desc) {
		let formatter = new JSONFormatter(JSON.parse(desc));
		this.setState({ desc: formatter.render().outerHTML });
	}

	showMore(needClear) {
		if(needClear) {
			this.state.page = 0
		} else {
			this.state.page = this.state.page + 1;
			this.state.loaderMini = true;
		}

		let query = Object.assign({}, this.state.filter, {offset: this.state.page * this.state.limit, limit: this.state.limit})
		Controller.getLogsList('https://api.optimargin.com/logs', query)
			.then((result) => {
				if(result.data.success) {
					let data = this.state.data;
					if(!needClear) {
						result.data.data.forEach(function(itm) {
							data.push(itm);
						});
					} else {
						data = result.data.data;
					}

					if(result.data.data.length > 0)
						this.setState({loaderMini: false, data: data });
					else
						this.setState({loaderMini: false, data: data, showMore: false });
				}
			})
			.catch((e) => {
				this.setState({loaderMini: false});
				console.log('error', e);
			});
	}

	filterList(param, value, checked) {
		this.setState({loaderMini: true});

		if (param == 'type') {
			let {checkboxChecked} = this.state;
			if (checkboxChecked.types[value] != undefined)
				checkboxChecked.types[value] = !checkboxChecked.types[value];
			else checkboxChecked.types[value] = checked;
			this.setState({checkboxChecked});
		}

		if (!checked && typeof (this.state.filter[param]) == 'object' && this.state.filter[param].indexOf(value) > -1) {
			this.state.filter[param].splice(this.state.filter[param].indexOf(value), 1);
		} else {
			if (param == 'type') {
				if (typeof (this.state.filter.type) != 'object') {
					this.state.filter.type = [];
				}

				this.state.filter.type.push(value);
			} else {
				this.state.filter.user_id = value;
			}
		}

		this.showMore(true);
	}

	render() {
		return(
			<div className="position-relative h-100">
				{ this.state.loaderMini && <LoaderMini /> }

	      <h2 className="pb-3">Logs</h2>
				<div className="d-flex justify-content-between align-items-center mb-5">
					<div className="d-flex justify-content-start align-items-center info-log">
						<Input className="custom-control-input" classLabel="custom-control-label w-100 normal" classContainer="custom-control custom-checkbox mr-sm-4 p-0" id='check-N' type="checkbox" title="Normal" value="1" defaultChecked={this.state.checkboxChecked.types[1]} onChange={(event) => this.filterList('type', event.target.value, event.target.checked)} />
						<Input className="custom-control-input" classLabel="custom-control-label w-100 warning" classContainer="custom-control custom-checkbox mr-sm-4 p-0" id='check-W' type="checkbox" title="Warning" value="2" defaultChecked={this.state.checkboxChecked.types[2]} onChange={(event) => this.filterList('type',event.target.value, event.target.checked)} />
						<Input className="custom-control-input" classLabel="custom-control-label w-100 important" classContainer="custom-control custom-checkbox mr-sm-4 p-0" id='check-I' type="checkbox" title="Important" value="3" defaultChecked={this.state.checkboxChecked.types[3]} onChange={(event) => this.filterList('type',event.target.value, event.target.checked)} />
						<Input className="custom-control-input" classLabel="custom-control-label w-100 error" classContainer="custom-control custom-checkbox mr-sm-4 p-0" id='check-E' type="checkbox" title="Error" value="4" defaultChecked={this.state.checkboxChecked.types[4]} onChange={(event) => this.filterList('type',event.target.value, event.target.checked)} />
					</div>

					<select className="form-control filter-select" onChange={(event) => this.filterList('user_id',event.target.value, true)}>
						<option key={0} value={''}>All</option>
						{
							this.state.users.map((item, idx) => {
								return (
									<option key={ item._id } value={ item._id }>{ item.appid }</option>
								)
							})
						}
					</select>
				</div>

				<div className="mh-200">
					{
						(this.state.data.length > 0) && (
							this.state.data.map((item, idx) => {
								let fullDate = moment.unix(Math.round(item.time/1000)).format("MM/DD/YYYY LT");

								let classStyle = '';
								if (item.code == 1) classStyle = 'secondary';
								else if (item.code == 2) classStyle = 'warning';
								else if (item.code == 3) classStyle = 'success';
								else if (item.code == 4) classStyle = 'danger';

								return (
									<div key={ item._id } className="d-flex justify-content-start align-items-start mb-2 log-item" data-toggle="modal" data-target="#modal-log" onClick={ () => this.textModal(item.details) }>
										<div className="text-success mr-5">{ fullDate }</div>
										<div className={ 'text-' + classStyle }>{ item.error }</div>
									</div>
								)
							})
						)
					}

					{	(this.state.data.length == 0) && <div>No results found</div>	}
				</div>

				{ this.state.showMore &&
					<button className="btn btn-warning w-100 mt-3" onClick={ () => this.showMore() }>More</button>
				}

				<div id="modal-log" className="modal fade bd-example-modal-lg">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-body overflow-auto">
								<Dynamic html={ this.state.desc } />
							</div>

							<div className="modal-footer">
								<button type="button" id="cancel" className="btn btn-outline-dark" data-dismiss="modal">Cancel</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
 
export default Page4;
