import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { required, translate, ArrayInput, Button, NumberInput, DisabledInput, minValue } from 'ra-loopback3';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import { getFormValues, change } from 'redux-form';
import { connect } from 'react-redux';
import { AddCircleOutline as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';

const styles = theme => ({
  root: {
    paddingLeft: 16,
    marginBottom: 0,
    '& > li:last-child': {
      borderBottom: 'none',
    },
  },
  line: {
    display: 'flex',
    listStyleType: 'none',
    borderBottom: `solid 1px ${theme.palette.divider}`,
    [theme.breakpoints.down('xs')]: { display: 'block' },
    '&.fade-enter': {
      opacity: 0.01,
      transform: 'translateX(100vw)',
    },
    '&.fade-enter-active': {
      opacity: 1,
      transform: 'translateX(0)',
      transition: 'all 500ms ease-in',
    },
    '&.fade-exit': {
      opacity: 1,
      transform: 'translateX(0)',
    },
    '&.fade-exit-active': {
      opacity: 0.01,
      transform: 'translateX(100vw)',
      transition: 'all 500ms ease-in',
    },
  },
  index: {
    width: '3em',
    paddingTop: '1em',
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },
  form: { flex: 2 },
  action: {
    paddingTop: '0.5em',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  add: {
    margin: '.5em',
    padding: '0 1em',
  },
  remove: {
    display: 'inline-flex',
    float: 'left',
    margin: '.5em .5em .5em 0',
    padding: '.5em',
    color: '#F44336',
  },
});
class NormGroupInput extends Component {
  constructor(props) {
    super(props);
    this.defaultNorm = {
      from: 0,
      to: -1,
      price: 0,
    };
  }

  componentDidMount() {
    let { formvalues } = this.props;
    // khi tao moi
    if (!formvalues.normGroups || !formvalues.normGroups.length) {
      this.props.change(this.props.formname, `normGroups[0]`, this.defaultNorm);
    }
  }
  handleAddMore = fields => (_, newNorm = { from: 0, to: 0, price: 0 }) => {
    const normGroups = this.props.formvalues.normGroups;
    if (normGroups && normGroups.length > 1) {
      const norm = normGroups[normGroups.length - 2];
      newNorm.from = norm.to;
    }
    if (fields.length > 0) {
      // add item to (n - 1) index
      const last = fields.pop();
      fields.push(newNorm);
      fields.push(last);
    } else {
      fields.push(newNorm);
    }
  };
  handleRemove = (index, fields) => () => {
    // chi con 1 phan tu thi khong xoa
    if (index === 0 && fields.length === 1) {
      return;
    }

    // xoa phan tu vi tri 0 den [length -1]
    const normGroups = this.props.formvalues.normGroups;
    if (index < normGroups.length - 1) {
      // xoa phan tu 0
      if (!normGroups[index - 1]) {
        this.props.change(this.props.formname, `normGroups[${index + 1}].from`, 0);
      } else {
        // xoa phan tu vi tri 0 den [length -1]
        this.props.change(this.props.formname, `normGroups[${index + 1}].from`, normGroups[index - 1].to);
      }
    }
    // xoa phan tu cuoi cung thi update [to] cua phan tu truoc thanh [Khong gioi han]
    if (index === normGroups.length - 1) {
      this.props.change(this.props.formname, `normGroups[${index - 1}].to`, -1);
    }
    fields.remove(index);
  };
  handleToChange = index => (_, newValue) => {
    const normGroups = this.props.formvalues.normGroups;
    if (index < normGroups.length - 1) {
      this.props.change(this.props.formname, `normGroups[${index + 1}].from`, newValue);
    }
  };
  toValidation = index => (value, record) => {
    const normGroup = record.normGroups[index];
    if (normGroup.from >= normGroup.to) {
      return this.props.translate('resources.formulas.inputValGreater', { val: normGroup.from });
    }
    return undefined;
  };

  norm = ({ fields }) => {
    const { classes, translate } = this.props;
    return (
      <ul className={classes.root}>
        {fields.map((field, index, all) => {
          return (
            <Grid middle={'true'} container spacing={2} key={index}>
              <Grid item>
                <Typography variant="title" style={{ marginTop: 35 }}>
                  {index + 1}.{' '}
                </Typography>
              </Grid>
              <Grid item>
                <NumberInput
                  disabled
                  source={`${field}.from`}
                  validate={[required(), minValue(0)]}
                  label={translate('resources.formulas.fields.from')}
                />
              </Grid>
              <Grid item>
                {index === all.length - 1 ? ( // final item
                  <DisabledInput
                    label={translate('resources.formulas.fields.to')}
                    input={{ value: translate('resources.formulas.noLimit') }}
                  />
                ) : (
                  <NumberInput
                    source={`${field}.to`}
                    validate={[required(), minValue(0), this.toValidation(index)]}
                    label={translate('resources.formulas.fields.to')}
                    onChange={this.handleToChange(index)}
                  />
                )}
              </Grid>
              <Grid item>
                <NumberInput
                  source={`${field}.price`}
                  validate={[required(), minValue(0)]}
                  label={translate('resources.formulas.fields.price')}
                />
              </Grid>
              <Grid item>
                <Button
                  className={classes.remove}
                  type="button"
                  title={translate('resources.formulas.fields.delNorm')}
                  onClick={this.handleRemove(index, fields)}
                  style={{ marginTop: 40 }}
                >
                  <DeleteIcon />
                </Button>
              </Grid>
            </Grid>
          );
        })}

        <Grid middle={'true'} item sm={12} xs={12}>
          <li style={{ listStyleType: 'none' }}>
            <Button
              className={classes.add}
              color="primary"
              type="button"
              size="small"
              onClick={this.handleAddMore(fields)}
              label={translate('resources.formulas.fields.addNorm')}
            >
              <AddIcon style={{ paddingRight: '.5em' }} />
            </Button>
          </li>
        </Grid>
      </ul>
    );
  };
  render() {
    const { classes, translate, change, ...props } = this.props;
    return (
      <ArrayInput source="normGroups" {...props}>
        <this.norm />
      </ArrayInput>
    );
  }
}
NormGroupInput.defaultProps = {
  classes: PropTypes.object,
};
NormGroupInput.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  change: PropTypes.func,
  fields: PropTypes.object,
  classes: PropTypes.object,
  formvalues: PropTypes.any,
  formname: PropTypes.string,
};
NormGroupInput.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
function mapStateToProps(state) {
  return {
    formname: 'record-form',
    formvalues: getFormValues('record-form')(state),
  };
}
export default compose(translate, withStyles(styles), connect(mapStateToProps, { change }))(NormGroupInput);
