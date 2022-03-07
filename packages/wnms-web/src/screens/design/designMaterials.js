import { withProps } from 'recompose';
import {
  FlowLoggerIcon,
  MeterIcon,
  QualityLoggerIcon,
  FilterIcon,
  PressureReducingIcon,
  PumpIcon,
  TankIcon,
  ValveIcon,
  OtherIcon,
  ElectricLoggerIcon,
} from '../../styles/Icons';
import MaterialUseCreate from '../../resources/materialUse/MaterialUseCreate';
import MaterialUseEdit from '../../resources/materialUse/MaterialUseEdit';

const models = [
  { model: 'FlowLogger', options: { icon: FlowLoggerIcon } },
  { model: 'QualityLogger', options: { icon: QualityLoggerIcon } },
  { model: 'ElectricLogger', options: { icon: ElectricLoggerIcon } },
  { model: 'Meter', options: { icon: MeterIcon } },
  { model: 'Filter', options: { icon: FilterIcon } },
  { model: 'PressureReducing', options: { icon: PressureReducingIcon } },
  { model: 'Pump', options: { icon: PumpIcon } },
  { model: 'Tank', options: { icon: TankIcon } },
  { model: 'Valve', options: { icon: ValveIcon } },
  { model: 'Other', options: { icon: OtherIcon } },
];

let screens = {};
models.map(({ model, options }) => {
  screens[`create${model}`] = withProps({ redirect: `/design/${model}`, model, options })(MaterialUseCreate);
  screens[`edit${model}/:id`] = withProps({ redirect: `/design/${model}`, model, options })(MaterialUseEdit);
});

export default screens;
