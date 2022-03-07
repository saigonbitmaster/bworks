import { CTM_CONVERSATION_UPDATE } from '../actions/conversationActions';

// eslint-disable-next-line no-unused-vars
export default (previousState = null, { type, payload }) => {
  switch (type) {
    case CTM_CONVERSATION_UPDATE:
      return payload;
    default:
      return previousState;
  }
};
