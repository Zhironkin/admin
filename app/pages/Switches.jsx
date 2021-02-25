var React = require('react');
import {Controller} from '../controllers/Controller.jsx';
import {FetchUtils} from './../utils/FetchUtils';

import Icon from './../components/Icon.jsx';

import {Button, Input} from 'reactstrap';

import {ConfirmModal} from '../components/ConfirmModal.jsx';
import {Grid} from '../components/Grid.jsx';
import {Pager} from '../components/Pager.jsx';
import {basicColumnsRenderer} from './../components/BasicColumnsRenderer.jsx';
import Select from 'react-select'

class Switches extends React.Component {
  editFormEl;

  constructor(props) {
    super(props);

    this.columns = [
      {title: "name", dataKey: "name"},
      {title: "sideA", dataKey: "sideA"},
      {title: "sideB", dataKey: "sideB"},
      {title: "Details", dataKey: "Details"},
      {title: "Sorting", dataKey: "sort"},
      {title: "Type", dataKey: "type"},
      {title: "", dataKey: "grid_actions",},
    ];
    this.state = {
      data: [],
      all_switches: [],
      itemsCount: 0,
      selectedRow: {},
      rowsToDelete: null,
      isEditModalOpen: false,
      isLoading: true,
      isConfirmDeleteOpen: false,
      error: null,
      editError: null
    };
  }

  cellRenderer(rowData, dataKey, rowIndex) {
    return basicColumnsRenderer(
      rowData,
      dataKey,
      rowIndex,
      () => {
        this.onEditClick(rowIndex);
      },
      () => {
        this.deleteRows(rowData)
      },
      false,
      false
    );

  }

  onEditFormRef(editFormEl) {
    this.editFormEl = editFormEl;
  }

  onAddClick() {
    this.setState({
      isEditModalOpen: true,
      selectedRow: {}
    });
  }

  async onSubmit(event) {
    event.preventDefault();
    const {selectedRow} = this.state;
    const isEdit = !!selectedRow._id;

    let formData = this.unPrepareSelectedRow(selectedRow);

    const validationError = this.validateForm ? this.validateForm(formData) : null;

    if (validationError) {
      this.setState({
        editError: validationError
      });

      return;
    }

    this.setState({
      isLoading: true,
      editError: null
    });

    try {
      if (isEdit)
        await Controller.editSwitch(selectedRow._id, formData);
      else
        await Controller.addSwitch(formData);
      this.hideAddModal();
    } catch (error) {
      console.log(error);

      this.setState({
        isLoading: false
      });

      return;
    }

    this.init();
  }

  validateForm() {
    return false;
  }

  hideAddModal() {
    this.setState({
      isEditModalOpen: false
    });
  }

  onEditClick(rowIndex) {
    let rowData = this.state.data[rowIndex];
    this.setState({
      isEditModalOpen: true,
      selectedRow: this.prepareSelectedRow(rowData)
    });
  }

  prepareSelectedRow(rowData) {
    let months = [];
    if (rowData.months != undefined)
      for (let key in rowData.months) {
        rowData.months[key].month = key;
        months.push(rowData.months[key]);
      }
    return Object.assign({}, rowData, {months});
  }

  unPrepareSelectedRow(rowData) {
    let months = {};
    if (rowData.months != undefined && rowData.months.length > 0)
      rowData.months.forEach((item, index) => {
        months[item.month] = item;
      });
    let ev = Object.assign({}, rowData, {months});
    delete(ev._id);
    if (ev.visibleOnSw == undefined || !ev.visibleOnSw)
      ev.visibleOnSw = false;

    return ev;
  }

  deleteRows(rowsToDelete) {
    this.setState({
      isConfirmDeleteOpen: true,
      rowsToDelete: rowsToDelete
    });
  }

  hideConfirmDelete() {
    this.setState({
      isConfirmDeleteOpen: false,
      rowsToDelete: null
    });
  }

  async confirmDelete() {
    this.setState({
      isLoading: true,
      isConfirmDeleteOpen: false
    });

    const {rowsToDelete} = this.state;

    try {

      await Controller.removeSwitch(rowsToDelete._id);

    } catch (error) {
      console.log(error);
    }

    this.init();
  }

  async init() {
    const {initFilter} = this.props;

    this.setState({
      isLoading: true,
      error: null
    });

    const pagerData = FetchUtils.getPagerData();
    console.log('pagerData',pagerData)

    try {
      const responseJson = await Controller.getSwitches('https://api.optimargin.com/Switches', pagerData.page, pagerData.limit);
      const all_switches = await Controller.getSwitches('https://api.optimargin.com/Switches');

      const pagesCount = Math.ceil(responseJson.found / pagerData.limit);
      this.setState({
        data: responseJson.data.data,
        all_switches: all_switches.data.data,
        itemsCount: responseJson.data.found,
        error: responseJson.found > 0 && pagerData.page >= pagesCount ? 'Wrong page index' : null
      });
    } catch (error) {
      console.log(error);
    }

    this.setState({
      isLoading: false
    });
  }

  showLoader() {
    this.setState({
      isLoading: true
    });
  }

  hideLoader() {
    this.setState({
      isLoading: false
    });
  }

  updateSelectedRow(selectedRow) {
    this.setState({
      selectedRow
    });
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.redirectUrl && this.state.redirectUrl)
      this.setState({
        redirectUrl: null
      });
  }

  addModalRenderer() {
    let selectedSwitch = this.state.selectedRow;
    // console.log('selectedSwitch', selectedSwitch);
    let months_columns = [
      {title: "Month", dataKey: "month"},
      {title: "Bid price", dataKey: "bidp"},
      {title: "Ask price", dataKey: "askp"},
      {title: "Bid qty", dataKey: "bidq"},
      {title: "Ask qty", dataKey: "askq"},

      {title: "", dataKey: "delete_row",},
    ];

    let selectedParings = [];
    if (selectedSwitch && selectedSwitch.defaultPairings) {
      selectedSwitch.defaultPairings.split(',').map((item) => {
        selectedParings.push({value: item, label: item});
      });
    }

    let options = this.getOptions();

    return <React.Fragment>
      {selectedSwitch && selectedSwitch._id && <Input type="hidden" name="id" value={selectedSwitch._id}/>}
      <div className="form-group">
        <label>Name</label>
        <Input name="name" value={selectedSwitch && selectedSwitch.name} onChange={(event) => {
          const {selectedRow} = this.state;
          selectedRow.name = event.target.value;
          this.setState(selectedRow);
        }}/>
      </div>

      <div className="form-group">
        <label>sideA</label>
        <Input name="sideA" value={selectedSwitch && selectedSwitch.sideA} onChange={(event) => {
          const {selectedRow} = this.state;
          selectedRow.sideA = event.target.value;
          this.setState(selectedRow);
        }}/>
      </div>
      <div className="form-group">
        <label>sideB</label>
        <Input name="sideA" value={selectedSwitch && selectedSwitch.sideB} onChange={(event) => {
          const {selectedRow} = this.state;
          selectedRow.sideB = event.target.value;
          this.setState(selectedRow);
        }}/>
      </div>

      <div className="form-group">
        <label>Details</label>
        <Input name="Details" value={selectedSwitch && selectedSwitch.Details} onChange={(event) => {
          const {selectedRow} = this.state;
          selectedRow.Details = event.target.value;
          this.setState(selectedRow);
        }}/>
      </div>
      <div className="form-group">
        <label>Sorting</label>
        <Input name="Sorting" type="number" value={selectedSwitch && selectedSwitch.sort} onChange={(event) => {
          const {selectedRow} = this.state;
          selectedRow.sort = event.target.value;
          this.setState(selectedRow);
        }}/>
      </div>
      <div className="form-group">
        <label htmlFor={"type"}>Type</label>
        <Input name="type" id={"type"} type="select" value={selectedSwitch && selectedSwitch.type}
               onChange={(event) => {
                 const {selectedRow} = this.state;
                 selectedRow.type = event.target.value;
                 this.setState(selectedRow);
               }}>
          <option value={"simple"}>simple</option>
          <option value={"swap"}>swap</option>
          <option value={"options"}>options</option>
        </Input>
      </div>
      <div className="form-group">
        <label>Visible on sw.optimargin.com</label>
        <div class={"custom-control custom-checkbox mr-sm-2"}>
          <Input name="visibleOnSw"
                 type="checkbox"
                 id={"visibleOnSw"}
                 checked={selectedSwitch && selectedSwitch.visibleOnSw}
                 onChange={(event) => {
                   const {selectedRow} = this.state;
                   selectedRow.visibleOnSw = event.target.checked;
                   this.setState(selectedRow);
                 }}/>
          <label htmlFor={"visibleOnSw"}>visible</label>
        </div>
      </div>
      <div className="form-group">
        <label for={"defaultPairings"}>defaultPairing</label>
        <Select options={options} isMulti="true" value={selectedParings} onChange={(options) => {
          let result = [];
          options && options.map((item) => {
            result.push(item.value);
          });
          const {selectedRow} = this.state;
          selectedRow.defaultPairings = result.join(',');
          this.setState(selectedRow);
        }}/>
      </div>
      <Grid
        data={this.state.selectedRow.months || []}
        columns={months_columns}
        cellRenderer={(...params) => {
          return this.cellRendererMonths(...params)
        }}
      />
      <button type="button" className="btn btn-success" onClick={() => this.addMonth()}>
        <Icon color="#fff" size={10} icon="add"/> Add
      </button>

    </React.Fragment>
  }

  getOptions() {
    let options = [];
    this.state.all_switches.map(item => {
      let value = item.sideA + '|' + item.sideB;
      options.push({value: value, label: value});
    });
    return [...new Set(options)];
  }

  removeMonth(index) {
    let selectedRow = this.state.selectedRow;
    selectedRow.months.splice(index, 1);
    this.setState({selectedRow});
    return false;
  }

  addMonth() {
    let selectedRow = this.state.selectedRow;
    let newmonth = false;
    if (selectedRow.months != undefined && selectedRow.months) {
      let a = Object.keys(selectedRow.months).sort().pop();
      if (a != undefined) {
        var newmonths = selectedRow.months[Object.keys(selectedRow.months).sort().pop()];
        let mont = false;
        if (newmonths.month)
          mont = newmonths.month;

        if (mont)
          newmonth = parseInt(mont) + 1;

      }
    }
    else selectedRow.months = [];

    if (newmonth === false) {
      let dtime = new Date();
      let dm = dtime.getMonth() + 1;
      if (dm < 10) dm = '0' + dm;
      newmonth = dtime.getFullYear() + '' + dm;
    }

    selectedRow.months.push({'month': newmonth});
    this.setState(selectedRow);
    return false;
  }

  cellRendererMonths(rowData, dataKey, rowIndex) {

    if (dataKey == 'delete_row') {
      return <button type="button" className="btn btn-danger btn-danger-outline remove-tr" onClick={() => this.removeMonth(rowIndex)}>
          <Icon color="#fff" size={10} icon="close"/>
        </button>
      ;
    }

    if (dataKey == 'bidp') {
      return <Input type="text" className="form-control" value={rowData.bid && rowData.bid.price} onChange={(event) => {
        const {selectedRow} = this.state;
        if (selectedRow.months[rowIndex].bid == undefined)
          selectedRow.months[rowIndex].bid = {'price': '', 'quantity' : ''};
        selectedRow.months[rowIndex].bid.price = event.target.value;
        this.setState(selectedRow);
      }}/>
    }
    if (dataKey == 'askp') {
      return <Input type="text" className="form-control" value={rowData.ask && rowData.ask.price} onChange={(event) => {
        const {selectedRow} = this.state;
        if (selectedRow.months[rowIndex].ask == undefined)
          selectedRow.months[rowIndex].ask = {'price': '', 'quantity' : ''};
        selectedRow.months[rowIndex].ask.price = event.target.value;
        this.setState(selectedRow);
      }}/>
    }
    if (dataKey == 'bidq') {
      return <Input type="text" className="form-control" value={rowData.bid && rowData.bid.quantity} onChange={(event) => {
        const {selectedRow} = this.state;
        if (selectedRow.months[rowIndex].bid == undefined)
          selectedRow.months[rowIndex].bid = {'price': '', 'quantity' : ''};
        selectedRow.months[rowIndex].bid.quantity = event.target.value;
        this.setState(selectedRow);
      }}/>
    }
    if (dataKey == 'askq') {
      return <Input type="text" className="form-control" value={rowData.ask && rowData.ask.quantity} onChange={(event) => {
        const {selectedRow} = this.state;
        if (selectedRow.months[rowIndex].ask == undefined)
          selectedRow.months[rowIndex].ask = {'price': '', 'quantity' : ''};
        selectedRow.months[rowIndex].ask.quantity = event.target.value;
        this.setState(selectedRow);
      }}/>
    }

    if (dataKey == 'month') {
      return <Input type="text" name={`month` + rowIndex} id={`month` + rowIndex} className="form-control" value={rowData[dataKey]}/>
    }

    return basicColumnsRenderer(
      rowData,
      dataKey,
      rowIndex,
      () => {
      },
      () => {
      },
      false,
      false
    );
  }


  render() {
    const addModalTitle = 'add switch';
    const editModalTitle = 'edit switch';

    return <div className="box">

      <div className="box-header with-border">
        <div className="row">
          <div className="col"><h4 className="box-title">Switches</h4>
            {/*<h6 className="box-subtitle">Switches subtiutle</h6>*/}
          </div>
          <div className="col-auto">
            <Button color="success" onClick={() => {
              this.onAddClick();
            }}>
              Add <Icon color="#fff" size={10} icon="add"/>
            </Button>
          </div>
        </div>
      </div>

      {this.state.error && <div className="box-body">
        <div className="flex-grow-1 alert bg-pale-warning mt-20 mb-20">
          {this.state.error}
        </div>
      </div>}

      <Grid
        data={this.state.data}
        columns={this.columns}
        cellRenderer={(...params) => {
          return this.cellRenderer(...params)
        }}
      />

      <Pager itemsCount={this.state.itemsCount} onChange={() => {return this.init()} }/>

      <ConfirmModal
        isOpen={this.state.isEditModalOpen}
        size="lg"
        title={!!this.state.selectedRow._id ? editModalTitle : addModalTitle}
        confirmTitle={!!this.state.selectedRow._id ? 'Edit' : 'Save'}
        discardTitle="Cancel"
        confirm={(event) => this.onSubmit(event)}
        discard={() => this.hideAddModal()}
      >
        <form ref={(...params) => {
          return this.onEditFormRef(...params);
        }}>
          {this.addModalRenderer()}
          {this.state.editError && <div className="flex-grow-1 alert bg-pale-warning mb-20">
            {this.state.editError}
          </div>}
        </form>
      </ConfirmModal>

      <ConfirmModal
        isOpen={this.state.isConfirmDeleteOpen}
        title={'Delete switch'}
        confirmTitle="Delete"
        discardTitle="Cancel"
        confirmBtnColor="danger"
        confirm={() => {this.confirmDelete() }}
        discard={() => {this.hideConfirmDelete() }}
      >
        {this.state.rowsToDelete && this.state.rowsToDelete.length > 1 ? 'Are you sure to delete selected switches?' : 'Are you sure to delete this switch?'}
      </ConfirmModal>

      {this.state.isLoading && <div className="overlay">
        <i className="fa fa-refresh fa-spin"/>
      </div>}
    </div>;
  }
}

export default Switches;
