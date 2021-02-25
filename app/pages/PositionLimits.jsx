import {ConfirmModal} from "../components/ConfirmModal.jsx";

var React = require('react');
import {Grid} from "../components/Grid.jsx";
import {Controller} from '../controllers/Controller.jsx';
import {Pager} from "../components/Pager.jsx";
import {basicColumnsRenderer} from "../components/BasicColumnsRenderer.jsx";
import LoaderMini from "../components/LoaderMini.jsx";
import {Button, Input} from "reactstrap";
import Icon from "../components/Icon.jsx";
import {FetchUtils} from "../utils/FetchUtils";
import {relativeTimeRounding} from "moment";


class PositionLimits extends React.Component {
    editFormEl;

    constructor(props) {
        super(props);
        this.state = {

            loaderMini: false,
            data: [],
            itemsCount: 0,

            isEditModalOpen: false,
            rowToEditRow: false,
            editError: null,

            isConfirmDeleteOpen: false,
            rowsToDelete: null
        }

        // Controller.createPositionLimits({name: "Henry LD1 Fixed Price Future",
        //     type: "Futures",
        //     code: "H",
        //     group: "North American Financial Natural Gas",
        //     contractSize: 2500,
        //     unit: "MMBtu",
        //     legA: "H",
        //     legARatio: 1,
        //     legB: null,
        //     legBRatio: 0,
        //     spotLimitA: 4000,
        //     monthLimitA: 24000,
        //     allMonthsLimitA: 48000,
        //     spotLimitB: 0,
        //     monthLimitB: 0,
        //     allMonthsLimitB: 0,
        //     limitDay: -3});

        this.columns = [
            {title: "name", dataKey: "name"},
            {title: "type", dataKey: "type"},
            {title: "code", dataKey: "code"},
            {title: "group", dataKey: "group"},
            // {title: "contractSize", dataKey: "contractSize"},
            // {title: "unit", dataKey: "unit"},
            // {title: "legA", dataKey: "legA"},
            // {title: "legARatio", dataKey: "legARatio"},
            // {title: "legB", dataKey: "legB"},
            // {title: "legBRatio", dataKey: "legBRatio"},
            // {title: "spotLimitA", dataKey: "spotLimitA"},
            // {title: "monthLimitA", dataKey: "monthLimitA"},
            // {title: "allMonthsLimitA", dataKey: "allMonthsLimitA"},
            // {title: "spotLimitB", dataKey: "spotLimitB"},
            // {title: "monthLimitB", dataKey: "monthLimitB"},
            // {title: "allMonthsLimitB", dataKey: "allMonthsLimitB"},
            // {title: "limitDay", dataKey: "limitDay"},
            {title: "", dataKey: "grid_actions",},
        ];
    }

    componentDidMount() {
        this.init()
    }

    init() {
        this.setState({loaderMini: true});
        const pagerData = FetchUtils.getPagerData();

        Controller.getPositionLimits(pagerData.page, pagerData.limit)
            .then((result) => {
                if (result.data.success) {
                    this.setState({
                        loaderMini: false,
                        data: result.data.data,
                        itemsCount: result.data.found
                    });
                    console.log('>>>>', result);
                }
            })
            .catch((e) => {
                this.setState({loaderMini: false});
                console.log('error', e);
            });
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

    setRowToEdit(field, value) {
        const {rowToEditRow} = this.state;
        rowToEditRow[field] = value;
        this.setState(rowToEditRow);
    }

    renderTextField(name, selectedSwitch) {
        return <React.Fragment>
            <div className="form-group">
                <label>Name</label>
                <Input name="name" value={selectedSwitch && selectedSwitch.name} onChange={(event) => {
                    this.setRowToEdit(event.target.value);
                }}/>
            </div>
        </React.Fragment>
    }

    addModalRenderer() {
        let selectedSwitch = this.state.rowToEditRow;
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
        if (selectedSwitch && selectedSwitch.defaultPairings)
            selectedParings = selectedSwitch.defaultPairings.split(',');

        return <React.Fragment>
            {selectedSwitch && selectedSwitch._id && <Input type="hidden" name="id" value={selectedSwitch._id}/>}
            <div className="form-group">
                <label>Name</label>
                <Input name="name" value={selectedSwitch && selectedSwitch.name} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.name = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>Type</label>
                <Input name="type" value={selectedSwitch && selectedSwitch.type} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.type = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>Code</label>
                <Input name="code" value={selectedSwitch && selectedSwitch.code} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.code = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>Group</label>
                <Input name="group" value={selectedSwitch && selectedSwitch.group} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.group = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>exchange</label>
                <Input name="exchange" value={selectedSwitch && selectedSwitch.exchange} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.exchange = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>
            <div className="form-group">
                <label>contractSize</label>
                <Input name="contractSize" value={selectedSwitch && selectedSwitch.contractSize} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.contractSize = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>
            <div className="form-group">
                <label>Unit</label>
                <Input name="unit" value={selectedSwitch && selectedSwitch.unit} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.unit = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>nameEquivalentA</label>
                <Input name="legA" value={selectedSwitch && selectedSwitch.nameEquivalentA} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.nameEquivalentA = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>legA</label>
                <Input name="legA" value={selectedSwitch && selectedSwitch.legA} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.legA = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>legARatio</label>
                <Input name="legARatio" value={selectedSwitch && selectedSwitch.legARatio} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.legARatio = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>legB</label>
                <Input name="legB" value={selectedSwitch && selectedSwitch.legB} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.legB = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>nameEquivalentB</label>
                <Input name="legA" value={selectedSwitch && selectedSwitch.nameEquivalentB} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.nameEquivalentB = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>legBRatio</label>
                <Input name="legBRatio" value={selectedSwitch && selectedSwitch.legBRatio} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.legBRatio = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>spotLimitA</label>
                <Input name="spotLimitA" value={selectedSwitch && selectedSwitch.spotLimitA} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.spotLimitA = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>monthLimitA</label>
                <Input name="monthLimitA" value={selectedSwitch && selectedSwitch.monthLimitA} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.monthLimitA = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>allMonthsLimitA</label>
                <Input name="allMonthsLimitA" value={selectedSwitch && selectedSwitch.allMonthsLimitA}
                       onChange={(event) => {
                           const {rowToEditRow} = this.state;
                           rowToEditRow.allMonthsLimitA = event.target.value;
                           this.setState(rowToEditRow);
                       }}/>
            </div>

            <div className="form-group">
                <label>spotLimitB</label>
                <Input name="spotLimitB" value={selectedSwitch && selectedSwitch.spotLimitB} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.spotLimitB = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>monthLimitB</label>
                <Input name="monthLimitB" value={selectedSwitch && selectedSwitch.monthLimitB} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.monthLimitB = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

            <div className="form-group">
                <label>allMonthsLimitB</label>
                <Input name="allMonthsLimitB" value={selectedSwitch && selectedSwitch.allMonthsLimitB}
                       onChange={(event) => {
                           const {rowToEditRow} = this.state;
                           rowToEditRow.allMonthsLimitB = event.target.value;
                           this.setState(rowToEditRow);
                       }}/>
            </div>

            <div className="form-group">
                <label>limitDay</label>
                <Input name="limitDay" value={selectedSwitch && selectedSwitch.limitDay} onChange={(event) => {
                    const {rowToEditRow} = this.state;
                    rowToEditRow.limitDay = event.target.value;
                    this.setState(rowToEditRow);
                }}/>
            </div>

        </React.Fragment>
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

    onEditClick(rowIndex) {
        let rowData = this.state.data[rowIndex];
        this.setState({
            isEditModalOpen: true,
            rowToEditRow: Object.assign({}, rowData)
        });
    }

    hideAddModal() {
        this.setState({
            isEditModalOpen: false
        });
    }

    onAddClick() {
        this.setState({
            isEditModalOpen: true,
            rowToEditRow: {}
        });
    }

    onEditFormRef(editFormEl) {
        this.editFormEl = editFormEl;
    }

    async confirmDelete() {
        this.setState({
            loaderMini: true,
            isConfirmDeleteOpen: false
        });
        const {rowsToDelete} = this.state;
        try {
            await Controller.removePositionLimits(rowsToDelete._id);
        } catch (error) {
            console.log(error);
        }
        this.init();
    }


    async onSubmit(event) {
        event.preventDefault();
        const {rowToEditRow} = this.state;
        const isEdit = !!rowToEditRow._id;

        let formData = Object.assign({}, rowToEditRow);
        delete (formData._id);

        const validationError = this.validateForm ? this.validateForm(formData) : null;

        if (validationError) {
            this.setState({
                editError: validationError
            });

            return;
        }

        this.setState({
            loaderMini: true,
            editError: null
        });

        try {
            if (isEdit)
                await Controller.updatePositionLimits(rowToEditRow._id, formData);
            else
                await Controller.createPositionLimits(formData);
            this.hideAddModal();
        } catch (error) {
            console.log(error);

            this.setState({
                loaderMini: false
            });

            return;
        }

        this.init();
    }

    validateForm() {
        return false;
    }


    render() {
        return <div className="box">
            {this.state.loaderMini && <LoaderMini/>}
            <div className="box-header with-border">
                <div className="row">
                    <div className="col">
                        <h4 className="box-title">Position Limits</h4>
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
            <Grid
                data={this.state.data}
                columns={this.columns}
                cellRenderer={(...params) => {
                    return this.cellRenderer(...params)
                }}
            />

            <Pager itemsCount={this.state.itemsCount} onChange={this.init}/>


            <ConfirmModal
                isOpen={this.state.isEditModalOpen}
                size="lg"
                title={!!this.state.rowToEditRow._id ? 'Edit position limits' : 'Add new position limits'}
                confirmTitle={!!this.state.rowToEditRow._id ? 'Edit' : 'Add'}
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
                title={'Delete Position Limit'}
                confirmTitle="Delete"
                discardTitle="Cancel"
                confirmBtnColor="danger"
                confirm={() => {
                    this.confirmDelete()
                }}
                discard={() => {
                    this.hideConfirmDelete()
                }}
            >
                Are you sure to delete this position
                limit <b>{this.state.rowsToDelete && this.state.rowsToDelete.name}</b>?
            </ConfirmModal>
        </div>

    }
}


export default PositionLimits;