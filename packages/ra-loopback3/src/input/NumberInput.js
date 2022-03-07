import { compose } from 'recompose';
import { NumberInput as RawNumberInput } from 'ra-ui-materialui';

import withLocales from '../data/withLocales';

const NumberInput = compose(withLocales)(RawNumberInput);
NumberInput.defaultProps = {
  textAlign: 'right',
};
export default NumberInput;
