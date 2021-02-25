var React = require('react');
import {Controller} from '../controllers/Controller.jsx';
import LoaderMini from '../components/LoaderMini.jsx';
import Pagination from '../components/Pagination.jsx';
import Input from '../components/Input.jsx';
import Icon from '../components/Icon.jsx';

import SweetAlert from 'sweetalert2-react';

import moment from 'moment'
 
class Table extends React.Component{
              
	constructor(props){
		super(props);

		this.filds_properties = {};

		this.state = {
			idTable: (this.props.id) ? this.props.id : '',
			data: [],
			fields: this.props.fields,
			filters: {},
			filtersColumn: this.props.filtersColumn,
			loaderMini: true,
			cntRecords: false,
			page: parseInt(this.props.page),
			limit: parseInt(this.props.limit),
			sort: 'id',
			sortDir: 'asc',
			showSwal: false,
			userId: false,
      showTargets: {}
		}
		this.moreShow = false;

		this.props.fields.forEach((field) => {
			this.filds_properties[field.name] = field;
		})

		this.props.source(this.props.url, this.state.page, this.state.limit)
			.then((result) => {
				// console.log('>>res<<', result);
				this.setState({data: result.data.data, cntRecords: result.data.found, loaderMini: false})
			})
			.catch((e) => {
				console.log('error', e);
			});


		var $this = this;
	}

	handelClick(e) {
		this.setState({loaderMini: true})

		var currentPage = parseInt(e.target.getAttribute('page')) - 1;
		this.props.source(this.props.url, currentPage, this.state.limit, this.getFilters())
			.then((result) => {
				this.setState({data: result.data.data, loaderMini: false, page: currentPage})
			})
			.catch((e) => {
				console.log('error', e);
			});
	}

  reload() {
    this.props.source(this.props.url, this.state.page, this.state.limit, this.getFilters())
			.then((result) => {
				this.setState({data: result.data.data, cntRecords: result.data.found, loaderMini: false})
			})
			.catch((e) => {
				console.log('error', e);
			});
  }

  getFilters() {
		var filters = {};
		for (var i in this.state.filters) {
			if (this.state.filters[i] !== '' ) {
				filters[i] = this.state.filters[i];
			}
		}
		return filters;
	}

	setFilter(name, value) {
		let {filters} = this.state;
		filters.filters[name] = value;
		this.setState({filters, page: 0})
		this.reload();
	}

	componentDidMount() {
	}

	getAll(selector) {
	 return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
	}

	titleCLick(sort) {
		this.props.source(this.props.url, this.state.page, this.state.limit)
			.then((result) => {
				this.setState({data: result.data.data, loaderMini: false, page: this.state.page})
			})
			.catch((e) => {
				console.log('error', e);
			});
	}

	returnData(e, item) {
		var txt = e.target.innerText;
		this.state.fields.forEach((itm) => {
			if(itm.name == e.target.attributes.getNamedItem('data-key').value) {
				if(itm.handler)
					return itm.handler(txt, item)
				else {
					if(this.props.rowClick)
						this.props.rowClick(item)
				}
			}
		});
	}

	filterBlock(item) {

		var filter = this.state.filtersColumn[item.name];
		if (filter === undefined) {
			return <td className="filter-td"></td>;
		}

		switch (filter.type) {
			case "select":
				return <td className="filter-td">{this.renderSelect(filter)}</td>;
			case "text":
				return <td className="filter-td">{this.renderText(filter)}</td>;
			default:
				console.error("Not set render for ", filter.type);
				return <td className="filter-td"></td>;
		}
	}

	renderSelect(filter) {
		var select = <select className="form-control form-control-sm" name={filter.name} onChange={(e) => {
			if (filter.setFilter != undefined) {
				filter.setFilter(this, filter, e.target.value)
			} else if (filter.beforeSet !== undefined) {
				this.setFilter(filter.name, filter.beforeSet(e.target.value));
			} else {
				this.setFilter(filter.name, e.target.value);
			}
		}}>
			{filter.values.map((item) => {
				return <option value={item.value}>{item.label}</option>
			})}
		</select>

		return select;
	}

	renderText(filter) {
		return <input type="text" name={filter.name} onKeyUp={(e) => {
			if (e.keyCode == 13) {
				if (filter.setFilter != undefined) {
					filter.setFilter(this, filter, e.target.value)
				}	else if (filter.beforeSet !== undefined) {
					this.setFilter(filter.name, filter.beforeSet(e.target.value));
				} else {
					this.setFilter(filter.name, e.target.value);
				}
			}
	}}/>
	}

	itemsBlock(item, index) {
		// console.log('>>', item._id);return false;

		let fields = this.state.fields.map(field  => {
			let value = (typeof(item[field.name]) != 'undefined')? item[field.name] : "";
			let key = ['td', index, field.name].join('-');

			if(typeof(field.map) == 'function') {
				value = field.map(value, item, key);
			}

			if(typeof(field.render) == 'function') {
				 return field.render(value, item, key);
			}
			// console.log('>>', item);

			if(field.name == 'edit')
				return <td key={ key } className="text-right"><button className="btn btn-warning btn-sm edit" onClick={() => this.edit(item._id)}  data-toggle="modal" data-target="#modal-ter"><Icon size={10} color="#000" icon="edit" /></button><button className="btn btn-danger btn-sm ml-2 remove" onClick={() => this.removeTr(item._id)}><Icon size={10} color="#fff" icon="remove" /></button></td>


      if (field.name == 'targets') {
        let targets = item.targets.split(',');
        if (!this.state.showTargets[index]) targets = targets.slice(0, 3)
        return <td key={key} className="text-left">
          <div className={"targets"}>
            {targets.map(v => <div>{v}</div>)}
          </div>
          {!this.state.showTargets[index] && <button className="btn btn-sm btn-primary" onClick={e => this.showHideTargets(e, index, true)}>Show All</button>}
          {this.state.showTargets[index] && <button className="btn btn-sm btn-primary" onClick={e => this.showHideTargets(e, index, false)}>Hide</button>}
        </td>
      }

			if(field.name == 'show')
				return <td key={ key } className="text-right"><button className="btn btn-warning btn-sm edit" onClick={() => this.showLog(item._id)}><Icon size={12} color="#fff" icon="search" /></button><button className="btn btn-danger btn-sm ml-2 remove" onClick={() => this.removeTr(item._id)}><Icon size={10} color="#fff" icon="remove" /></button></td>

			if(field.name == 'active')
				if(item[field.name] == 1)
					return <td key={ key }><span className="badge badge-success">yes</span></td>
				else
					return <td key={ key }><span className="badge badge-dark">no</span></td>

      if(field.name == 'codebase')
				if(item[field.name] == 'legacy')
					return <td key={ key }><span className="badge badge-info">LEGACY</span></td>
				else if(item[field.name] == 'migration')
					return <td key={ key }><span className="badge badge-secondary">MIGRATION</span></td>
				else
					return <td key={ key }><span className="badge badge-warning">LATEST</span></td>


			if(field.name == 'type')
				if(field.updInst)
					if(item[field.name] == 'install')
						return <td key={ key }>INST</td>
					else
						return <td key={ key }>UPD</td>

			if(field.name == 'ts' || field.name == 'timestamp')
				return <td key={ key }>{ moment.unix(item[field.name]/1000).format("MM/DD/YYYY HH:mm") }</td>

			if (field.name == 'publish')
				if (item[field.name] == 1)
					return <td key={key}><span className="badge badge-success">published</span></td>
				else
					return <td key={key}></td>

			if(field.name == 'publish_action')
				if (item["publish"] == 1 && item["type"] == "install")
					return <td key={ key }></td>
				else
					return <td key={ key }>
						<button className="btn btn-dark btn-sm ml-2 publish" onClick={()=>this.props.publish(item._id)}>Publish</button></td>

			if(field.name == 'upd_btns')
				return <td key={ key }><div className={"flexbox justify-content-start"}><a className="btn btn-warning btn-sm download" href={ item.fileurl } download><Icon size={12} color="#fff" icon="download" /></a><button className="btn btn-danger btn-sm ml-2 remove" onClick={() => this.removeTr(item._id)}><Icon size={12} color="#fff" icon="remove" /></button></div></td>
			if (field.name == 'task_btns')
				return <td key={key}>
					<div className={"flexbox justify-content-start"}>
						<a className={"btn btn-warning btn-sm download" + (!item.portfolio_url ? " disabled " : " ")}
							 disabled={!item.portfolio_url}  href={item.portfolio_url} download><Icon size={12} color="#fff"

																																																																												 icon="download"/></a>
				
						<button className={"btn btn-danger btn-sm ml-2 stop"  + (item.finished || item.email.url ? " disabled " : " ")} onClick={() => this.props.stopTask(item._id)}><Icon size={12} color="#fff" icon="close"/></button>
						<button className="btn btn-danger btn-sm ml-2 remove disabled" disabled={true} onClick={() => this.props.kill(item._id)}><Icon size={12} color="#fff" icon="remove"/></button>
					</div>
				</td>

			if(field.name == 'autoupdate')
				if(item[field.name] == 1)
					return <td key={ key }><span className="badge badge-success mr-2">on</span><span className="badge">{ moment.unix(item['ts_run']).format("MM/DD/YYYY HH:mm") }</span></td>
				else
					return <td key={ key }><span className="badge badge-dark">off</span></td>

			if(field.name == 'production')
				if(item['beta'] == 0)
					return <td key={ key }><span className="badge badge-success mr-2">yes</span></td>
				else
					return <td key={ key }><span className="badge badge-danger">no</span></td>

			if(field.name == 'description')
				if(field.elipse) {
					let elipseText = this.kitcut(item[field.name], 100);

					if(this.moreShow)
						return <td key={ key }>{ elipseText }<a className="text-primary ml-2 cursor-pointer" data-toggle="modal" data-target="#modal-txt" onClick={ () => this.props.textModal(item[field.name]) }>more</a></td>
					else
						return <td key={ key }>{ elipseText }</td>
				} else
					return <td key={ key }>{ item[field.name] }</td>


			if(field.name == 'filename')
				return <td key={ key }><a  className="text-primary ml-2 cursor-pointer" data-toggle="modal" data-target="#modal-edit" onClick={ () => this.props.showEditModal(Object.assign({}, item)) }>{ value }</a></td>


			return <td key={ key }>{ value }</td>
		});

		return fields;
	}

	kitcut(text, limit) {
		if (typeof text != 'string')
			return '';

	  text = text.trim();

	  if( text.length <= limit) {
			this.moreShow = false;
			return text;
		}

	  text = text.slice( 0, limit);
	  let lastSpace = text.lastIndexOf(" ");

	  if( lastSpace > 0) {
	    text = text.substr(0, lastSpace);
	  }

		this.moreShow =  true;
	  return text + '...';
	}

  showHideTargets(element, index, show) {
    let {showTargets} = this.state;
    showTargets[index] = show;
    this.setState({showTargets});
  }

	removeTr(userId) {
		this.setState({ showSwal: true, userId: userId });
	}

	delete(func) {
		func
			.then((result) => {
				if(result.data.success) {
					let newdata = [];
					this.state.data.forEach((itm,ind) => {
						if (itm._id != this.state.userId)
							newdata.push(itm);
					})

					this.setState({ showSwal: false, userId: false, data: newdata });
					this.reload();
				}
			})
			.catch((e) => {
				this.setState({isLoad: false});
				console.log('error', e);
			});

	}

	edit(id) {
		this.props.edit(id);
	}
              
	render() {
		return (
			<div className="position-relative">
				{ this.state.loaderMini && <LoaderMini /> }

				<div>
					<table className="table table-striped table-sm" id={this.state.idTable}>
						<thead>
							<tr>
								{
									this.state.fields.map((item) => {
										return <th key={ item.name }>{ item.title }</th>
									})
								}
							</tr>
							{this.state.filtersColumn &&
							<tr className={'filters'}>
								{
									this.state.fields.map((item) => {
										return this.filterBlock(item)
									})
								}
							</tr>
							}
						</thead>
						<tbody>
				

							{
								this.state.data.map((item, idx) => {
									return <tr key={ item._id } data-id={ item._id }>{this.itemsBlock(item, idx)}</tr>
								})
							}
						</tbody>
					</table>
				</div>

				<SweetAlert
	        show = {this.state.showSwal}
	        title = {this.props.titleAlert}
	        text = {this.props.descAlert}
					type = {"warning"}
					showCancelButton = {true}
				  confirmButtonText = {"Yes"}
					confirmButtonColor = {"#3085d6"}
				  cancelButtonColor = {"#d33"}
	        onConfirm={() => this.delete(this.props.delete(this.state.userId))}
	      />

				<div className="tpl">
					<Input className="form-control w-100" classContainer="form-group w-100 m-0" title="" type="text" placeholder="" value="" disabled="disabled" />
					<button className="btn btn-danger remove-input"><Icon color="#fff" size={12} icon="close" /></button>
				</div>

				{ (this.state.cntRecords && !this.state.loaderMini) && <Pagination className="mt-4" cntRecords={this.state.cntRecords} onClick={(e) => { this.handelClick(e) }} limit={this.state.limit} page={this.state.page} /> }
			</div>
		);
	}
}
 
export default Table;
