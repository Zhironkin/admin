var React = require('react');
import {Controller} from '../controllers/Controller.jsx';
import Table from '../components/Table.jsx';
import Input from '../components/Input.jsx';
import Icon from '../components/Icon.jsx';

class Page1 extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		};

		this.fields = [
			{ title: "Appid", name: "appid", handler: this.showTitle },
			{ title: "Apikey", name: "apikey", handler: this.showTitle },
			{ title: "Client Name", name: "name", handler: this.showTitle },
			{ title: "Permissions", name: "data", handler: this.showTitle, map: (data, row , uniqid) => {
				let keys = Object.keys(data);
				let result = [];
				for(let idx in keys) {
					let key = keys[idx];
					let keyUniq = uniqid + '-' + idx;
					let value = (data[key])? data[key].map(itm => itm.substr(0, 1)).join(', ') : "";
					let row = <div key={keyUniq}><b>{ key }: </b>{ value }</div>;
					result.push(row)
				}
				return result
			}},
			{ title: "Create Date", name: "ts", handler: this.showTitle},
			{ title: "Roles", name: "role", handler: this.showTitle, map: (data) => (typeof(data) == 'object')? data.join(', ') : "" },
			{ title: "Active", name: "active", },
			{ title: "", name: "edit", },
		];

    this.table = React.createRef();
		this.that = this;
	}

	componentDidMount() {
		var $this = this.that;

		document.getElementsByClassName('modal-button')[0].addEventListener('click', function handlerM() {
			var modal = document.getElementById('modal-ter');
			modal.getElementsByClassName('modal-title')[0].innerText = 'User add';
      var oldbtn = document.getElementById('edit-button');
      var btn = oldbtn.cloneNode(true);
      oldbtn.parentNode.replaceChild(btn, oldbtn);
			if(typeof(btn) != 'undefined') {
				btn.classList.remove('edit-tr');
				btn.classList.add('add-tr');
				btn.innerText = 'Add';
			}

			btn.addEventListener('click', function handler() {
				$this.actionBtnAdd();
				this.removeEventListener('click', handler);
			});

			// this.removeEventListener('click', handlerM);
		});

		// удвление input из моделей в попапе
		var ri = document.getElementsByClassName('remove-input');
		for (var i = 0; i < ri.length; i++) {
			ri[i].addEventListener('click', function(e) {
				this.that.removeInput(e.target);
			});
		}


		document.getElementById('add-model').addEventListener('click', function(e) {
			var model_select = document.getElementById('model-name');
			var selectVal = model_select.options[model_select.selectedIndex].value;
			var container = document.getElementById('container-new-models');
			var clone = document.getElementsByClassName('tpl')[0].cloneNode(true);
			clone.className = 'd-flex justify-content-between align-items-center mb-3 new-input';

			var $show = document.getElementById('container-form-add-model');
			var input = clone.getElementsByTagName('input');
			var checkboxes = $show.getElementsByTagName('input');
			var checkboxesChecked = [];
			var checkboxesCheckedText = [];
			for (var index = 0; index < checkboxes.length; index++) {
				 if (checkboxes[index].checked) {
						checkboxesChecked.push(checkboxes[index].value);
						checkboxesCheckedText.push(checkboxes[index].parentElement.getElementsByTagName('label')[0].innerText);
				 }
			}

			input[0].setAttribute('value', (selectVal + ' ' + checkboxesChecked.join('')));
			input[0].setAttribute('data-selectVal', selectVal);
			input[0].setAttribute('data-checkboxesCheckedVal', checkboxesChecked.join(', '));
			input[0].setAttribute('data-checkboxesCheckedText', checkboxesCheckedText);
			container.appendChild(clone);

			document.getElementById('container-form-add-model').style.height = 0;

			// удвление input из моделей в попапе
			var ri = container.getElementsByClassName('remove-input');
			for (var i = 0; i < ri.length; i++) {
				ri[i].addEventListener('click', function(e) {
					 $this.removeInput(e.target);
				});
			}
		});


		var closeBtns = this.getAll('.modal-backdrop, .modal .close, #cancel');
		if (closeBtns.length > 0) {
			closeBtns.forEach(function (el) {
				el.addEventListener('click', function () {
					$this.clearForm();
				});
			});
		}
	}

	getAll(selector) {
	 return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
	}

	clearForm() {
		var modal = document.getElementById('modal-ter');

		for(let val in modal.getElementsByTagName('input')) {
			if(!isNaN(val)) { //если число
				var el = modal.getElementsByTagName('input')[val];

				if(el.getAttribute('type') == 'text') {
					el.value = '';
					document.getElementById('container-new-models').innerHTML = '';
				}

				if(el.getAttribute('type') == 'checkbox') {
					(el.checked) ? (el.checked = !el.checked) : false;
				}
			}
		};
	}

	getLeads(url, page, limit) {
		return Controller.getList(url, parseInt(page), parseInt(limit))
	}

  makeuniq(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

	changePromocode(cnt) {
		var $target = document.getElementById('generate-code');
		var container = document.getElementById('client-secret');
		container.value = this.makeuniq(16).toUpperCase();
	}

	addModel() {
		var $show = document.getElementById('container-form-add-model');
		var $box = $show.getElementsByClassName('card');
		$show.style.height = ($box[0].clientHeight + 20) + "px";
	}

	removeInput(obj) {
		obj.closest('.new-input').remove();
	}

	actionBtnAdd() {
		var data = {};

		// добавляем строку с данными в таблицу
		// var at = document.getElementsByClassName('add-tr');
		var inp1 = document.getElementById('client-id');
		var inp2 = document.getElementById('client-secret');
		var inp3 = document.getElementById('product_db');
		var error = false;
		if(inp1.value == '') {
			inp1.classList.add('is-danger');
			error = true;
		} else {
			inp1.classList.remove('is-danger');
		}

		if(inp2.value == '') {
			inp2.classList.add('is-danger');
			error = true;
		} else {
			inp2.classList.remove('is-danger');
		}

		if(error) {
			return false;
		}

		var tbl = document.getElementsByClassName('tr-tpl')[0];
		var clone = tbl.getElementsByTagName('tr')[0].cloneNode(true);

		clone.getElementsByClassName('id')[0].innerText = inp1.value;
		clone.getElementsByClassName('cl-secret')[0].innerText = inp2.value;

		data.appid = inp1.value;
		data.apikey = inp2.value;
		data.product_db = inp3.value;

		var containerModels = document.getElementById('container-new-models');
		var models = containerModels.getElementsByTagName('input');
		var arrayModels = [];
		data.data = {};
		for (var index = 0; index < models.length; index++) {
			 if (models[index].value != '') {
				 arrayModels.push('<div><b>' +  models[index].getAttribute('data-selectVal') + ': </b>' + models[index].getAttribute('data-checkboxesCheckedVal') + '</div>');

				 data.data[models[index].getAttribute('data-selectVal')] = models[index].getAttribute('data-checkboxesCheckedText').split(',');
			 }
		}
		clone.getElementsByClassName('access')[0].innerHTML = arrayModels.join('');
		let date = new Date();
		clone.getElementsByClassName('create-date')[0].innerText = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();

		data.ts = date.getTime();

		let isAdmin = document.getElementById('is-admin');
		let isUser = document.getElementById('is-user');
		clone.getElementsByClassName('roles')[0].innerText = ((isAdmin.checked) ? isAdmin.value + ' ' : '') + ((isUser.checked) ? isUser.value : '');

		data.role = [];
		if(isAdmin.checked)
			data.role.push(isAdmin.value);
		if (isUser.checked)
			data.role.push(isUser.value);

		let isActive = document.getElementById('is-active');
		clone.getElementsByClassName('activate')[0].innerText = (isActive.checked) ? isActive.value : 0;

		data.active = (isActive.checked) ? isActive.value : 0;

		Controller.addUser(data)
			.then((result) => {
				if(result.data.success) {
					this.setState({isLoad: false});
          document.getElementById('cancel').click();
					this.clearForm();

          this.table.current.reload()
				}
			})
			.catch((e) => {
				this.setState({isLoad: false});
				console.log('error', e);
			});
	}

	edit(id) {
		var modal = document.getElementById('modal-ter');
		modal.getElementsByClassName('modal-title')[0].innerText = 'User edit';
		var oldbtn = document.getElementById('edit-button');
    var btn = oldbtn.cloneNode(true);
    oldbtn.parentNode.replaceChild(btn, oldbtn);
		if(typeof(btn) != 'undefined') {
			btn.classList.remove('add-tr');
			btn.classList.add('edit-tr');
			btn.innerText = 'Save';
		}
		// btn.removeAttribute('onclick');

		var $this = this;

		Controller.infoUser(id)
			.then((result) => {
				if(result.data.success) {
					var container = document.getElementById('container-new-models');
					var data = result.data.data;

					document.getElementById('client-id').value = data.appid;
					document.getElementById('client-secret').value = data.apikey;
					document.getElementById('product_db').value = data.product_db == undefined ? '' : data.product_db;

					if(data.data) {
						for (var itm in data.data) {
							var clone = document.getElementsByClassName('tpl')[0].cloneNode(true);
							clone.className = 'd-flex justify-content-between align-items-center mb-3 new-input';
							var input = clone.getElementsByTagName('input');

							var substrModel = [];
							data.data[itm].forEach((val) => {
								substrModel.push(val.substr(0, 1));
							});

							input[0].setAttribute('value', (itm + ' ' + substrModel.join('')));
							input[0].setAttribute('data-selectVal', itm);
							input[0].setAttribute('data-checkboxesCheckedVal', substrModel.join(', '));
							input[0].setAttribute('data-checkboxesCheckedText', data.data[itm].join(','));

							container.appendChild(clone);
						};

						var ri = document.getElementsByClassName('remove-input');
						for (var i = 0; i < ri.length; i++) {
							ri[i].addEventListener('click', function(e) {
								$this.removeInput(e.target);
							});
						}
					}

					if(data.role) {
						data.role.forEach((val) => {
							if(val == 'admin')
								document.getElementById('is-admin').checked = true;
							if(val == 'user')
								document.getElementById('is-user').checked = true;
						});
					}

					if(parseInt(data.active) == 1)
						document.getElementById('is-active').checked = true;
					btn.addEventListener('click', function handler() {
						$this.saveEdit(id, data)
						// this.removeEventListener('click', handler);
					});
				}
			})
			.catch((e) => {
				this.setState({isLoad: false});
				console.log('error', e);
			});
	}

	saveEdit(id, data) {
		var dataEdit = {
			appid: document.getElementById('client-id').value,
			apikey: document.getElementById('client-secret').value,
			product_db: document.getElementById('product_db').value,
		};

		var error = false;
		if(dataEdit.appid == '') {
			document.getElementById('client-id').classList.add('is-danger');
			error = true;
		} else {
			document.getElementById('client-id').classList.remove('is-danger');
		}

		if(dataEdit.apikey == '') {
			document.getElementById('client-secret').classList.add('is-danger');
			error = true;
		} else {
			document.getElementById('client-secret').classList.remove('is-danger');
		}

		if(error) {
			return false;
		}

		var containerModels = document.getElementById('container-new-models');
		var models = containerModels.getElementsByTagName('input');
		dataEdit.data = {};
		for (var index = 0; index < models.length; index++) {
			if (models[index].value != '') {
				dataEdit.data[models[index].getAttribute('data-selectVal')] = models[index].getAttribute('data-checkboxesCheckedText').split(',');
			}
		}

		dataEdit.ts = data.ts;

		dataEdit.role = [];
		if(document.getElementById('is-admin').checked)
			dataEdit.role.push(document.getElementById('is-admin').value);
		if (document.getElementById('is-user').checked)
			dataEdit.role.push(document.getElementById('is-user').value);

		dataEdit.active = (document.getElementById('is-active').checked) ? 1 : 0;
		// console.log('>>>>>>', dataEdit);

		Controller.editUser(id, dataEdit)
			.then((result) => {
				if(result.data.success) {
					document.getElementById('cancel').click();
					this.table.current.reload()

					this.clearForm();
				}
			})
			.catch((e) => {
				this.setState({isLoad: false});
				console.log('error', e);
			});
	}

	render() {
			return(
				<div className="position-relative h-100">
		      <h2 className="pb-3">Users</h2>
		      <Table
						id="all-users"
						fields={this.fields}
						limit="20"
						page="0"
            ref={this.table}
						url="https://api.optimargin.com/users/list"
						source={(url, page, limit) => this.getLeads(url, page, limit)}
						edit={(id) => this.edit(id)}
						delete={(id) => Controller.removeUser(id)}
						titleAlert="Remove user"
						descAlert="Are you sure want to delete this user?"
					/>

					<button className="btn btn-warning modal-button" type="button" data-toggle="modal" data-target="#modal-ter">
						<Icon color="#fff" size={12} icon="add" /> Add
					</button>

					<div id="modal-ter" className="modal fade bd-example-modal-lg">
						<div className="modal-dialog modal-lg">
		 					<div className="modal-content">
						    <div className="modal-header">
									<h4 className="modal-title">User add</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
						    </div>

						    <div className="modal-body">
									<Input id="client-id" className="form-control" classContainer="form-group" title="Appid" type="text" placeholder="Appid" value="" onChange={() => {}} />

						      <div className="position-relative">
										<Input id="client-secret" className="form-control" classContainer="form-group" title="Apikey" type="text" placeholder="Apikey" value="" onChange={() => {}} />
										<span id="generate-code">
											<a href="javascript:void(0)" onClick={() => this.changePromocode(6)} className="btn btn-warning"><Icon size={12} color="#fff" icon="share" /></a>
										</span>
						      </div>

									<label className="label has-text-left">Models</label>

									<div id="container-new-models"></div>

									<div id="container-form-add-model">
										<div className="card">
											<div className="card-body">
										    <label className="label has-text-left">Model name</label>

											  <select className="form-control" id={"model-name"}>
											    <option>Switches</option>
											    <option>Settings</option>
											    <option>Updates</option>
											    <option>Logs</option>
											  </select>

												<div className="d-flex justify-content-between align-items-center my-3">
													<Input className="custom-control-input" classLabel="custom-control-label w-100" classContainer="custom-control custom-checkbox mr-sm-2" id='check-L' type="checkbox" title="List" value="L" onChange={() => {}} />
													<Input className="custom-control-input" classLabel="custom-control-label w-100" classContainer="custom-control custom-checkbox mr-sm-2" id='check-R' type="checkbox" title="Read" value="R" onChange={() => {}} />
													<Input className="custom-control-input" classLabel="custom-control-label w-100" classContainer="custom-control custom-checkbox mr-sm-2" id='check-W' type="checkbox" title="Write" value="W" onChange={() => {}} />
													<Input className="custom-control-input" classLabel="custom-control-label w-100" classContainer="custom-control custom-checkbox mr-sm-2" id='check-I' type="checkbox" title="Insert" value="I" onChange={() => {}} />
													<Input className="custom-control-input" classLabel="custom-control-label w-100" classContainer="custom-control custom-checkbox mr-sm-2" id='check-D' type="checkbox" title="Delete" value="D" onChange={() => {}} />
												</div>

												<div className="d-flex justify-content-end">
													<button className="btn btn-warning btn-sm" id="add-model"><Icon size={10} color="#fff" icon="add" /> Append</button>
												</div>
										  </div>
										</div>
									</div>

									<button className="btn btn-warning btn-sm" onClick={() => this.addModel()}><Icon size={10} color="#fff" icon="add" /> Add</button>

									<div className="mt-3">
										<label className="label">Roles</label>
										<div className="d-flex justify-content-start align-items-center">
											<Input className="custom-control-input" classLabel="custom-control-label w-100" classContainer="custom-control custom-checkbox mr-sm-5" id='is-admin' type="checkbox" title="Admin" value="admin" onChange={() => {}} />
											<Input className="custom-control-input" classLabel="custom-control-label w-100" classContainer="custom-control custom-checkbox mr-sm-2" id='is-user' type="checkbox" title="User" value="user" onChange={() => {}} />
										</div>
									</div>

									<div className="mt-3">
										<label className="label">Activate</label>
										<Input className="custom-control-input" classLabel="custom-control-label w-100" classContainer="custom-control custom-checkbox mr-sm-2" id='is-active' type="checkbox" title="active" value="1" onChange={() => {}} />
									</div>

									<div className="mt-3 form-group">
										<label className="label" htmlFor={"product_db"}>Product db</label>
										{/*<Input className="custom-control-input" classLabel="custom-control-label w-100" classContainer="custom-control custom-checkbox mr-sm-2" id='is-active' type="checkbox" title="active" value="1" onChange={() => {}} />*/}
										<textarea className="form-control" id={"product_db"} name={"product_db"}></textarea>
									</div>
						    </div>

						    <div className="modal-footer">
						      <button type="button" className="btn btn-dark add-tr" id={"edit-button"}>Add</button>
						      <button type="button" id="cancel" className="btn btn-outline-dark" data-dismiss="modal">Cancel</button>
						    </div>
						  </div>
					  </div>
					</div>

					<div className="tpl">
						<Input className="form-control w-100" classContainer="form-group w-100 m-0" title="" type="text" placeholder="" value="" disabled="disabled" />
						<button className="btn btn-danger remove-input"><Icon size={12} color="#fff" icon="close" /></button>
					</div>

					<table className="tr-tpl">
						<tbody>
							<tr>
								<td className="id"></td>
								<td className="cl-secret"></td>
								<td className=""></td>
								<td className="access"></td>
								<td className="create-date"></td>
								<td className="roles"></td>
								<td className="activate"></td>
								<td>
									<div className="is-pulled-right">
										<button className="button is-primary edit" type="button" data-target="modal-ter" aria-haspopup="true"><Icon size={10} color="#fff" icon="edit" /></button>
										<button className="button is-danger remove" type="button"><Icon size={10} color="#fff" icon="close" /></button>
									</div>
								</td>
							</tr>
							</tbody>
					</table>
				</div>
			);
		}
}
 
export default Page1;
