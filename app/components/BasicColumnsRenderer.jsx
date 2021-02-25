import React from 'react';
import {Button} from 'reactstrap';
import Icon from './../components/Icon.jsx';

export const basicColumnsRenderer = (rowData,
                                     dataKey,
                                     rowIndex,
                                     editHandler,
                                     deleteHandler,
                                     isEditDisabled,
                                     isDeleteDisabled) => {
    // console.log('rowData,dataKey,rowData[dataKey]')
    // console.log(rowData,dataKey,rowData[dataKey])
    if (dataKey === 'row_index')
        return rowIndex + 1;

    if (dataKey === 'grid_actions')
        return <div className="flexbox justify-content-start">
            <Button
                color="warning-outline"
                size="sm"
                className="btn-warning"
                onClick={editHandler}
                disabled={isEditDisabled}
            >
              <Icon color="#000" size={12} icon="edit" />
            </Button>
            <Button
                color="danger-outline"
                size="sm"
                className="btn-danger ml-1"
                onClick={deleteHandler}
                disabled={isDeleteDisabled}
            >
              <Icon color="#fff" size={12} icon="remove" />
            </Button>
        </div>;

    return rowData[dataKey];
};
