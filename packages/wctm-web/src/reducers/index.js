import themeReducer from './themeReducer';
import commonReducer from './commonReducer';
import designReducer from './designReducer';
import conversationReduer from './conversationReduer';

export default {
  common: commonReducer,
  theme: themeReducer,
  design: designReducer,
  conversation: conversationReduer,
};
