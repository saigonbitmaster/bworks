import { DateField as RawDateField } from 'ra-ui-materialui';
import { compose, pure } from 'recompose';
import withLocales from '../data/withLocales';

const DateField = pure(compose(withLocales)(RawDateField));
DateField.defaultProps = {
  addLabel: true,
};
export default DateField;
