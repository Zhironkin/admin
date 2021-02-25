import Icon from "../components/Icon.jsx";

var React = require('react');
import {Controller} from '../controllers/Controller.jsx';
import Table from '../components/Table.jsx';
import Switch from '../components/Switch.jsx';
import LoaderMini from '../components/LoaderMini.jsx';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

class Page3 extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			loaderMini: false,
			back_tags: [],
			front_tags: [],
			showDate: false,
			startDate: new Date(),
			active: false,

			debug_i: false,
			debug_u: false,

			back_tag_u: 'master',
			front_tag_u: 'master',

			back_tag_i: 'master',
			front_tag_i: 'master',




			result_tag_i: '',
			result_tag_u: '',
			note_u: '',
			note_i: '',
			autoupdate: 0,
			ts_run: (new Date()).getTime(),

			txtModal: '',
			isEditModalOpen: false,
			editModal: {},
			codebase: "legacy"
		};

		this.fields = [
			{ title: "Tagname", name: "tagname" },
			{ title: "Note", name: "description", elipse: true },
			{ title: "Filename", name: "filename" },
			{ title: "CreateDate", name: "timestamp" },
			{ title: "Autoupdate", name: "autoupdate" },
			{ title: "Production", name: "production" },
			{ title: "Type", name: "type", updInst: true },
			{ title: "Codebase", name: "codebase"},
			{ title: "", name: "upd_btns" },
		];

		this.filters = {
      codebase: {
        type: "select",
        name: "codebase",
        values: [
          {label: "", value: ""},
          {label: "latest", value: "latest"},
          {label: "legacy", value: "legacy"},
          {label: "migration", value: "migration"},
        ]
      },
      production: {
        type: "select",
        name: "beta",
        beforeSet: (val) => {
          if (val === '')
            return val;
          return parseInt(val)
        },
        values: [
          {label: "", value: ""},
          {label: "yes", value: 0},
          {label: "no", value: 1}
        ]
      },
      type: {
        type: "select",
        name: "type",
        values: [
          {label: "", value: ""},
          {label: "INST", value: "install"},
          {label: "UPD", value: "update"}
        ]
      }
    };

		this.table = React.createRef();
		this.that = this;

		this.versions = {};
		this.getVersions();
	}

	componentDidMount() {
		Controller.getTagList()
			.then((result) => {
				if(result.data.success) {
					this.setState(
							{
								back_tags: result.data.list_back,
								front_tags: result.data.list_front,
								loaderMini: false
							}
						);
				}
			})
			.catch((e) => {
				console.log('error', e);
				this.setState({ loaderMini: false });
			});
	}

	getUpdts(url, page, limit, query) {
	  return Controller.getUpdts(url, page, limit, query);
	}

  getVersions() {
    Controller.getUpdatesVersions().then(r => {
      if (r.data.success && r.data.data !== undefined) {
        r.data.data.map(item => {
          this.versions[item._id] = item.last_version.toString().replace(/[^0-9.]/ig, '');
        });
      }
      this.setVersion(this.state.codebase);
    });
  }

	getCurrentVersion(codebase) {
		if (this.versions[codebase] !== undefined) {
			return 'v' + this.versions[codebase];
		}
		return '';
	}

	getNextVersion (codebase) {
		if (this.versions[codebase] !== undefined) {
			return 'v' + this.incrementVersion(this.versions[codebase]);
		}
		return '';
	}

	setVersion(codebase) {
	  var nextVersion = this.getNextVersion(codebase);
    this.setState({result_tag_u: nextVersion, result_tag_i: nextVersion});
  }

	incrementVersion (version) {
		var versionParts = version.toString().split('.');
		versionParts.map((item, i) => {
			versionParts[i] = parseInt(item);
		});
		if (versionParts[2] >= 99) {
			versionParts[2] = 0;
			versionParts[1] = versionParts[1] + 1
		} else {
			versionParts[2] = versionParts[2] + 1;
		}
		if (versionParts[1] >= 99) {
			versionParts[1] = 0;
			versionParts[0] = versionParts[0] + 1
		}
		return versionParts[0] + '.' + versionParts[1] + '.' + ('0' + versionParts[2]).slice(-2);
	}

	switched(sw, type) {
		if(type == 'upd') {
			if(sw) {
				this.setState({ showDate: true, autoupdate: 1, active: true });
			} else {
				this.setState({ showDate: false, autoupdate: 0, active: false });
			}
		}
    if (type == 'codebase') {
      this.setState({codebase: sw});
      this.setVersion(sw);
    }
	}

	handleChange(date) {
		this.setState({ startDate: date, ts_run: date.getTime() });
	}

	setEditModalState(changes) {
		this.setState(Object.assign(this.state.editModal, changes));
	}

	saveUpd() {
		this.setState({ loaderMini: true });

		let data = {
			back_tag: this.state.back_tag_u,
			front_tag: this.state.front_tag_u,
			note: this.state.note_u,
			result_tag: this.state.result_tag_u,
			autoupdate: this.state.autoupdate,
			debug: this.state.debug_u,
			codebase: this.state.codebase,
			type: 'update'
		}

		if(this.state.autoupdate) data.ts_run = this.state.ts_run

		Controller.addUpdates(data)
			.then((result) => {
				if(result.data.success) {
					this.setState({
						loaderMini: false,
						showDate: false,
						active: false,
						debug_u: false,
						startDate: new Date(),

						back_tag_u: 'master',
						front_tag_u: 'master',
						result_tag_u: '',
						note_u: '',
						autoupdate: 0,
						codebase: 'legacy',
						ts_run: (new Date()).getTime(),
					});

					this.table.current.reload();
					document.getElementsByClassName('close')[0].click();
          this.getVersions()
				}
			})
			.catch((e) => {
				console.log('error', e);
				this.setState({ loaderMini: false });
			});
	}

	editAutoUpdate() {
		this.setState({ loaderMini: true });

		let data = {
			id: this.state.editModal._id,
			beta: this.state.editModal.beta,
			autoupdate: this.state.editModal.autoupdate,
			ts_run: this.state.editModal.ts_run,
			note: this.state.editModal.description,
			codebase: this.state.codebase,
		}

		Controller.saveUpdates(data)
			.then((result) => {
				if(result.data.success) {
					this.setState({
						loaderMini: false,
					});
					this.table.current.reload();
					this.setState({ isEditModalOpen: false });
				} else {
					this.setState({ loaderMini: false });
				}
			})
			.catch((e) => {
				console.log('error', e);
				this.setState({ loaderMini: false });
			});
	}

	textModal(txt) {
		this.setState({ txtModal: txt });
	}

	showEditModal(item) {
		this.setState({ editModal: item });
		this.setState({isEditModalOpen: true});
	}

	toggleEditModal () {
		this.setState({
			isEditModalOpen: false
		});
	}

	saveInst() {
		this.setState({ loaderMini: true });

		let data = {
			type: 'install',
			back_tag: this.state.back_tag_i,
			front_tag: this.state.front_tag_i,
			result_tag: this.state.result_tag_i,
			note: this.state.note_i,
			debug: this.state.debug_i,
			codebase: this.state.codebase,
		}

		// if(this.state.active) data.debug = 1

		Controller.addUpdates(data)
			.then((result) => {
				if(result.data.success) {
					this.setState({
						loaderMini: false,
						// active: false,
						debug_i: false,
						back_tag_i: 'master',
						front_tag_i: 'master',
						result_tag_i: '',
						note_i: '',
						codebase: 'legacy'
					});

					this.table.current.reload();
					document.getElementsByClassName('close')[1].click();
          this.getVersions();
				} else {
					this.setState({ loaderMini: false });
				}
			})
			.catch((e) => {
				console.log('error', e);
				this.setState({ loaderMini: false });
			});
	}

	render() {
		return(
			<div className="position-relative h-100">
				<h2 className="pb-3 d-flex justify-content-between align-items-center">
					Updates

					<div className="d-flex justify-content-end align-items-center">
						<button className="btn btn-warning modal-button" type="button" data-toggle="modal" data-target="#modal-upd">
							<Icon size={12} color="#fff" icon="add" /> UPD package
						</button>

						<button className="btn btn-warning modal-button ml-3" type="button" data-toggle="modal" data-target="#modal-inst">
							<Icon size={12} color="#fff" icon="add" /> INST package
						</button>
					</div>
				</h2>

				<Table
					id="all-switches"
					fields={this.fields}
          filtersColumn={this.filters}
					limit="20"
					page="0"
					ref={this.table}
					url="https://api.optimargin.com/Updates"
					source={(url, page, limit, filters) => this.getUpdts(url, page, limit, filters)}
					delete={(id) => Controller.removeUpdates(id)}
					titleAlert="Remove"
					descAlert="Are you sure want to delete?"
					textModal={ (txt) => this.textModal(txt)}
					showEditModal={ (item) => this.showEditModal(item)}
				/>

				<div id="modal-upd" className="modal fade bd-example-modal-lg">
					{ this.state.loaderMini && <LoaderMini /> }

					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title">Add UPD package</h4>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>

							<div className="modal-body">
								<label className="label has-text-left">Select front version</label>
								<select className="form-control"
										onChange={ (e) => {
											let {result_tag_u} = this.state;
											let front_tag_u = e.target.value;
											if (result_tag_u == '')
												result_tag_u = front_tag_u;

											this.setState({ front_tag_u, result_tag_u })
										} }
										value={ this.state.front_tag_u }
								>
									<option key={ 0 } value="master">Create from MASTER branch</option>
									{
										this.state.front_tags.map((item, idx) => {
											return (
												<option key={ idx } value={ item }>{ item }</option>
											)
										})
									}
								</select>

								<label className="label has-text-left mt-3">Select back version</label>
								<select className="form-control"
										onChange={ (e) => {
											let {result_tag_u} = this.state;
											let back_tag_u = e.target.value;
											if (result_tag_u == '')
												result_tag_u = back_tag_u;
											this.setState({ back_tag_u, result_tag_u })
										} }
										value={ this.state.back_tag_u }
								>
									<option key={ 0 } value="master">Create from MASTER branch</option>
									{
										this.state.back_tags.map((item, idx) => {
											return (
												<option key={ idx } value={ item }>{ item }</option>
											)
										})
									}
								</select>
								<label className="label has-text-left mt-3">Codebase</label>
								<div className="form-group">
									<div className="form-check form-check-inline">
										<label><input className="form-check-input" type="radio" name="codebaseup" value="legacy"
																	checked={this.state.codebase == 'legacy'} onClick={(r) => {
											this.switched('legacy', 'codebase')
										}}></input> Legacy </label>
									</div>
									<div className="form-check form-check-inline">
										<label><input className="form-check-input" type="radio" name="codebaseup" value="latest"
																	checked={this.state.codebase == 'latest'} onClick={(r) => {
											this.switched('latest', 'codebase')
										}}></input> Latest</label>
									</div>
									<div className="form-check form-check-inline">
										<label><input className="form-check-input" type="radio" name="codebaseup" value="migration"
																	checked={this.state.codebase == 'migration'} onClick={(r) => {
											this.switched('migration', 'codebase')
										}}></input> Migration</label>
									</div>
								</div>


								<label className="label has-text-left mt-3" for="result_tag_u">Result version <span className="badge badge-light">{this.getCurrentVersion(this.state.codebase)}</span></label>
								<input
									type={"text"}
									id={"result_tag_u"}
									className={"form-control"}
									placeholder={this.getCurrentVersion(this.state.codebase)}
									value={this.state.result_tag_u ? this.state.result_tag_u : this.getNextVersion(this.state.codebase)}
									onChange={(e) => {
										this.setState({result_tag_u: e.target.value})
									}}
								/>

								<label className="label has-text-left mt-3">Release notes</label>
								<textarea className="form-control" onChange={ (e) => this.setState({ note_u: e.target.value }) } value={ this.state.note_u }></textarea>

								<label className="label has-text-left mt-3">Debug</label>
								<div className="form-group">
									<Switch type="checkbox" dataToggle="toggle"
											dataOnstyle="warning"
											active={ this.state.debug_u }
											onChange={ (r) => {
												this.setState({debug_u: r})
											} }
									/>
								</div>


								<label className="label has-text-left mt-3">Run automatic</label>
								<div className="form-group">
									<Switch type="checkbox" dataToggle="toggle" dataOnstyle="warning" active={ this.state.active } onChange={ (e) => this.switched(e, 'upd') } />
								</div>

								{ this.state.showDate &&
								<div>
									<label className="label has-text-left mt-3">Date / Time for update</label>
									<div>
										<DatePicker
											selected={this.state.startDate}
											onChange={(date) => this.handleChange(date)}
											showTimeSelect
											timeFormat="HH:mm"
											timeIntervals={15}
											dateFormat="dd/MM/yyyy HH:mm"
											timeCaption="time"
											className="form-control"
										/>
									</div>
								</div>
								}
							</div>

							<div className="modal-footer">
								<button type="button" className="btn btn-dark add-tr" onClick={ () => this.saveUpd() }>Add</button>
								<button type="button" className="btn btn-outline-dark cancel" data-dismiss="modal">Cancel</button>
							</div>
						</div>
					</div>
				</div>

				<div id="modal-inst" className="modal fade bd-example-modal-lg">
					{ this.state.loaderMini && <LoaderMini /> }

					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title">Add INST package</h4>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>

							<div className="modal-body">
								<label className="label has-text-left">Select front version</label>
								<select className="form-control" onChange={(e) => {
									let {result_tag_i} = this.state;
									let front_tag_i = e.target.value;
									if (result_tag_i == '')
										result_tag_i = front_tag_i;
									this.setState({ front_tag_i, result_tag_i })
								}}>
									<option key={ 0 } value="master">Create from MASTER branch</option>
									{
										this.state.front_tags.map((item, idx) => {
											return (
												<option key={ idx } value={ item }>{ item }</option>
											)
										})
									}
								</select>

								<label className="label has-text-left mt-3">Select back version</label>
								<select className="form-control" onChange={(e) => {
									let {result_tag_i} = this.state;
									let back_tag_i = e.target.value;
									if (result_tag_i == '')
										result_tag_i = back_tag_i;
									this.setState({ back_tag_i, result_tag_i })
								}}>
									<option key={ 0 } value="master">Create from MASTER branch</option>
									{
										this.state.back_tags.map((item, idx) => {
											return (
												<option key={ idx } value={ item }>{ item }</option>
											)
										})
									}
								</select>

								<label className="label has-text-left mt-3">Codebase</label>
								<div className="form-group">
									<div className="form-check form-check-inline">
										<label><input className="form-check-input" type="radio" name="codebasein" value="legacy"
																	checked={this.state.codebase === 'legacy'} onClick={(r) => {
											this.switched('legacy', 'codebase')
										}}></input> Legacy</label>
									</div>
									<div className="form-check form-check-inline">
										<label><input className="form-check-input" type="radio" name="codebasein" value="latest"
																	checked={this.state.codebase === 'latest'} onClick={(r) => {
											this.switched('latest', 'codebase')
										}}></input> Latest</label>
									</div>
									<div className="form-check form-check-inline">
										<label><input className="form-check-input" type="radio" name="codebasein" value="migration"
																	checked={this.state.codebase == 'migration'} onClick={(r) => {
											this.switched('migration', 'codebase')
										}}></input> Migration</label>
									</div>
								</div>

								<label className="label has-text-left mt-3" htmlFor="result_tag_i">Result version <span className="badge badge-light">{this.getCurrentVersion(this.state.codebase)}</span><span
									className="badge badge-warning">{this.state.currentVersion}</span></label>
								<input
									type={"text"}
									id={"result_tag_i"}
									className={"form-control"}
									placeholder={this.getCurrentVersion(this.state.codebase)}
									value={this.state.result_tag_i ? this.state.result_tag_i : this.getNextVersion(this.state.codebase)}
									onChange={(e) => {
										this.setState({result_tag_i: e.target.value})
									}}
								/>



								<label className="label has-text-left mt-3">Release notes</label>
								<textarea className="form-control" onChange={ (e) => this.setState({ note_i: e.target.value }) } value={ this.state.note_i }></textarea>

								<label className="label has-text-left mt-3">Debug</label>
								<div className="form-group">
									<Switch type="checkbox"
											dataToggle="toggle"
											dataOnstyle="warning"
											active={ this.state.debug_i }
											onChange={ (r) => { this.setState({debug_i: r})} }
									/>
								</div>


							</div>

							<div className="modal-footer">
								<button type="button" className="btn btn-dark add-tr" onClick={ () => this.saveInst() }>Add</button>
								<button type="button" className="btn btn-outline-dark cancel" data-dismiss="modal">Cancel</button>
							</div>
						</div>
					</div>
				</div>

				<div id="modal-txt" className="modal fade bd-example-modal-lg">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-body overflow-auto">
								{ this.state.txtModal }
								{/* <Dynamic html={ this.state.desc } /> */}
							</div>

							<div className="modal-footer">
								<button type="button" id="cancel" className="btn btn-outline-dark" data-dismiss="modal">Cancel</button>
							</div>
						</div>
					</div>
				</div>
				<Modal isOpen={this.state.isEditModalOpen} size="lg">
					<ModalHeader toggle={()=> this.toggleEditModal()}>
						Edit UPD package
					</ModalHeader>
					{this.state.loaderMini && <LoaderMini/>}
					<ModalBody>
						<label className="label has-text-left mt-3">Release notes</label>
						<textarea className="form-control"
								  onChange={(e) => this.setEditModalState({description: e.target.value})}
								  value={this.state.editModal.description}></textarea>

						<label className="label has-text-left mt-3">Production</label>
						<div className="form-group">
							<Switch type="checkbox" dataToggle="toggle"
									dataOnstyle="warning"
									active={this.state.editModal.beta == 0}
									onChange={(r) => {
										this.setEditModalState({beta: r ? 0 : 1})
									}}
							/>
						</div>
						<label className="label has-text-left mt-3">Run automatic</label>
						<div className="form-group">
							<Switch type="checkbox" dataToggle="toggle" dataOnstyle="warning"
									active={this.state.editModal.autoupdate} onChange={(e) => {
								this.setEditModalState({
									autoupdate: e ? 1 : 0,
									ts_run: this.state.editModal.ts_run ? this.state.editModal.ts_run : new Date().getTime() / 1000
								})
							}}/>
						</div>

						{this.state.editModal.autoupdate === 1 &&
						<div>
							<label className="label has-text-left mt-3">Date / Time for update</label>
							<div>
								<DatePicker
									selected={moment.unix(this.state.editModal.ts_run).toDate()}
									onChange={(date) => {
										this.setEditModalState({
											ts_run: Math.round(date.getTime() / 1000)
										})
									}}
									showTimeSelect
									timeFormat="HH:mm"
									timeIntervals={15}
									dateFormat="dd/MM/yyyy HH:mm"
									timeCaption="time"
									className="form-control"
								/>
							</div>
						</div>
						}
					</ModalBody>
					<ModalFooter className="text-right">

						<button type="button" className="btn btn-dark add-tr"
								onClick={() => this.editAutoUpdate()}>Save
						</button>
						<button type="button" className="btn btn-outline-dark cancel"
								onClick={() => this.toggleEditModal()}>Cancel
						</button>
					</ModalFooter>


				</Modal>
			</div>
		);
	}
}

export default Page3;
