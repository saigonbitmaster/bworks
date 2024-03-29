import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import compose from 'recompose/compose';
import withLocales from '../data/withLocales';
import sanitizeRestProps from './sanitizeRestProps';

const hasNumberFormat = !!(typeof Intl === 'object' && Intl && typeof Intl.NumberFormat === 'function');

const styles = {
  input: { textAlign: 'right' },
};

/**
 * Display a numeric value as a locale string.
 *
 * Uses Intl.NumberFormat() if available, passing the locales and options props as arguments.
 * If Intl is not available, it outputs number as is (and ignores the locales and options props).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
 * @example
 * <NumberWithUnitField source="score" />
 * // renders the record { id: 1234, score: 567 } as
 * <span>567</span>
 *
 * <NumberWithUnitField source="score" className="red" />
 * // renders the record { id: 1234, score: 567 } as
 * <span class="red">567</span>
 *
 * <NumberWithUnitField source="share" options={{ style: 'percent' }} />
 * // renders the record { id: 1234, share: 0.2545 } as
 * <span>25%</span>
 *
 * <NumberWithUnitField source="price" options={{ style: 'currency', currency: 'USD' }} />
 * // renders the record { id: 1234, price: 25.99 } as
 * <span>$25.99</span>
 *
 * <NumberWithUnitField source="price" locales="fr-FR" options={{ style: 'currency', currency: 'USD' }} />
 * // renders the record { id: 1234, price: 25.99 } as
 * <span>25,99 $US</span>
 */
function getUnitByMatType(type) {
  let unit = '';
  if (!type) {
    return unit;
  }
  if (type === 'Pipe') {
    unit = 'generic.units.meter';
  } else {
    unit = 'generic.units.quantity';
  }
  return unit;
}

// hien thi so va don vi vat tu, dua vao type field
// ex:
//  + type = '' => 100
//  + type = 'Pipe' => 100 m
//  + con lai => 100 Cai
export const NumberWithUnitBaseMatTypeField = ({
  classes = {},
  className,
  record,
  source,
  locales,
  options,
  translate,
  translateUnit,
  showUnit,
  dataProvider,
  ...rest
}) => {
  if (!record) return null;
  const value = get(record, source);
  if (value == null) return null;

  let type = get(record, 'type', '');

  if (!hasNumberFormat || !type || !showUnit)
    return (
      <span className={classnames(classes.input, className)} {...sanitizeRestProps(rest)}>
        {value}
      </span>
    );
  let unit = getUnitByMatType(type);
  return (
    <span className={classnames(classes.input, className)} {...sanitizeRestProps(rest)}>
      {value.toLocaleString(locales, options)} {translate(unit)}
    </span>
  );
};

NumberWithUnitBaseMatTypeField.propTypes = {
  addLabel: PropTypes.bool,
  basePath: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  cellClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  label: PropTypes.string,
  locales: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  options: PropTypes.object,
  record: PropTypes.object,
  textAlign: PropTypes.string,
  source: PropTypes.string.isRequired,
  unitKey: PropTypes.string,
  unit: PropTypes.string,
  translate: PropTypes.func,
  showUnit: PropTypes.bool,
  translateUnit: PropTypes.any,
  dataProvider: PropTypes.func,
};

const FixLocateNumber = compose(withLocales, pure, withStyles(styles))(NumberWithUnitBaseMatTypeField);
FixLocateNumber.defaultProps = {
  addLabel: true,
  textAlign: 'right',
  showUnit: true,
};

export default FixLocateNumber;
