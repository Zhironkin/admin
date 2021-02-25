import React from 'react';
import PropTypes from 'prop-types';
import {Input} from 'reactstrap';

export class Grid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allChecked: false
        };
    }

    onSelectAllRows() {
        const {data, onAllRowsSelect} = this.props;
        const {allChecked} = this.state;

        data.forEach((rowData) => rowData.checked = !allChecked);

        if (onAllRowsSelect)
            onAllRowsSelect(!allChecked, !allChecked ? data : []);

        this.setState({
            allChecked: !allChecked
        });
    }

    onSelectRow(event, rowData, rowIndex) {
        rowData.checked = !rowData.checked;

        const {data, onRowSelect} = this.props;

        if (onRowSelect)
            onRowSelect(rowData, rowIndex, data.filter((rowData) => rowData.checked));

        this.forceUpdate();
    }

    onRowClick(event, rowData, rowIndex) {
        const tagName = event.target.tagName.toLowerCase();

        if (tagName === 'input' || tagName === 'label' || tagName === 'button')
            return;

        const {onRowClick} = this.props;

        if (onRowClick)
            onRowClick(rowData, rowIndex);
    }

    renderSelectColumnHeader() {
        const {allChecked} = this.state;

        return <div>
            <Input
                id={`select_all_checkbox`}
                type="checkbox"
                checked={allChecked}
                onClick={this.onSelectAllRows}
            />
            <label htmlFor={`select_all_checkbox`} className="grid-select-all-checkbox">&nbsp;</label>
        </div>;
    }

    renderSelectColumn(rowData, rowIndex) {
        return <div>
            <Input
                id={`select_checkbox_${rowIndex}`}
                type="checkbox"
                checked={rowData.checked}
                onClickCapture={(event) => this.onSelectRow(event, rowData, rowIndex)}
            />
            <label htmlFor={`select_checkbox_${rowIndex}`} className="grid-select-row-checkbox">&nbsp;</label>
        </div>;
    }

    componentWillReceiveProps(nextProps) {
        const {data} = this.props;
        const {allChecked} = this.state;

        if (nextProps.data !== data && allChecked)
            this.onSelectAllRows();
    }

    render() {
        const {data, columns, cellRenderer, onRowClick, className} = this.props;
        return <div className={`box-body ${className}`}>
            <div className="table-responsive">
                <table id="tickets" className="table mt-0 table-hover no-wrap table-striped grid-table"
                       data-page-size="10">
                    <thead>
                    <tr>
                        {columns.map((column, columnIndex) => {
                            return <th key={columnIndex}
                                       className={column.dataKey === 'grid_actions' ? 'grid-action-column' : ''}
                            >
                                {column.dataKey === 'grid_select'
                                    ? this.renderSelectColumnHeader()
                                    : column.title}
                            </th>;
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((rowData, rowIndex) => {
                        return <tr key={rowIndex} onClick={(event) => this.onRowClick(event, rowData, rowIndex)}>
                            {columns.map((column, columnIndex) => {
                                return <td key={columnIndex}>{
                                    column.dataKey === 'grid_select'
                                        ? this.renderSelectColumn(rowData, rowIndex)
                                        : cellRenderer
                                        ? cellRenderer(rowData, column.dataKey, rowIndex)
                                        : rowData[column.dataKey]
                                }</td>;
                            })}
                        </tr>;
                    })}
                    </tbody>
                </table>
            </div>
        </div>;
    }
}

Grid.propTypes = {
    data: PropTypes.array,
    columns: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        dataKey: PropTypes.string.isRequired
    })).isRequired,
    cellRenderer: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowSelect: PropTypes.func,
    onAllRowsSelect: PropTypes.func,
    className: PropTypes.string
};
