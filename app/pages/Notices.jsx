import Icon from "../components/Icon.jsx";

var React = require('react');
import { Controller } from '../controllers/Controller.jsx';
import Table from '../components/Table.jsx';
import Switch from '../components/Switch.jsx';
import LoaderMini from '../components/LoaderMini.jsx';
import LoaderInfo from "../components/LoaderInfo.jsx";

import SweetAlert from 'sweetalert2-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { timers } from "jquery";


class Notices extends React.Component {
  constructor(props) {
    super(props)

    this.defaultNotification = {
      sended: false,
      client_id: '',
      type: 'warning',
      title: '',
      body: '',
      popup: false,
      buttons: [],
      data: '{}',
      mode: 'default'
    };

    this.secondButtonNotification = {
      sended: false,
      client_id: "",
      timestamp: 1564044753516,
      type: "warning",
      title: "Config Suggestion",
      body: "The OptiMargin Team have sent a config change suggestion. Please review and accept or reject.",
      popup: {
        title: "Here are all the proposed changes in you configuration",
        body: "<div style='background-color: red; width: 100px; height: 100px'>this is html</div>"
      },
      data: '{}',
      buttons: [
        { title: "Accept", action: 'config.accept' },
        { title: "Reject", action: 'config.decline' },
      ],
      mode: 'config',
      canclose: false
    };

    this.state = {
      users: [],
      loaderMini: false,
      clients: [],
      types: ['warning', 'info', 'danger', 'default'],
      modalError: '',
      notification: Object.assign({}, this.defaultNotification),
      npopup: false,
      dnotification: {},

      update_notify_users: [],
      update_notify_id: '',

      updateId:'',
      userAppId:'',
      selectedUsers: [],
      sendUpdateError: '',


      confirm_update_count: 0,
      need_confirm_times: 2,
      confirm_modal: false,

      inputValue: '',
      update: {},
      modalUpdateShow: false,
      filters: {

        client_id: {
          type: "select",
          name: "client_id",
          values: []
        },
        sended: {
          type: "select",
          name: "sended",
          values: [
            { label: "", value: "" },
            { label: "yes", value: true },
            { label: "no", value: false }
          ],
          beforeSet: (val) => {
            if (val == '') {
              return ''
            }
            return val == 'true' ? true : false
          }
        },
        type: {
          type: "select",
          name: "type",
          values: [
            { label: "", value: "" },
            { label: "update", value: "update" },
            { label: "warning", value: "warning" }
          ]
        },
      }
    }





    this.fields = [
      { title: "id", name: "_id" },
      { title: "User", name: "client_id" },
      // { title: "Sended", name: "sended", map:(value) => {
      //   if (value) {
      //     return <span className="badge badge-success">yes</span>
      //   } else {
      //     return <span className="badge badge-secondary">no</span>
      //   }
      // } },
      { title: "Type", name: "type" },
      {
        title: "Sended at", name: "send_timestamp", map: (value) => {
          if (value) {
            return moment.unix(value / 1000).format("MM/DD/YYYY HH:mm")
          } else {
            return ''
          }
        }
      },
      {
        title: "Showed at", name: "show_timestamp", map: (value) => {
          if (value) {
            return moment.unix(value / 1000).format("MM/DD/YYYY HH:mm")
          } else {
            return ''
          }
        }
      },
      { title: "Title", name: "title" },
      {
        title: "Body", name: "body", map: (value) => {
          if (value.length > 150) {
            let elipseText = value.slice(0, 100);
            return elipseText + '...';
          } else {
            return value
          }
        }
      },
      {
        title: "Data", name: "data", map: (value, item, key) => {
          if (item.type == 'update') {
            return <a href="#" onClick={() => {
              this.showUpdateModal(value)
            }}> Update: {value.result_tag}</a>
          } else {
            return JSON.stringify(value)
          }

        }
      },

      // { title: "", name: "delete" },
    ];
    this.table = React.createRef();
    this.that = this;

  }


  componentDidMount() {
    Controller.getList('https://api.optimargin.com/users/list', 0, 0)
      .then((result) => {
        if (result.data.success) {
          const users = [];
          result.data.data.map(item => {
            users.push({
              label: item.appid,
              value: item.appid,
              channels: item.channels
            })
          });
          this.users = users;
          let { filters } = this.state;
          filters.client_id.values = [{ label: "", value: "" }].concat(users)
          this.setState({ loaderMini: false, filters, users })
        }
      })
      .catch((e) => {
        console.log('error', e);
        this.setState({ loaderMini: false });
      });
  }

  getData(url, page, limit, query) {
    return Controller.getUpdts(url, page, limit, query);
  }

  showUpdateModal(update) {
    this.setState({ modalUpdateShow: true, update })
  }

  toggleModal(modalName, show) {
    let state = this.state;
    state[modalName] = show;
    this.setState(state);
  }

  setNotification(key, value) {
    let { notification } = this.state;
    if (notification[key] == undefined)
      notification[key] = '';
    notification[key] = value;
    this.setState({ notification });
  }

  confirmSuggestionN() {
    let snotification = Object.assign({}, this.secondButtonNotification);
    this.setState({ 'notification': snotification });
    let { notification } = this.state;
    this.defaultNotification.client_id = this.state.users[0].value;
    notification.client_id = this.state.users[0].value;
    this.secondButtonNotification.client_id = this.state.users[0].value;
    this.setState({ notification });

  }



  saveNotification() {
    console.log('saveNotification')
    let data = {};
    try {
      data = JSON.parse(this.state.notification.data);
    } catch (e) {
      this.setState({ modalError: 'Json parse data error' })
      return false
    }
    this.setState({ loaderMini: true });
    this.state.notification.data = data;
    this.setState({ modalError: '' })

    Controller.addNotification(this.state.notification).then((result) => {
      if (!result.data.success)
        console.log('error', result);
      else
        this.setState({ clients: result.data.data });
      this.setState({ loaderMini: false });
      setTimeout(() => {
        document.getElementById('notifymodalclose').click();
        document.getElementById('notifymodalclose2').click();
      }, 1);
      let dn = Object.assign({}, this.defaultNotification);
      this.setState({ 'notification': dn })
    })
      .catch((e) => {
        console.log('error', e);
        this.setState({ loaderMini: false });
      });
  }

  addNButton() {
    let buttons = this.state.notification.buttons;
    buttons.push({ title: '', action: '' })
    this.setNotification('buttons', buttons)
  }

  removeNButton(index) {
    let buttons = this.state.notification.buttons;
    buttons.splice(index, 1);
    this.setNotification('buttons', buttons)
  }

  sendNotify() {

    let { notification } = this.state;
    this.defaultNotification.client_id = this.state.users[0].value;
    notification.client_id = this.state.users[0].value;
    this.secondButtonNotification.client_id = this.state.users[0].value;
    this.setState({ notification });
  }


  handleInputChange(newValue) {
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  }

  filterColors(inputValue) {
    return colourOptions.filter(i =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }

  selectUsers(update) {
    let selectedUsers = [];
    let uniqUsers = {}
    let {users} = this.state
    if (update.private_users != undefined) {
      update.private_users.map(private_user => {
        users.map(user => {
          if (user.value == private_user && uniqUsers[user.value] == undefined) {
            selectedUsers.push(user)
            uniqUsers[user.value] = 1
          }
        })
      })
    } else if (update.channels != undefined) {
      update.channels.map(channel => {
        users.map(user => {
          if (user.channels != undefined) {
            if (user.channels.indexOf(channel) !== -1 && uniqUsers[user.value] == undefined) {
              selectedUsers.push(user)
              uniqUsers[user.value] = 1
            }
          }
        })
      })
    }

  
    this.setState({ selectedUsers })
  }

  loadUpdates(inputValue, callback) {
    Controller.getUpdts("https://api.optimargin.com/NewUpdates", 0, 10, {
      result_tag: {'$regex': inputValue},
      type: "update",
      publish: 1
    }).then(result => {
      let res = [];
      if (result.data.success) {
        let data = result.data.data;
        data.map(item => {
          res.push({
            value: item._id,
            label: item.result_tag + " from " + moment.unix(item.timestamp/1000).format("DD.MM.YYYY HH:mm"),
            data: item
          })
        })
      } 
      callback(res)
      
    });
  }


  confirmUpdate() {
    let {confirm_modal, confirm_update_count, need_confirm_times} = this.state;
    if (confirm_modal) {
      confirm_update_count++;
      if (confirm_update_count === need_confirm_times) {
        this.hideConfirmModal()
        this.saveUpdateNotify();

        return;
      }
    } else {
      confirm_modal = true;
      confirm_update_count = 0;
    }
    this.setState({confirm_modal, confirm_update_count});
  }

  hideConfirmModal() {
    this.setState({confirm_modal: false, confirm_update_count: 0});
  }

  saveUpdateNotify () {
    let errors = [];
    if (this.state.updateId == '') {
      errors.push('Empty update')
    }
    if (this.state.selectedUsers.length == 0) {
      errors.push('Empty users')
    }

    if (errors.length > 0) {
      this.setState({
        sendUpdateError : errors.join('\n')
      })
      return;
    }
    let userIds = [];
    this.state.selectedUsers.map(item=> {
      userIds.push(item.value)
    });
    let data = {
      updateId: this.state.updateId,
      userIds: userIds
    }
    this.setState({ loaderMini: true });

    Controller.sendUpdateNotify(data).then(result => {

      if (result.data.success) {
        this.setState({
          updateId: '',
          selectedUsers: ''
        });
        this.toggleModal('modalUpdateNotifyShow', false)
        this.table.current.reload();
      } else {
        this.setState({
          sendUpdateError : result.data.error
        })
      }

      this.setState({ loaderMini: false });
    }).catch(e=>{
      console.log('error', e);
        this.setState({ loaderMini: false });
    })
  }

  render() {
    let random1 = Math.random() < 0.5;
    let random2 = Math.random() < 0.5;
    return (
      <div className="position-relative h-100">
        <h2 className="pb-3 d-flex justify-content-between align-items-center">
          Notices

					<div className="d-flex justify-content-end align-items-center">
            <button className="btn btn-warning  " onClick={() => { return this.sendNotify() }} data-toggle="modal" data-target="#modal-notify">
              Send notify
            </button>

            <button className="btn btn-primary ml-3" onClick={() => { return this.confirmSuggestionN() }}
              data-toggle="modal" data-target="#modal-notify2">
              Config Suggestion notify
            </button>

            <button className="btn btn-info ml-3" onClick={() => { this.toggleModal('modalUpdateNotifyShow', true) }}>
              Send Update notify
            </button>
          </div>
        </h2>

        <Table
          id="all-switches"
          fields={this.fields}
          filtersColumn={this.state.filters}
          limit="20"
          page="0"
          ref={this.table}
          url="https://api.optimargin.com/Notices"
          source={(url, page, limit, filters) => this.getData(url, page, limit, filters)}
          delete={(id) => Controller.removeNewUpdates(id)}
          publish={(id) => {
            this.showPublishModal(id)
          }}
          titleAlert="Remove"
          descAlert="Are you sure want to delete?"
          textModal={(txt) => this.textModal(txt)}
          showEditModal={(item) => this.showEditModal(item)}
        />





        <Modal
          isOpen={this.state.modalUpdateShow}
          id="modalUpdPublish">
          <ModalHeader toggle={() => { this.toggleModal('modalUpdateShow', false) }}>
            Update
					</ModalHeader>
          <ModalBody>
            <table className="table">
              <tr>
                <td>Version</td>
                <td>{this.state.update.result_tag}</td>
              </tr>
              <tr>
                <td>Sources</td>
                <td>{this.state.update.sources && Object.keys(this.state.update.sources).map(source => {
                  return <div><b>{source}:</b> {this.state.update.sources[source]}</div>
                })}</td>
              </tr>
              <tr>
                <td>Date</td>
                <td>{moment.unix(this.state.update.timestamp / 1000).format("MM/DD/YYYY HH:mm")}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>{this.state.update.description}</td>
              </tr>
            </table>
          </ModalBody>
          <ModalFooter className="text-right">
            <button type="button" className="btn btn-outline-dark cancel"
              onClick={() => this.toggleModal('modalUpdateShow', false)}>Close</button>
          </ModalFooter>
        </Modal>


        <Modal
          isOpen={this.state.modalUpdateNotifyShow}
          id="modalUpdPublish">
          <ModalHeader toggle={() => { this.toggleModal('modalUpdateNotifyShow', false) }}>
            Add Update Notify
					</ModalHeader>
          <ModalBody>
          <div className="form-group error">
              <label className="label has-text-left">Select update</label>
              <AsyncSelect 
              cacheOptions
              loadOptions={(data, callback) => {this.loadUpdates(data, callback)}}
              defaultOptions
              onInputChange={(val) => {this.handleInputChange(val)}}
              options={this.users} 
              onChange={(option) => {
                let updateId = option.value
                this.setState({updateId})
                this.selectUsers(option.data)
              }}></AsyncSelect>
            </div>

            <div className="form-group">
              <label className="label has-text-left">Select users</label>
              <Select isMulti="true" options={this.users} value={this.state.selectedUsers} onChange={(options) => {
                let result = [];
                options && options.map((item) => {
                  result.push(item);
                });
                let { selectedUsers } = this.state;
                selectedUsers = result;
                this.setState( {selectedUsers} )
              }}></Select>
            </div>
          	{this.state.sendUpdateError &&	
            <div className="alert alert-danger" role="alert">
              {this.state.sendUpdateError}
            </div>
				  }
          </ModalBody>
          <ModalFooter className="text-right">
          <button type="button" className="btn btn-dark add-tr"
							onClick={() => this.confirmUpdate()}>Add
</button>
            <button type="button" className="btn btn-outline-dark cancel"
              onClick={() => this.toggleModal('modalUpdateNotifyShow', false)}>Close</button>
          </ModalFooter>
        </Modal>



        <div id="modal-notify" className="modal fade bd-example-modal-lg">
          {this.state.loaderMini && <LoaderMini />}

          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Notification</h4>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>

              <div className="modal-body">
                <label className="label has-text-left">Select AppId</label>
                <select className="form-control" onChange={(e) => {
                  this.setNotification('client_id', e.target.value)
                }}>
                  {
                    this.state.users && this.state.users.map((item, idx) => {
                      return (
                        <option key={idx} value={item.value}>{item.value}</option>
                      )
                    })
                  }
                </select>

                <label className="label has-text-left mt-3">Select type</label>
                <select className="form-control" onChange={(e) => {
                  this.setNotification('type', e.target.value)
                }}>
                  {
                    this.state.types.map((item, idx) => {
                      return (
                        <option key={idx} value={item}>{item}</option>
                      )
                    })
                  }
                </select>

                <label className="label has-text-left mt-3" htmlFor="ntitle">Title</label>
                <input
                  type={"text"}
                  id={"ntitle"}
                  className={"form-control"}
                  placeholder={"title"}
                  value={this.state.notification.title}
                  onChange={(e) => {
                    this.setNotification('title', e.target.value)
                  }}
                />

                <label className="label has-text-left mt-3" htmlFor={"nbody"}>Body</label>
                <textarea className="form-control"
                  onChange={(e) => this.setNotification('body', e.target.value)}
                  id={"nbody"}>{this.state.notification.body}</textarea>

                <label className="label has-text-left mt-3">Popup</label>
                <div className="form-group">
                  <Switch type="checkbox"
                    dataToggle="toggle"
                    dataOnstyle="warning"
                    active={this.state.npopup}
                    onChange={(r) => {
                      if (!r)
                        this.setNotification('popup', false);
                      else
                        this.setNotification('popup', { 'title': '', 'body': '' })
                      this.setState({ npopup: r })
                    }}
                  />
                </div>
                <div className="form-group">
                  {this.state.npopup && <React.Fragment>
                    <label className="label has-text-left mt-3" htmlFor="nptitle">Popup title</label>
                    <input
                      type={"text"}
                      id={"nptitle"}
                      className={"form-control"}
                      placeholder={"title"}
                      value={this.state.notification.popup.title}
                      onChange={(e) => {
                        let popup = this.state.notification.popup;
                        popup.title = e.target.value;
                        this.setNotification('popup', popup);
                      }}
                    />
                    <label className="label has-text-left mt-3" htmlFor={"nbody"}>Popup body</label>
                    <textarea className="form-control"
                      onChange={(e) => {
                        let popup = this.state.notification.popup;
                        popup.body = e.target.value;
                        this.setNotification('popup', popup);
                      }}
                      id={"nbody"} value={this.state.notification.popup.body}></textarea>
                  </React.Fragment>}
                </div>

                <div className="form-group">
                  <label className="label has-text-left mt-3">Buttons</label>
                  {this.state.notification.buttons.map((item, index) =>
                    (<div key={index}>
                      <label className="label has-text-left mt-3" htmlFor={"btitle" + index}>Title</label>
                      <input
                        type={"text"}
                        id={"btitle" + index}
                        className={"form-control"}
                        placeholder={"button title"}
                        value={item.title}
                        onChange={(e) => {
                          let buttons = this.state.notification.buttons;
                          buttons[index].title = e.target.value;
                          this.setNotification('buttons', buttons);
                        }}
                      />
                      <label className="label has-text-left" htmlFor={"baction" + index}>Action</label>
                      <input
                        type={"text"}
                        id={"baction" + index}
                        className={"form-control"}
                        placeholder={"Button action"}
                        value={item.action}
                        onChange={(e) => {
                          let buttons = this.state.notification.buttons;
                          buttons[index].action = e.target.value;
                          this.setNotification('buttons', buttons);
                        }}
                      />
                      <div>
                        <div className="btn btn-default" onClick={() => { return this.removeNButton(index) }}>
                          <Icon color="#000" size={12} icon="remove" /> Remove
                        </div>
                      </div>
                    </div>)
                  )
                  }
                </div>
                <div>
                  <div className="btn btn-default" onClick={() => { return this.addNButton() }}>
                    <Icon size={12} color="#000" icon="add" /> Add
                  </div>
                </div>

                <label className="label has-text-left mt-3" htmlFor={"ndata"}>Data</label>
                <textarea className="form-control"
                  onChange={(e) => this.setNotification('data', e.target.value)}
                  id={"ndata"} value={this.state.notification.data}></textarea>
                <div className="form-group">
                  <span style={{ color: "red" }}>{this.state.modalError}</span>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-dark add-tr" onClick={() => { return this.saveNotification() }}>Add</button>
                <button type="button" className="btn btn-outline-dark cancel" id="notifymodalclose" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>


        <div id="modal-notify2" className="modal fade bd-example-modal-lg">
          {this.state.loaderMini && <LoaderMini />}

          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Config Suggestion Notification</h4>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>

              <div className="modal-body">
                <label className="label has-text-left">Select AppId</label>
                <select className="form-control" onChange={(e) => {
                  this.setNotification('client_id', e.target.value)
                }}>
                  {
                    this.state.users && this.state.users.map((item, idx) => {
                      return (
                        <option key={idx} value={item.value}>{item.value}</option>
                      )
                    })
                  }
                </select>

                <label className="label has-text-left mt-3">Select type</label>
                <select className="form-control" onChange={(e) => {
                  this.setNotification('type', e.target.value)
                }}>
                  {
                    this.state.types.map((item, idx) => {
                      return (
                        <option key={idx} value={item}>{item}</option>
                      )
                    })
                  }
                </select>

                <label className="label has-text-left mt-3" htmlFor={"ndata"}>Data</label>
                <textarea className="form-control"
                  onChange={(e) => this.setNotification('data', e.target.value)}
                  id={"ndata"} value={this.state.notification.data}></textarea>
                <div className="form-group">
                  <span style={{ color: "red" }}>{this.state.modalError}</span>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-dark add-tr" onClick={() => { return this.saveNotification() }}>Add</button>
                <button type="button" className="btn btn-outline-dark cancel" id="notifymodalclose2" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>



        <Modal isOpen={this.state.confirm_modal} size={'lg'} toggle={() => this.hideConfirmModal()}>
          <ModalHeader>Are you sure to send notifications with this update?</ModalHeader>
          <ModalBody>Confirm this {this.state.need_confirm_times - this.state.confirm_update_count} times to send notices</ModalBody>
          <ModalFooter className={random1 ? "justify-content-between" : "justify-content-end"}>

            {random2 && <React.Fragment><Button
              color={'warning-outline'} onClick={() => this.hideConfirmModal()}
              className="mr-10"
            >
              Cancel
            </Button>
              <Button color={'primary'} onClick={(event) => this.confirmUpdate(event)}>
                Publish
              </Button>
            </React.Fragment>}

            {!random2 && <React.Fragment>
              <Button color={'primary'} onClick={(event) => this.confirmUpdate(event)}>
                Publish
              </Button>
              <Button
                color={'warning-outline'} onClick={() => this.hideConfirmModal()}
                className="mr-10"
              >
                Cancel
              </Button>
            </React.Fragment>}
          </ModalFooter>
        </Modal>

      </div>
    );
  }
}


export default Notices;