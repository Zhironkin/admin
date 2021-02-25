import Icon from "../components/Icon.jsx";

var React = require('react');
import {Controller} from '../controllers/Controller.jsx';
import Table from '../components/Table.jsx';
import Switch from '../components/Switch.jsx';
import LoaderMini from '../components/LoaderMini.jsx';
import LoaderInfo from "../components/LoaderInfo.jsx";

import SweetAlert from 'sweetalert2-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Select from 'react-select';
import {timers} from "jquery";
import {ConfirmModal} from "../components/ConfirmModal.jsx";

class NewUpdates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaderMini: false,
      sources: [],
      front_tags: [],
      back_tags: [],


      showDate: false,
      startDate: new Date(),
      active: false,

      debug_i: false,
      debug_u: false,

      back_tag_u: 'master',
      front_tag_u: 'master',
      update_sources: {},
      update_channels: [],
      update_private_users: [],
      update_background: false,

      back_tag_i: 'master',
      front_tag_i: 'master',

      modalUpdShow: false,
      modalUpdOldShow: false,
      modalInstShow: false,

      modalProgressShow: false,
      BuildLog: {},
      totalProgress: 1,
      loadedProgress: 0,

      updateError: '',

      version: 2,
      allSources: false,

      installBranches: [],

      install_tag: 'master',
      note_u: '',
      note_i: '',
      autoupdate: 0,
      ts_run: (new Date()).getTime(),

      txtModal: '',
      isEditModalOpen: false,
      editModal: {},
      codebase: "legacy",

      publishId: false,
      publishUpdate: {},
      publish_channels: [],
      publish_private_users: [],
      publish_result_users: [],

      confirm_update_count: 0,
      need_confirm_times: 5,
      confirm_modal: false,

    };

    this.sourcesHashMap = {}
    this.users = [];
    this.fields = [
      {title: "Tagname", name: "result_tag"},
      {title: "Note", name: "description", elipse: true},
      {title: "Filename", name: "filename"},
      {title: "CreateDate", name: "timestamp"},
      {title: "Type", name: "type", updInst: true},
      {
        title: "Sources", name: "sources", map: (values) => {
          let res = [];
          Object.keys(values).map(key => {
            res.push(<span><b>{this.sourcesHashMap[key]}:</b> {values[key]}<br></br></span>)
          })
          return res
        }
      },
      {
        title: "Channels", name: "channels", map: (values) => {
          let res = []
          for (let i in values) {
            let value = values[i]
            var className = "badge mr-1 ";
            switch (value) {
              case "latest":
                className += "badge-warning"
                break;
              case "legacy":
                className += "badge-info"
                break;
              case "dev":
                className += "badge-dark"
                break;
              case "private":
                className += "badge-grey"
                break;
            }
            res.push(<span className={className}>{value}</span>)
          }
          return res
        }
      },
      {
        title: "Users", name: "private_users", map: (values) => {
          let res = []
          for (let i in values) {
            let value = values[i]
            res.push(<span className="badge mr-1 badge-grey">{value}</span>)
          }
          return res
        }
      },
      {title: "Publish", name: "publish"},
      {title: "", name: "publish_action"},
      {title: "", name: "upd_btns"},
    ];

    this.filters = {
      channels: {
        type: "select",
        name: "channels",
        values: [
          {label: "", value: ""},
          {label: "latest", value: "latest"},
          {label: "legacy", value: "legacy"},
          {label: "dev", value: "dev"},
          {label: "private", value: "private"},
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
      },
      publish: {
        type: "select",
        name: "publish",
        values: [
          {label: "", value: ""},
          {label: "Published", value: 1}
        ],
        beforeSet: (val) => {
          if (val === '')
            return val;
          return parseInt(val)
        }
      }
    };


    this.table = React.createRef();
    this.that = this;


  }

  toggleModal(modalName, show) {
    let state = this.state;
    state[modalName] = show;
    this.setState(state);
  }

  componentDidMount() {
    Controller.getSources()
      .then((result) => {
        if (result.data.Success) {
          this.setState(
            {
              sources: result.data.Data.sort((a, b) => a.Label < b.Label ? -1 : 1)
            }
          );
          result.data.Data.map(item => {
            this.sourcesHashMap[item.Name] = item.Label
            if (item.IsInstall) {
              this.setState({installBranches: item.Branches})
            }
          })
        }
        return Controller.getList('https://api.optimargin.com/users/list', 0, 0)
      }).then((result) => {
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
        this.setState({loaderMini: false})
      }
    })
      .catch((e) => {
        console.log('error', e);
        this.setState({loaderMini: false});
      });
  }

  getUpdts(url, page, limit, query) {
    return Controller.getUpdts(url, page, limit, query);
  }


  switched(sw, type) {
    if (type == 'upd') {
      if (sw) {
        this.setState({showDate: true, autoupdate: 1, active: true});
      } else {
        this.setState({showDate: false, autoupdate: 0, active: false});
      }
    }
    if (type == 'update_background') {
      if (sw) {
        this.setState({update_background: true});
      } else {
        this.setState({update_background: false});
      }
    }
    if (type == 'codebase') {
      this.setState({codebase: sw});
      this.setVersion(sw);
    }
  }

  handleCheckbox(sw, type, checked) {
    if (type == 'update_channels') {
      const {update_channels} = this.state;
      if (checked) {
        update_channels.push(sw);
      } else {
        let ind = update_channels.indexOf(sw)
        if (ind > -1) {
          update_channels.splice(ind, 1)
        }
      }
      this.setState({update_channels});
      // this.setVersion(sw);
    }
  }


  handleChangePublish(sw, type, checked) {
    if (type == 'publish_channels') {
      const {publish_channels} = this.state;
      if (checked) {
        publish_channels.push(sw);
      } else {
        let ind = publish_channels.indexOf(sw)
        if (ind > -1) {
          publish_channels.splice(ind, 1)
        }
      }
      this.setState({publish_channels}, () => {
        this.getNoticedUsers()
      });
    } else if (type == 'publish_private_users') {
      let publish_private_users = checked
      this.setState({publish_private_users}, () => {
        this.getNoticedUsers()
      });
    }

  }

  getNoticedUsers() {
    let {publish_channels, publish_private_users} = this.state
    Controller.getNoticedUsers({
      channels: publish_channels,
      private_users: publish_private_users,
    }).then((result) => {
      let data = result.data.data;
      if (result.data.success) {
        this.setState({publish_result_users: data})
      } else {

      }
    }).catch((e) => {
      console.error(e)
    });
  }

  handleChange(date) {
    this.setState({startDate: date, ts_run: date.getTime()});
  }

  setEditModalState(changes) {
    this.setState(Object.assign(this.state.editModal, changes));
  }

  validateUpd() {
    let {updateError} = this.state;
    if (Object.keys(this.state.update_sources).length === 0) {
      updateError = 'Fill sources'
      this.setState({updateError})
      return false;
    }

    updateError = ''
    this.setState({updateError})
    return true
  }

  saveUpdNew() {
    this.setState({loaderMini: true});

    let data = {
      sources: this.state.update_sources,
      channels: this.state.update_channels,
      private_users: this.state.update_private_users,
      note: this.state.note_u,
      background: this.state.background,
      type: 'update'
    }
    if (!this.validateUpd()) {
      this.setState({loaderMini: false});
    } else {
      Controller.addNewUpdates(data)
        .then((result) => {
          if (result.data.success) {
            this.initModalProgress()
            this.toggleModal('modalUpdShow', false)
            this.toggleModal('modalProgressShow', true)

            this.checkNewUpdates(result.data.data.pid);
          }
        })
        .catch((e) => {
          console.log('error', e);
          this.setState({loaderMini: false});
        });
    }
  }


  // editAutoUpdate() {
  // 	this.setState({ loaderMini: true });

  // 	let data = {
  // 		id: this.state.editModal._id,
  // 		beta: this.state.editModal.beta,
  // 		autoupdate: this.state.editModal.autoupdate,
  // 		ts_run: this.state.editModal.ts_run,
  // 		note: this.state.editModal.description,
  // 		codebase: this.state.codebase,
  // 	}

  // 	Controller.saveUpdates(data)
  // 		.then((result) => {
  // 			if(result.data.success) {
  // 				this.setState({
  // 					loaderMini: false,
  // 				});
  // 				this.table.current.reload();
  // 				this.setState({ isEditModalOpen: false });
  // 			} else {
  // 				this.setState({ loaderMini: false });
  // 			}
  // 		})
  // 		.catch((e) => {
  // 			console.log('error', e);
  // 			this.setState({ loaderMini: false });
  // 		});
  // }

  textModal(txt) {
    this.setState({txtModal: txt});
  }

  showEditModal(item) {
    return
    this.setState({editModal: item});
    this.setState({isEditModalOpen: true});
  }

  toggleEditModal() {
    this.setState({
      isEditModalOpen: false
    });
  }

  saveInst() {
    this.setState({loaderMini: true});

    let data = {
      type: 'install',
      branch: this.state.install_tag,
      note: this.state.note_i,
    }


    Controller.addNewInstall(data)
      .then((result) => {
        if (result.data.success) {
          this.initModalProgress()
          this.toggleModal('modalInstShow', false)
          this.toggleModal('modalProgressShow', true)

          this.checkNewInstall(result.data.data.pid);
        }
      })
      .catch((e) => {
        console.log('error', e);
        this.setState({loaderMini: false});
      });
  }

  checkNewUpdates(childPid) {
    setTimeout(() => {
      Controller.getBuildLog(childPid)
        .then((result) => {
          if (result.data.success) {
            let data = result.data.data
            this.setState({
              BuildLog: data,
              buildFinished: data.finished,
              totalProgress: data.totalProgress,
              loadedProgress: data.loadedProgress
            });
            if (!data.finished) {
              this.checkNewUpdates(childPid);
            } else if (this.state.BuildLog.status) {
              this.resetNewUpdates()
            }
          }
        })
    }, 2000);
  }

  checkNewInstall(childPid) {
    setTimeout(() => {
      Controller.getBuildLog(childPid)
        .then((result) => {
          if (result.data.success) {
            let data = result.data.data
            this.setState({
              BuildLog: data,
              buildFinished: data.finished,
              totalProgress: data.totalProgress,
              loadedProgress: data.loadedProgress
            });
            if (!data.finished) {
              this.checkNewInstall(childPid);
            } else if (this.state.BuildLog.status) {
              this.resetNewInstall()
            }
          }
        })
    }, 2000);
  }

  resetNewUpdates() {
    this.setState({
      loaderMini: false,
      update_sources: {},
      update_channels: [],
      update_private_users: [],
      background: false,
      note_u: '',
    });

    this.table.current.reload();
    this.toggleModal('modalUpdShow', false)
  }

  resetNewInstall() {
    this.setState({
      loaderMini: false,
      install_tag: 'master',
      note_i: ''
    });
    this.table.current.reload();
    this.toggleModal('modalInstShow', false)
  }

  closeModalProgress() {
    this.initModalProgress()
    this.toggleModal('modalProgressShow', false)
  }

  initModalProgress() {
    this.setState({
      BuildLog: {},
      buildFinished: false,
      totalProgress: 1,
      loadedProgress: 0
    });
  }

  showPublishModal(id) {
    Controller.infoNewUpdate(id).then((result) => {
      if (result.data.success) {
        let data = result.data.data
        if (data.type == "install") {
          Controller.publishNewInstall({id: id}).then(r => {
            if (r.data.success) {
              this.setState({
                publishId: false
              });
              this.table.current.reload();
            }
          })
        } else {
          this.setState({
            publishId: data._id,
            publish_private_users: data.private_users ? data.private_users: [],
            publish_channels: data.channels ? data.channels : [],
            publish_result_users: [],
            modalUpdPublishShow: true
          })
          this.getNoticedUsers();
        }
      } else {

      }
    })
  }

  confirmUpdate() {
    let {confirm_modal, confirm_update_count, need_confirm_times} = this.state;
    if (confirm_modal) {
      confirm_update_count++;
      if (confirm_update_count === need_confirm_times) {
        this.hideConfirmModal()
        this.publishUpdate();
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

  filterSources(sources) {
    return sources.filter((item)=> {
      if(this.state.version == 2){
        return !~['backend','sharedlib'].indexOf(item.Name)
      }else if(this.state.version == 3){
        return item.Type == this.state.version
      }
    })
  }

  changeVersion(version) {
    this.setState({ version: version}, () => {
      this.toggleAllUpdateSources()
    })
  }

  toggleAllUpdateSources() {
    let {update_sources} = this.state;
    if (this.state.isAllSources) {
      update_sources = {}
      this.filterSources(this.state.sources).map(item => {
        if (update_sources[item.Name] == undefined) {
          update_sources[item.Name] = 'master'
        }
      })
    } else {
      update_sources = {}
    }
    this.setState({update_sources});
  }

  publishUpdate() {

    Controller.publishNewUpdates({id: this.state.publishId, channels: this.state.publish_channels, private_users: this.state.publish_private_users})
      .then((result) => {
        if (result.data.success) {
          this.setState({
            modalUpdPublishShow: false,
            publishId: false
          });
          this.table.current.reload();
        } else {
          this.setState({modalUpdPublishShow: false, publishId: false});
        }
      })
      .catch((e) => {
        console.log('error', e);
        this.setState({showSwal: false, publishId: false});
      });
  }

  render() {
     let random1 = Math.random() < 0.5;
     let random2 = Math.random() < 0.5;
    return (
      <div className="position-relative h-100">
        <h2 className="pb-3 d-flex justify-content-between align-items-center">
          Updates

          <div className="d-flex justify-content-end align-items-center">
            <button className="btn btn-warning modal-button" type="button" onClick={() => {
              this.toggleModal('modalUpdShow', true)
            }}>
              <Icon size={12} color="#fff" icon="add"/> UPD package
            </button>

            <button className="btn btn-info modal-button ml-3" type="button" onClick={() => {
              this.toggleModal('modalInstShow', true)
            }}>
              <Icon size={12} color="#fff" icon="add"/> INST package
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
          url="https://api.optimargin.com/NewUpdates"
          source={(url, page, limit, filters) => this.getUpdts(url, page, limit, filters)}
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
          isOpen={this.state.modalUpdShow}
          id="modalUpdNew" size="lg">
          <ModalHeader toggle={() => {
            this.toggleModal('modalUpdShow', false)
          }}>
            Edit UPD package
          </ModalHeader>
          <ModalBody>

            <label className="label has-text-left mt-3">Versions</label>
            <div className="form-group">
              <div className="form-check form-check-inline">
                <label><input className="form-check-input" type="radio" name="version" value="2"
                              checked={this.state.version == 2} onClick={(r) => {
                  this.changeVersion(2)
                }}></input> 2 </label>
              </div>
              <div className="form-check form-check-inline">
                <label><input className="form-check-input" type="radio" name="version" value="3"
                              checked={this.state.version == 3} onClick={(r) => {
                  this.changeVersion(3)
                }}></input> 3</label>
              </div>
            </div>
            <div className="form-group">
              Select sources
            </div>
            <div className="row">
              <div className="col-md-4 offset-md-1">
                <input type="checkbox" id="sources-all" name="sources-all" checked={(Object.keys(this.filterSources(this.state.sources)).length == Object.keys(this.state.update_sources).length)}
                       onChange={(e) => {
                         this.setState({isAllSources: e.target.checked}, () => {
                           this.toggleAllUpdateSources()
                         });

                       }}/> <label for="sources-all"><b>All</b></label>

              </div>
            </div>
            {
              this.filterSources(this.state.sources).map((item, idx) => {
                return (
                  <div className="row">
                    <div className="col-md-4 offset-md-1">
                      <input type="checkbox" id={"source-" + idx} name={item.Name}
                             checked={!!this.state.update_sources[item.Name]} onChange={(e) => {
                        let val = e.target.checked;
                        let {update_sources} = this.state;

                        if (val) {
                          update_sources[e.target.name] = 'master';
                        } else {
                          delete update_sources[e.target.name]
                        }

                        this.setState({update_sources});

                      }}/> <label for={"source-" + idx}>{item.Label}</label>
                    </div>
                    <div className="col-md-6">
                      {this.state.update_sources[item.Name] &&
                      <select name="source-tag" className="form-control form-control-sm"
                              value={this.state.update_sources[item.Name] ? this.state.update_sources[item.Name] : ''}
                              onChange={(e) => {
                                let {update_sources} = this.state;
                                update_sources[item.Name] = e.target.value;

                                this.setState({update_sources});
                              }}>
                        <option value=""></option>
                        {
                          item.Branches.map((tag) => {
                            return (<option value={tag}>{tag}</option>)
                          })
                        }
                      </select>
                      }
                    </div>
                  </div>
                )
              })

            }

            <label className="label has-text-left mt-3">Select channels</label>

            <div className="form-group">

              <div className="form-check form-check offset-md-1">
                <label><input className="form-check-input" type="checkbox" name="channelUp" value="latest"
                              checked={this.state.update_channels.latest} onClick={(r) => {
                  this.handleCheckbox('latest', 'update_channels', r.target.checked)
                }}></input> Latest</label>
              </div>
              <div className="form-check form-check offset-md-1">
                <label><input className="form-check-input" type="checkbox" name="channelUp" value="legacy"
                              checked={this.state.update_channels.legacy} onClick={(r) => {
                  this.handleCheckbox('legacy', 'update_channels', r.target.checked)
                }}></input> Legacy </label>
              </div>

              <div className="form-check form-check offset-md-1">
                <label><input className="form-check-input" type="checkbox" name="channelUp" value="dev"
                              checked={this.state.update_channels.dev} onClick={(r) => {
                  this.handleCheckbox('dev', 'update_channels', r.target.checked)
                }}></input> Dev</label>
              </div>
              <div className="form-check form-check offset-md-1">
                <label><input className="form-check-input" type="checkbox" name="channelUp" value="private"
                              checked={this.state.update_channels.private} onClick={(r) => {
                  this.handleCheckbox('private', 'update_channels', r.target.checked)
                }}></input> Private</label>
              </div>

              {this.state.update_channels.indexOf('private') != -1 && <div className="offset-md-1"><Select options={this.users} isMulti="true" onChange={(options) => {
                let result = [];
                options && options.map((item) => {
                  result.push(item.value);
                });
                let {update_private_users} = this.state;
                update_private_users = result;
                this.setState({update_private_users});
              }}/></div>
              }
            </div>

            <label className="label has-text-left mt-3">Background update</label>
            <div className="form-group">
              <Switch type="checkbox" dataToggle="toggle" dataOnstyle="success" active={this.state.update_background} onChange={(e) => this.switched(e, 'update_background')}/>
            </div>

            <div className="form-group">
              <label className="label has-text-left mt-3">Release notes</label>
              <textarea className="form-control" onChange={(e) => this.setState({note_u: e.target.value})} value={this.state.note_u}></textarea>
            </div>
            {this.state.updateError &&
            <div className="alert alert-danger" role="alert">
              {this.state.updateError}
            </div>
            }
          </ModalBody>
          <ModalFooter className="text-right">

            <button type="button" className="btn btn-dark add-tr"
                    onClick={() => this.saveUpdNew()}>Make
            </button>
            <button type="button" className="btn btn-outline-dark cancel"
                    onClick={() => this.toggleModal('modalUpdShow', false)}>Cancel
            </button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalInstShow} size="lg">
          <ModalHeader toggle={() => {
            this.toggleModal('modalInstShow', false)
          }}>Add INST package</ModalHeader>
          <ModalBody>
            <label className="label has-text-left">Select version</label>
            <select className="form-control" onChange={(e) => {
              let {install_tag} = this.state;
              install_tag = e.target.value;
              this.setState({install_tag})
            }}>
              {
                this.state.installBranches.map((tag) => {
                  return (<option value={tag}>{tag}</option>)
                })
              }
              {
                this.state.front_tags.map((item, idx) => {
                  return (
                    <option key={idx} value={item}>{item}</option>
                  )
                })
              }
            </select>


            <label className="label has-text-left mt-3">Release notes</label>
            <textarea className="form-control" onChange={(e) => this.setState({note_i: e.target.value})} value={this.state.note_i}></textarea>


          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-dark add-tr" onClick={() => this.saveInst()}>Add</button>
            <button type="button" className="btn btn-outline-dark cancel" onClick={() => {
              this.toggleModal('modalInstShow', false)
            }}>Cancel
            </button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.modalProgressShow}
          id="modalProgress" size="lg">
          <ModalHeader>
            Build Progress
          </ModalHeader>
          <ModalBody>
            <LoaderInfo
              info={this.state.BuildLog}
              loaded={this.state.loadedProgress / this.state.totalProgress * 100}
            />
          </ModalBody>
          <ModalFooter className="text-right">
            {this.state.buildFinished &&
            <button type="button" className="btn btn-dark add-tr"
                    onClick={() => this.closeModalProgress()}>Close
            </button>}
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.isEditModalOpen} size="lg">
          <ModalHeader toggle={() => this.toggleEditModal()}>
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

        <Modal
          isOpen={this.state.modalUpdPublishShow}
          id="modalUpdPublish" size="lg">
          <ModalHeader toggle={() => {
            this.toggleModal('modalUpdPublishShow', false)
          }}>
            Publish package
          </ModalHeader>
          {this.state.loaderMini && <LoaderMini/>}
          <ModalBody>


            <label className="label has-text-left mt-3">Chose channels</label>

            <div className="form-group">

              <div className="form-check form-check offset-md-1">
                <label><input className="form-check-input" type="checkbox" name="channelUp" value="latest"
                              checked={this.state.publish_channels.indexOf('latest') != -1} onClick={(r) => {
                  this.handleChangePublish('latest', 'publish_channels', r.target.checked)
                }}></input> Latest</label>
              </div>
              <div className="form-check form-check offset-md-1">
                <label><input className="form-check-input" type="checkbox" name="channelUp" value="legacy"
                              checked={this.state.publish_channels.indexOf('legacy') != -1} onClick={(r) => {
                  this.handleChangePublish('legacy', 'publish_channels', r.target.checked)
                }}></input> Legacy </label>
              </div>

              <div className="form-check form-check offset-md-1">
                <label><input className="form-check-input" type="checkbox" name="channelUp" value="dev"
                              checked={this.state.publish_channels.indexOf('dev') != -1} onClick={(r) => {
                  this.handleChangePublish('dev', 'publish_channels', r.target.checked)
                }}></input> Dev</label>
              </div>
              <div className="form-check form-check offset-md-1">
                <label><input className="form-check-input" type="checkbox" name="channelUp" value="private"
                              checked={this.state.publish_channels.indexOf('private') != -1} onClick={(r) => {
                  this.handleChangePublish('private', 'publish_channels', r.target.checked)
                }}></input> Private</label>
              </div>

              {this.state.publish_channels.indexOf('private') != -1 &&
              <div className="offset-md-1"><Select options={this.users} defaultValue={this.state.publish_private_users.map(item=> {return {label: item, value: item}}) } isMulti="true" onChange={(options) => {
                let result = [];
                options && options.map((item) => {
                  result.push(item.value);
                });
                let {publish_private_users} = this.state;
                publish_private_users = result;
                this.handleChangePublish('private', 'publish_private_users', publish_private_users)
              }}/></div>
              }
              {this.state.publish_result_users.length > 0 && <pre>
										Available for: {
                this.state.publish_result_users.join(', ')
              }
									</pre>}
            </div>


            {this.state.publishError &&
            <div className="alert alert-danger" role="alert">
              {this.state.publishError}
            </div>
            }
          </ModalBody>
          <ModalFooter className="text-right">

            <button type="button" className="btn btn-dark add-tr"
                    onClick={() => this.confirmUpdate()}>Publish
            </button>
            <button type="button" className="btn btn-outline-dark cancel"
                    onClick={() => this.toggleModal('modalUpdPublishShow', false)}>Cancel
            </button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.confirm_modal} size={'lg'} toggle={() => this.hideConfirmModal()}>
          <ModalHeader>Are you sure to publish this update?</ModalHeader>
          <ModalBody>Confirm this {this.state.need_confirm_times - this.state.confirm_update_count} times to publish update</ModalBody>
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

export default NewUpdates;
