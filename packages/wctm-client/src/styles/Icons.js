import React from 'react';
import { renderToString } from 'react-dom/server';

let cache = {};
// eslint-disable-next-line
export const iconToMap = ({iconElement, color='#3f51b5', viewBox = '0 0 24 24', width = 32, height = width}) => {
  if (!iconElement) return null;
  let fixIcon = typeof iconElement === 'function' ? React.createElement(iconElement) : iconElement;
  let key = fixIcon.props.cache ? fixIcon.props.cache + color + viewBox + width + height : null;
  if (key && cache[key]) return cache[key];

  let data = renderToString(
    React.cloneElement(fixIcon, { xmlns: 'http://www.w3.org/2000/svg', width, height, viewBox }),
  );
  let style = `<style> svg {fill: ${color};} </style>`;
  // eslint-disable-next-line
  data = 'data:image/svg+xml;utf-8,' + data.replace(/<svg(.*?)>/g, math => {
      return math + style;
    });
  data = encodeURI(data);
  if (key) {
    cache[key] = data;
  }
  return data;
};

export {
  Dashboard as DashboardIcon,
  BubbleChart as InfoWaterUsageIcon,
  Equalizer as PressureIcon,
  Timeline as ParentMenuInfoWaterNetworkIcon,
  Opacity as QualityWaterIcon,
  Face as InfoClientIcon,
  Email as TicketSupportIcon,
  Call as CommunicationIcon,
  Message as AnnouncementIcon,
  Lock as ChangePasswordIcon,
  QuestionAnswer as AnswerIcon,
  Smartphone as EmployeeAppIcon,
} from '@material-ui/icons';

export { default as FilterIcon } from './svgs/FilterIcon';
export { default as FlowLoggerIcon } from './svgs/FlowLoggerIcon';
export { default as MeterIcon } from './svgs/MeterIcon';
export { default as NodeIcon } from './svgs/NodeIcon';
export { default as PipeIcon } from './svgs/PipeIcon';
export { default as PressureReducingIcon } from './svgs/PressureReducingIcon';
export { default as PumpIcon } from './svgs/PumpIcon';
export { default as QualityLoggerIcon } from './svgs/QualityLoggerIcon';
export { default as TankIcon } from './svgs/TankIcon';
export { default as ValveIcon } from './svgs/ValveIcon';
export { default as AddTaskboardIcon } from './svgs/AddTaskboardIcon';
export default {};
