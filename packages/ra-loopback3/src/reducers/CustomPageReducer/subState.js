import { CUSTOM_PAGE_SET_STATE } from '../../actions/customPageActions';
const defaultState = {};
export default (function(previousState, _a) {
  if (previousState === void 0) {
    previousState = defaultState;
  }
  const type = _a.type,
    payload = _a.payload;
  switch (type) {
    case CUSTOM_PAGE_SET_STATE:
      return payload;
    default:
      return previousState;
  }
});
