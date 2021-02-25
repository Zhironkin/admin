import Icon from "../components/Icon.jsx";

var React = require('react');
import {Controller} from '../controllers/Controller.jsx';
import Table from '../components/Table.jsx';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import ApexCharts from "apexcharts";


class Statistic extends React.Component {
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

      reloadTable: false,

      debug_i: false,
      debug_u: false,
    };

    this.sourcesHashMap = {}
    this.users = [];
    this.fields = [

      {title: "ClientId", name: "client_id"},
      {title: "DeviceId", name: "device_id"},
      {title: "Channels", name: "channels"},
      {title: "Targets", name: "targets"},//, map: (value) => value.split(',').map(v => <div>{v}</div>)},
      {title: "Current Version", name: "current_version"},
      {title: "Ip", name: "ip"},
      {
        title: "closed",
        name: "closed",
        map: (value => value ? <span className={"text-danger"}>closed</span> : <span className={"text-success"}>actual</span>)
      },
      {title: "Last activity", name: "ts"},
    ];

    this.filters = {
      closed: {
        type: "select",
        name: "closed",
        values: [
          {label: "All", value: ""},
          {label: "Closed", value: true},
          {label: "Actual", value: false}
        ]
      },
      client_id: {
        type: "select",
        name: "client_id",
        values: []
      }
    };


    this.table = React.createRef();
  }


  componentDidMount() {
    Controller.getList('https://api.optimargin.com/users/list', 0, 0)
      .then((result) => {
        if (result.data.success) {
          const users = [
            {
              label: 'All users',
              value: ''
            }
          ];
          result.data.data.map(item => {
            users.push({
              label: item.appid,
              value: item.appid,
              // channels: item.channels
            })
          });
          this.users = users;
          this.filters.client_id.values = users;
          this.setState({reloadTable: true})
        }
      })
      .catch((e) => {
        console.log('error', e);
        // this.setState({ loaderMini: false });
      });

    Controller.getSt('https://api.optimargin.com/clientStatistic', 0, 0, {closed: "false"})
        .then((result) => {
          if (result.data.success) {
            var versions_count = {};
            result.data.data.map(item => {
              if (!item.current_version) return;
              if (!versions_count[item.current_version]) versions_count[item.current_version] = 0;
              versions_count[item.current_version]++;
            });
            var versions_entries = Object.entries(versions_count);
            versions_entries.sort((a, b) => b[1]-a[1]);
            var options = {
              chart: {
                type: 'pie',
                height: '400px'
              },
              series: versions_entries.map((x)=>x[1]),
              labels: versions_entries.map((x)=>x[0]),
              dataLabels: {
                enabled: true,
                enabledOnSeries: undefined,
                formatter: function (value, { seriesIndex, dataPointIndex, w }) {
                  return w.config.labels[seriesIndex];
                },
              },
            }

            var chart = new ApexCharts(document.querySelector("#chart"), options);

            chart.render();
          }
        })
        .catch((e) => {
          console.log('error', e);
        });
  }

  textModal(txt) {
    this.setState({txtModal: txt});
  }

  render() {
    return (
      <div className="position-relative h-100">
        <h2 className="pb-3 d-flex justify-content-between align-items-center">
          Client Statistic

          <div className="d-flex justify-content-end align-items-center">

          </div>
        </h2>

        <div id="chart"></div>

        <Table
          id="all-all"
          fields={this.fields}
          filtersColumn={this.filters}
          limit="20"
          page="0"
          change={this.state.reloadTable}
          ref={this.table}
          url="https://api.optimargin.com/clientStatistic"
          source={(url, page, limit, filters) => Controller.getSt(url, page, limit, filters)}
        />


      </div>
    );
  }
}

export default Statistic;
