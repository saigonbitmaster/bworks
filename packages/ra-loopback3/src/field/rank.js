import React from 'react';
import PropTypes from 'prop-types';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';





const RankField = ({ source, record = {} }) => (
  <Rating
  name="customized-empty"
  defaultValue={0}
  value={record[source]}
  precision={0.5}
  emptyIcon={<StarBorderIcon fontSize="inherit" />}
/>
)

RankField.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};


export default RankField