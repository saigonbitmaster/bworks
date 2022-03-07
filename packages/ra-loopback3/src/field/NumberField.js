import { compose, pure } from 'recompose';
import { NumberField as RawNumberField } from 'ra-ui-materialui';
import withLocales from '../data/withLocales';

const NumberField = compose(pure, withLocales)(RawNumberField);
NumberField.defaultProps = {
  addLabel: true,
  textAlign: 'right',
};
export default NumberField;
