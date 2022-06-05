import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import get from 'lodash/get';
import intersection from 'lodash/intersection';

const customIntersection = (array1, array2) => {
  const object1 = array1.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {});
  const intersectioned = intersection(
    array1.map(({ id }) => id),
    array2,
  );
  return intersectioned.map(matchedID => ({ id: matchedID, name: get(object1, matchedID) }));
};

const styles = () => ({
  formControl: {
    minWidth: 256,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
});

class CustomSelectArrayInput extends Component {
  render() {
    const { label, selectedValues, handleChange, handleDelete, classes, options } = this.props;
    return (
      <div>
        <FormControl className={classes.formControl} margin="normal">
          <InputLabel htmlFor="select-multiple-chip">{label}</InputLabel>
          <Select
            autoWidth
            multiple
            value={selectedValues}
            onChange={handleChange}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => {
              const selectedOptionsWithLabel = customIntersection(options, selected);
              return (
                <div className={classes.chips}>
                  {selectedOptionsWithLabel.map(({ id, name }) => (
                    <Chip key={id} label={name} className={classes.chip} onDelete={handleDelete(id)} />
                  ))}
                </div>
              );
            }}
            MenuProps={{ PaperProps: { style: { maxHeight: 48 * 4.5 + 8, width: 250 } } }}
          >
            {options.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
}

CustomSelectArrayInput.propTypes = {
  label: PropTypes.string,
  selectedValues: PropTypes.arrayOf(PropTypes.object),
  handleChange: PropTypes.func,
  handleDelete: PropTypes.func,
  classes: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.object),
};

export default withStyles(styles)(CustomSelectArrayInput);
