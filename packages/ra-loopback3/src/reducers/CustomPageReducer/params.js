import { CUSTOM_PAGE_SET_PARAMS, CUSTOM_PAGE_SET_FILTER } from '../../actions/customPageActions';
const defaultState = {
  sort: null,
  order: null,
  page: 1,
  perPage: null,
  filter: {},
};
export default (function(previousState, _a) {
  if (previousState === void 0) {
    previousState = defaultState;
  }
  const type = _a.type,
    payload = _a.payload;
  switch (type) {
    case CUSTOM_PAGE_SET_PARAMS:
      return payload;
    case CUSTOM_PAGE_SET_FILTER: {
      return { filter: { ...payload }, ...previousState };
    }
    default:
      return previousState;
  }
});
