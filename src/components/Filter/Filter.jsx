import React from 'react';
import PropTypes from 'prop-types';

const Filter = ({ filter, setFilter }) => {
  return (
    <input
      type="text"
      value={filter}
      onChange={e => setFilter(e.target.value)}
      placeholder="Search contacts..."
    />
  );
};

Filter.propTypes = {
  filter: PropTypes.string,
  setFilter: PropTypes.func,
};

export default Filter;
