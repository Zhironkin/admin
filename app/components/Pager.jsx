import React from 'react';
import PropTypes from 'prop-types';
import {FetchUtils} from './../utils/FetchUtils';
import {Link} from 'react-router-dom';

export class Pager extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick(page) {
    const {onChange} = this.props;

    if (onChange)
      setTimeout(() => onChange(page));
  }

  renderPages(pagerData, itemsCount, pagesCount) {
    const pages = [];

    var startPage, endPage;

    if (pagesCount <= 10) {
      startPage = 0;
      endPage = pagesCount - 1;
    } else {
      startPage = Math.max(0, pagerData.page - 4);
      endPage = startPage + 9;
      if (endPage > (pagesCount - 1))
        endPage = pagesCount - 1;
    }

    if (startPage > 0) {
      pages.push(
        <li key={startPage - 1} className="page-item m-5">
          ...
        </li>
      );
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <li key={page} className={'page-item ' + (page === pagerData.page ? 'active' : '')}>
          <Link
            to={{pathname: '', hash: FetchUtils.getPageSearch(page)}}
            className="page-link"
            onClick={() => this.onClick(page)}
          >
            {page + 1}
          </Link>
        </li>);
    }

    if (endPage < pagesCount - 1) {
      pages.push(
        <li key={endPage + 1} className="page-item m-5">
          ...
        </li>
      );
    }

    return pages;
  }

  render() {
    const {itemsCount} = this.props;
    const pagerData = FetchUtils.getPagerData();
    const pagesCount = Math.ceil(itemsCount / pagerData.limit);

    return <div className="row m-20">
      <div className="col-5">
        {itemsCount ? <div>
            {/*<span>Показаны записи с </span>*/}
            {/*<span>{pagerData.page * pagerData.limit + 1}</span>*/}
            {/*<span> по </span>*/}
            {/*<span>{Math.min((+pagerData.page + 1) * pagerData.limit, itemsCount)}</span>*/}
            {/*<span> из </span>*/}
            {/*<span>{itemsCount}</span>*/}
          </div>
          : <div>
            No results
          </div>}
      </div>
      <div className="col flexbox justify-content-end">
        {itemsCount && <ul className="pagination">
          <li className={'page-item previous ' + (pagerData.page === 0 ? 'disabled' : '')}>
            <Link
              to={{pathname: '', hash: FetchUtils.getPageSearch(pagerData.page - 1)}}
              className="page-link"
              onClick={() => this.onClick(pagerData.page - 1)}
            >
              Prev
            </Link>
          </li>
          {this.renderPages(pagerData, itemsCount, pagesCount)}
          <li className={'page-item next ' + (pagerData.page === (pagesCount - 1) ? 'disabled' : '')}>
            <Link
              to={{pathname: '', hash: FetchUtils.getPageSearch(pagerData.page + 1)}}
              className="page-link"
              onClick={() => this.onClick(pagerData.page + 1)}
            >
              Next
            </Link>
          </li>
        </ul>}
      </div>
    </div>;
  }
}

Pager.propTypes = {
  itemsCount: PropTypes.number,
  onChange: PropTypes.func.isRequired
};
