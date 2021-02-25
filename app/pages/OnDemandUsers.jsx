
var React = require('react');
import {Controller} from '../controllers/Controller.jsx';
import Table from '../components/Table.jsx';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";


class OnDemandUsers extends React.Component {
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
        };

        this.sourcesHashMap = {}
        this.users = [];
        this.fields = [

            {title: "Name", name: "name"},
            {title: "email", name: "email"},
            // {title: "Tasks", name: "task_count"},
            {title: "Tasks", name: "tasks", map: (value) => {
                    if (value) {
                        let all_task_count = value.length
                        let successFiniched_task_count = value.filter(task => task.status.name === "SuccessFinished").length
                        let errorFiniched_task_count = value.filter(task => task.status.name === "ErrorFinished").length
                        return (<span>{all_task_count} / <span className={"text-success"}>{successFiniched_task_count}</span> / <span className={"text-danger"}>{errorFiniched_task_count}</span></span>)
                    } else {
                        return (<span>0 / <span className={"text-success"}>0</span> / <span className={"text-danger"}>0</span></span>)
                    }
                }},
            {
                title: "Created", name: "createdAt", map: (value) => {
                    if (value) {
                        return moment(value).format("MM/DD/YYYY HH:mm")
                    } else {
                        return ''
                    }
                }
            },

        ];

        this.filters = {
            // closed: {
            //   type: "select",
            //   name: "closed",
            //   values: [
            //     {label: "All", value: ""},
            //     {label: "Closed", value: true},
            //     {label: "Actual", value: false}
            //   ]
            // },
            // client_id: {
            //   type: "select",
            //   name: "client_id",
            //   values: []
            // }
        };


        this.table = React.createRef();
    }


    componentDidMount() {

    }

    textModal(txt) {
        this.setState({txtModal: txt});
    }

    render() {
        return (
            <div className="position-relative h-100">
                <h2 className="pb-3 d-flex justify-content-between align-items-center">
                    On Demand Users

                    <div className="d-flex justify-content-end align-items-center">

                    </div>
                </h2>

                <Table
                    id="all-all"
                    fields={this.fields}
                    filtersColumn={''}
                    limit="20"
                    page="0"
                    change={this.state.reloadTable}
                    ref={this.table}
                    // url="http://127.0.0.1:1166/ondemand/users"
                    url="https://api.optimargin.com/ondemand/users"
                    source={(url, page, limit, filters) => Controller.getUpdts(url, page, limit, filters)}
                />


            </div>
        );
    }
}

export default OnDemandUsers;
