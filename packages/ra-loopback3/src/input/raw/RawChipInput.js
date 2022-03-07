/**
 * Notice: Some code was adapted from Material-UI's text field.
 *         Copyright (c) 2014 Call-Em-All (https://github.com/callemall/material-ui)
 */
import React from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import withStyles from '@material-ui/core/styles/withStyles';
import blue from '@material-ui/core/colors/blue';
import cx from 'classnames';

const styles = theme => {
  return {
    root: {},
    chipContainer: {
      cursor: 'text',
      marginBottom: -2,
      minHeight: 40,
      '&$labeled': {
        marginTop: 18,
      },
      marginTop: theme.spacing(3),
    },
    labelShrink: {
      top: 0,
    },
    labeled: {},
    helperText: {
      marginBottom: -20,
    },
    error: {
      '&:after': {
        backgroundColor: theme.palette.error.A400,
        transform: 'scaleX(1)', // error is always underlined in red
      },
    },
    chip: {
      margin: '0 8px 8px 0',
      float: 'left',
    },
  };
};
// eslint-disable-next-line react/prop-types
export const defaultChipRenderer = ({ text, isFocused, isDisabled, handleClick, handleDelete, className }, key) => (
  <Chip
    key={key}
    className={className}
    style={{ pointerEvents: isDisabled ? 'none' : undefined, backgroundColor: isFocused ? blue[300] : undefined }}
    onClick={handleClick}
    onDelete={handleDelete}
    label={text}
  />
);

class RawChipInput extends React.Component {
  state = {
    isFocused: false,
    errorText: undefined,
    isClean: true,
    chips: [],
    focusedChip: null,
    inputValue: '',
  };

  constructor(props) {
    super(props);
    if (props.defaultValue) {
      this.state.chips = props.defaultValue;
    }
  }

  componentWillUnmount() {
    clearTimeout(this.inputBlurTimeout);
  }

  componentDidMount() {
    // const handleKeyDown = this.autoComplete.handleKeyDown
    // this.autoComplete.handleKeyDown = (event) => {
    //   const {newChipKeyCodes} = this.props
    //   if (newChipKeyCodes.indexOf(event.keyCode) >= 0 && event.target.value) {
    //     event.preventDefault()
    //     this.handleAddChip(event.target.value)
    //     this.autoComplete.forceUpdate()
    //   } else {
    //     handleKeyDown(event)
    //   }
    // }
    // this.autoComplete.handleItemTouchTap = (event, child) => {
    //   const dataSource = this.autoComplete.props.dataSource
    //   const index = parseInt(child.key, 10)
    //   const chosenRequest = dataSource[index]
    //   this.handleAddChip(chosenRequest)
    //   this.autoComplete.forceUpdate()
    //   this.autoComplete.close()
    //   setTimeout(() => this.focus(), 1)
    // }
    // // force update autocomplete to ensure that it uses the new handlers
    // this.autoComplete.forceUpdate()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.disabled) {
      this.setState({ focusedChip: null });
    }
  }

  /**
   * Blurs this component.
   * @public
   */
  blur() {
    if (this.input) this.actualInput.blur();
  }

  /**
   * Focuses this component.
   * @public
   */
  focus = () => {
    this.actualInput.focus();
    // this.getInputNode().focus()
    // if (this.props.openOnFocus && !this.props.disabled) {
    // }
    if (this.state.focusedChip != null) {
      this.setState({ focusedChip: null });
    }
  };

  handleInputBlur = event => {
    event.preventDefault();
    // eslint-disable-next-line react/prop-types
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
    this.setState({ isFocused: false });
    if (this.state.focusedChip != null) {
      this.setState({ focusedChip: null });
    }
    if (this.props.blurBehavior === 'add') {
      // Lets assume that we only want to add the existing content as chip, when
      // another event has not added a chip within 200ms .
      // e.g. onSelection Callback in Autocomplete case
      let numChipsBefore = (this.props.value || this.state.chips).length;
      let value = event.target.value;
      this.inputBlurTimeout = setTimeout(() => {
        let numChipsAfter = (this.props.value || this.state.chips).length;
        if (numChipsBefore === numChipsAfter) {
          this.handleAddChip(value);
        } else {
          this.clearInput();
        }
      }, 150);
    } else if (this.props.blurBehavior === 'clear') {
      this.clearInput();
    }

    // A momentary delay is required to support openOnFocus. We must give time for the autocomplete
    // menu to close before checking the current status. Otherwise, tabbing off the input while the
    // menu is open results in the input keeping its focus styles. Note that the ref might not be set
    // yet, so this.autocomplete might be null.
    // setTimeout(() => {
    //   if (this.autoComplete && (!this.autoComplete.state.open || this.autoComplete.requestsList.length === 0)) {
    //     if (this.props.clearOnBlur) {
    //       this.clearInput()
    //     }
    //     this.setState({ isFocused: false })
    //   }
    // }, 0)
  };

  handleInputFocus = event => {
    this.setState({ isFocused: true });
    // eslint-disable-next-line react/prop-types
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleKeyDown = event => {
    const { focusedChip } = this.state;
    this.setState({ keyPressed: false, preventChipCreation: false });
    if (this.props.newChipKeyCodes.indexOf(event.keyCode) >= 0) {
      event.preventDefault();
      this.handleAddChip(event.target.value);
    } else if (event.keyCode === 8 || event.keyCode === 46) {
      if (event.target.value === '') {
        const chips = this.props.value || this.state.chips;
        if (focusedChip == null && event.keyCode === 8) {
          this.setState({ focusedChip: chips.length - 1 });
        } else if (focusedChip != null) {
          const chips = this.props.value || this.state.chips;
          const value = chips[focusedChip];
          this.handleDeleteChip(value, focusedChip);
          if (event.keyCode === 8 && focusedChip > 0) {
            this.setState({ focusedChip: focusedChip - 1 });
          } else if (event.keyCode === 46 && focusedChip <= chips.length - 1) {
            this.setState({ focusedChip });
          }
        }
      }
    } else if (event.keyCode === 37) {
      const chips = this.props.value || this.state.chips;
      if (focusedChip == null && event.target.value === '' && chips.length) {
        return this.setState({ focusedChip: chips.length - 1 });
      }
      if (focusedChip != null && focusedChip > 0) {
        this.setState({ focusedChip: focusedChip - 1 });
      }
    } else if (event.keyCode === 39) {
      const chips = this.props.value || this.state.chips;
      if (focusedChip != null && focusedChip < chips.length - 1) {
        this.setState({ focusedChip: focusedChip + 1 });
      } else {
        this.setState({ focusedChip: null });
      }
    } else {
      this.setState({ focusedChip: null });
    }
  };

  handleKeyUp = event => {
    if (
      !this.state.preventChipCreation &&
      this.props.newChipKeyCodes.indexOf(event.keyCode) > 0 &&
      this.state.keyPressed
    ) {
      this.clearInput();
    } else {
      this.setState({ inputValue: event.target.value });
    }
  };
  // eslint-disable-next-line no-unused-vars
  handleKeyPress = event => {
    this.setState({ keyPressed: true });
  };

  handleUpdateInput = e => {
    let value = this.props.inputNormalize ? this.props.inputNormalize(e.target.value) : e.target.value;
    this.setState({ inputValue: value });

    if (this.props.onUpdateInput) {
      // this.props.onUpdateInput(searchText, dataSource, params)
      this.props.onUpdateInput(value);
    }
  };

  handleAddChip(chip) {
    if (this.props.onBeforeAdd && !this.props.onBeforeAdd(chip)) {
      return this.setState({ preventChipCreation: true });
    }
    this.setState({ inputValue: '' });
    const chips = this.props.value || this.state.chips;

    if (this.props.dataSourceConfig) {
      if (typeof chip === 'string') {
        chip = {
          [this.props.dataSourceConfig.text]: chip,
          [this.props.dataSourceConfig.value]: chip,
        };
      }

      if (
        this.props.allowDuplicates ||
        !chips.some(c => c[this.props.dataSourceConfig.value] === chip[this.props.dataSourceConfig.value])
      ) {
        if (this.props.value && this.props.onAdd) {
          this.props.onAdd(chip);
        } else {
          this.setState({ chips: [...this.state.chips, chip] });
          if (this.props.onChange) {
            this.props.onChange([...this.state.chips, chip]);
          }
        }
      }
    } else if (chip.trim().length > 0) {
      if (this.props.allowDuplicates || chips.indexOf(chip) === -1) {
        if (this.props.value && this.props.onAdd) {
          this.props.onAdd(chip);
        } else {
          this.setState({ chips: [...this.state.chips, chip] });
          if (this.props.onChange) {
            this.props.onChange([...this.state.chips, chip]);
          }
        }
      }
    }
  }

  handleDeleteChip(chip, i) {
    if (this.props.value) {
      if (this.props.onDelete) {
        this.props.onDelete(chip, i);
      }
    } else {
      const chips = this.state.chips.slice();
      const changed = chips.splice(i, 1); // remove the chip at index i
      if (changed) {
        let focusedChip = this.state.focusedChip;
        if (this.state.focusedChip === i) {
          focusedChip = null;
        } else if (this.state.focusedChip > i) {
          focusedChip = this.state.focusedChip - 1;
        }
        this.setState({ chips, focusedChip });
        if (this.props.onChange) {
          this.props.onChange(chips);
        }
      }
    }
  }

  /**
   * Clears the text field for adding new chips.
   * @public
   */
  clearInput() {
    this.setState({ inputValue: '' });
  }

  /**
   * Sets a reference to the AutoComplete instance.
   *
   * Using a bound class method here to set `autoComplete` to avoid it being set
   * to null by an inline ref callback.
   *
   * See [Issue #71](https://github.com/TeamWertarbyte/material-ui-chip-input/issues/71)
   *
   * @param {Object} autoComplete - The AutoComplete DOM element or null
   */
  setInputRef = input => {
    this.input = input;
  };

  render() {
    const {
      allowDuplicates, // eslint-disable-line no-unused-vars
      blurBehavior,
      children, // eslint-disable-line react/prop-types
      chipRenderer = defaultChipRenderer,
      classes, // eslint-disable-line react/prop-types
      className, // eslint-disable-line react/prop-types
      defaultValue = [], // eslint-disable-line no-unused-vars
      dataSource,
      dataSourceConfig,
      disabled,
      disableUnderline, // eslint-disable-line react/prop-types
      error, // eslint-disable-line react/prop-types
      filter, // eslint-disable-line react/prop-types
      FormHelperTextProps, // eslint-disable-line react/prop-types
      fullWidth,
      fullWidthInput,
      helperText, // eslint-disable-line react/prop-types
      helperTextClassName, // eslint-disable-line react/prop-types
      id, // eslint-disable-line react/prop-types
      inputRef,
      InputLabelProps, // eslint-disable-line react/prop-types
      label, // eslint-disable-line react/prop-types
      labelClassName, // eslint-disable-line react/prop-types
      newChipKeyCodes, // eslint-disable-line no-unused-vars
      onBeforeAdd,
      onAdd, // eslint-disable-line no-unused-vars
      onDelete, // eslint-disable-line no-unused-vars
      onBlur, // eslint-disable-line no-unused-vars
      onChange, // eslint-disable-line no-unused-vars
      onFocus, // eslint-disable-line no-unused-vars
      onUpdateInput, // eslint-disable-line
      // openOnFocus, // eslint-disable-line
      placeholder, // eslint-disable-line react/prop-types
      required, // eslint-disable-line react/prop-types
      rootRef, // eslint-disable-line react/prop-types
      value,
      ...other
    } = this.props;

    const chips = this.props.value || this.state.chips;
    // const autoCompleteData = dataSourceConfig
    //   ? (dataSource || []).filter((value) => !chips.some((c) => c[dataSourceConfig.value] === value[dataSourceConfig.value]))
    //   : (dataSource || []).filter((value) => chips.indexOf(value) < 0)

    // const actualFilter = openOnFocus ? (search, key) => (search === '' || filter(search, key)) : filter

    const hasInput = (this.props.value || this.state.chips).length > 0 || this.state.inputValue.length > 0;
    // const showPlaceholder = placeholder && !hasInput
    const shrinkFloatingLabel = label != null && (hasInput || this.state.isFocused);

    return (
      <div
        className={cx(classes.chipContainer, {
          [classes.inkbar]: !disableUnderline,
          [classes.focused]: this.state.isFocused,
          [classes.underline]: !disableUnderline,
          [classes.disabled]: disabled,
          [classes.labeled]: label != null,
          [classes.error]: error,
        })}
      >
        {chips.map((tag, i) => {
          const value = dataSourceConfig ? tag[dataSourceConfig.value] : tag;
          return chipRenderer(
            {
              value,
              text: dataSourceConfig ? tag[dataSourceConfig.text] : tag,
              chip: tag,
              isDisabled: !!disabled,
              isFocused: this.state.focusedChip === i,
              handleClick: () => this.setState({ focusedChip: i }),
              handleDelete: () => this.handleDeleteChip(value, i),
              className: classes.chip,
            },
            i
          );
        })}
        <Input
          ref={this.setInputRef}
          classes={{ input: classes.input, root: classes.inputRoot }}
          id={id}
          value={this.state.inputValue}
          onChange={this.handleUpdateInput}
          onKeyDown={this.handleKeyDown}
          onKeyPress={this.handleKeyPress}
          onKeyUp={this.handleKeyUp}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          inputRef={ref => {
            this.actualInput = ref;
            inputRef(ref);
          }}
          disabled={disabled}
          disableUnderline
          fullWidth={fullWidthInput}
          placeholder={!hasInput && (shrinkFloatingLabel || label == null) ? placeholder : null}
          {...other}
        />
      </div>
    );
  }
}

RawChipInput.propTypes = {
  style: PropTypes.object,
  chipContainerStyle: PropTypes.object,
  dataSourceConfig: PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
  disabled: PropTypes.bool,
  defaultValue: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.array,
  onBeforeAdd: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  dataSource: PropTypes.array,
  onUpdateInput: PropTypes.func,
  // openOnFocus: PropTypes.bool,
  chipRenderer: PropTypes.func,
  newChipKeyCodes: PropTypes.arrayOf(PropTypes.number),
  allowDuplicates: PropTypes.bool,
  fullWidth: PropTypes.bool,
  fullWidthInput: PropTypes.bool,
  inputRef: PropTypes.func,
  blurBehavior: PropTypes.oneOf(['clear', 'add', 'ignore']),
  inputNormalize: PropTypes.func,
  onBlur: PropTypes.any,
  onFocus: PropTypes.any,
  classes: PropTypes.object,
};

RawChipInput.defaultProps = {
  newChipKeyCodes: [13],
  blurBehavior: 'add',
  allowDuplicates: false,
  inputRef: () => {},
};

export default withStyles(styles)(RawChipInput);
