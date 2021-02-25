import React from 'react';
import PropTypes from 'prop-types';
import IcomoonReact from 'icomoon-react';
import iconSet from './../assets/selection.json';

const Icon = (props) => {
  const { color, size, icon } = props;
  return <IcomoonReact iconSet={iconSet} color={color} size={size} icon={icon} />;
};

Icon.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Icon.defaultProps = {
  color: '#f00',
  size: '100%',
};

export default Icon;