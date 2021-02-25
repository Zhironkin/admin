var React = require('react');
import { Controller } from '../controllers/Controller.jsx';
import Table from '../components/Table.jsx';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import SweetAlert from "sweetalert2-react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { contains } from 'jquery';
import Icon from '../components/Icon.jsx';

class OnDemandTasks extends React.Component {
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

            reloadTable: true,

            debug_i: false,
            debug_u: false,
            stopTask: false,
            stopTaskId: false,
            approveTaskId: false,

            editTaskId: false,
            modalEditEmailShow: false,
            taskEmailHtml: ""
        };

        this.sourcesHashMap = {}
        this.users = [];
        this.fields = [

            { title: "User", name: "user", map: (value => value[0] ? value[0].name : '') },
            { title: "email", name: "user", map: (value => value[0] ? value[0].email : '') },
            {
                title: "Created", name: "createdAt", map: (value) => {
                    if (value) {
                        return moment(value).format("MM/DD/YYYY HH:mm")
                    } else {
                        return ''
                    }
                }
            },
            {
                title: "Email status",
                name: "email_status",
                render: (value, item) => {
                    if (item.email.status) {
                        switch (item.email.status) {
                            case "Sent":
                                return <td><span className="badge badge-success">{item.email.status}</span></td>
                            case "Ready":
                                return <td><span className="badge badge-primary">{item.email.status}</span></td>
                            case "ErrorSent":
                                return <td><span className="badge badge-error">{item.email.status}</span></td>
                            default:
                                return <td><span className="badge">{item.email.status}</span></td>
                        }

                    } else {
                        return <td>{item.email.sended ? <span class={"text-success"}>sent</span> : <span className={"text-danger"}>not sent</span>}</td>
                    }


                }
            },

            {
                title: "Status",
                name: "status",
                map: (value => value.name)
            },

            {
                title: "Description", name: "status",
                render: (value, item, key) => {
                    return <td className="breakable" style={{ "width": "20%" }}>{value.description}</td>
                }
            },

            {
                title: "Email Html",
                name: "email_body",
                render: (value, item, key) => {
                    return <td>
                        {item.email && item.email.status == 'Ready' && <Button className={"btn btn-primary btn-sm"} onClick={() => {
                        this.showEditEmailHtml(item._id)
                    }}>edit</Button>}
                    {item.email && item.email.url && item.email.url && <a className={"btn btn-primary btn-sm ml-1"} target={"_blank"} href={item.email && item.email.url && item.email.url}>view</a>}
                    </td>
               
                }
            },

            {
                title: "Approve",
                name: "approved",
                render: (value, item) => {
                    if (item.email && item.email.approved) {
                        return <td><span class={"badge badge-success"}>approved</span></td>
                    } else if (item.email && item.email.status == 'Ready') {
                        return <td><Button className={"btn-warning btn-sm"} onClick={() => {
                            this.setState({
                                approveEmail: true,
                                approveTaskId: item._id
                            })
                        }}>approve</Button></td>
                    } else {
                        return <td></td>
                    }
                }

            },
            { title: "Actions", name: "task_btns" },


        ];

        this.filters = {
            // email_status: {
            //   type: "select",
            //   name: "email_status",
            //   values: [
            //     {label: "All", value: ""},
            //     {label: "Not Send", value: "NotSend"},
            //     {label: "Ready", value: "Ready"},
            //     {label: "Sent", value: "Sent"},
            //   ],

            // },
            // user: {
            //   type: "text",
            //   name: "user",
            //   setFilter: (table, filter, val) => {
            //     table.state.filters["users"] = {name: val};
            //     table.state.page = 0;
            //     table.reload();

            //   }
            // }
        };


        this.table = React.createRef();
    }


    componentDidMount() {

    }

    killTask(id) {
        alert("Kill Task " + id);
    }

    showStopTask(id) {
        this.setState({ stopTaskId: id, stopTask: true })
    }


    async showEditEmailHtml(id) {
        this.setState({
            editTaskId: id
        })
        let result = {};
        try {
            result = await Controller.getTaskEmailHtml(id);
        }
        catch (e) {
            console.log('error with approve task')
        }
        if (result.data.success) {
            this.setState({
                taskEmailHtml: result.data.data.html
            })
            this.toggleModal("modalEditEmailShow", true)

        } else {
            this.setState({ editTaskId: false })
            console.error('error approve task', result.data)
        }
    }

    async saveEmailHtml() {
        let result = {};
        try {
            result = await Controller.setTaskEmailHtml(this.state.editTaskId, this.state.taskEmailHtml);
        }
        catch (e) {
            console.log('error with approve task', e)
        }
    
        if (result.data.success) {
            this.toggleModal("modalEditEmailShow", false)
            this.setState({ editTaskId: false, taskEmailHtml: "" })
        } else {
            console.error('error approve task', result.data)
        }

    }


    toggleModal(modalName, show) {
        let state = this.state;
        state[modalName] = show;
        this.setState(state);
    }


    async approveTaskEmail() {
        let { approveTaskId } = this.state;
        let result = {};
        try {
            result = await Controller.approveTaskEmail(approveTaskId);
        }
        catch (e) {
            console.log('error with approve task')
        }
        if (result.data.success) {
            this.table.current.reload();
            this.setState({ approveTaskId: false, reloadTable: !this.state.reloadTable, approveEmail: false })

        } else {
            this.setState({ approveTaskId: false, approveEmail: false })
            console.error('error approve task', result.data)
        }
    }

    async stopTask() {
        let { stopTaskId } = this.state;
        let result = {};
        try {
            result = await Controller.stopTask(stopTaskId);
        }
        catch (e) {
            console.log('error with stop task')
        }
        if (result.success) {
            this.setState({ stopTask: false, reloadTable: !this.state.reloadTable })
            this.table.current.reload();
        } else {
            this.setState({ stopTask: false })
            console.error('error stop task', result.data)
        }
    }

    textModal(txt) {
        this.setState({ txtModal: txt });
    }

    render() {
        return (
            <div className="position-relative h-100">
                <h2 className="pb-3 d-flex justify-content-between align-items-center">
                    On Demand Tasks

                    <div className="d-flex justify-content-end align-items-center">

                    </div>
                </h2>

                <Table
                    id="all-all"
                    fields={this.fields}
                    filtersColumn={this.filters}
                    limit="20"
                    page="0"
                    change={this.state.reloadTable}
                    ref={this.table}
                    // url="http://127.0.0.1:1166/ondemand/tasks"
                    url="https://api.optimargin.com/ondemand/tasks"
                    source={(url, page, limit, filters) => Controller.getUpdts(url, page, limit, filters)}
                    kill={(id) => {
                        this.killTask(id)
                    }}
                    stopTask={(id) => {
                        this.showStopTask(id)
                    }}
                />

                <SweetAlert
                    show={this.state.stopTask}
                    title="Do you want to stop this task?"
                    text=""
                    type={"warning"}
                    showCancelButton={true}
                    confirmButtonText={"Yes"}
                    confirmButtonColor={"#3085d6"}
                    cancelButtonColor={"#d33"}
                    onConfirm={() => this.stopTask()}
                />


                <SweetAlert
                    show={this.state.approveEmail}
                    title="Do you want to approve this email?"
                    text=""
                    type={"warning"}
                    showCancelButton={true}
                    confirmButtonText={"Yes"}
                    confirmButtonColor={"#3085d6"}
                    cancelButtonColor={"#d33"}
                    onConfirm={() => this.approveTaskEmail()}
                />

                <Modal
                    isOpen={this.state.modalEditEmailShow}
                    backdrop="static"
                    id="modalUpdPublish"
                    size="lg"
                >
                    <ModalHeader toggle={() => { this.toggleModal('modalEditEmailShow', false) }}>
                        Edit e-mail
					</ModalHeader>
                    <ModalBody>
                        <textarea className="form-control" rows="30" onChange={(e) => this.setState({ taskEmailHtml: e.target.value })} >{this.state.taskEmailHtml}</textarea>
                    </ModalBody>
                    <ModalFooter className="text-right">
                        <Button type="button" className="btn btn-primary" onClick={() => { this.saveEmailHtml() }}>Save</Button>
                        <button type="button" className="btn btn-outline-dark cancel"
                            onClick={() => this.toggleModal('modalEditEmailShow', false)}>Close</button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default OnDemandTasks;
