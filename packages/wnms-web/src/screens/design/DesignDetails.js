import React from 'react';
import PropTypes from 'prop-types';
// import {
//   FlowLoggerIcon,
//   MeterIcon,
//   QualityLoggerIcon,
//   FilterIcon,
//   PressureReducingIcon,
//   PumpIcon,
//   TankIcon,
//   ValveIcon,
//   OtherIcon,
// } from '../../styles/Icons';
import MaterialUseCreate from '../../resources/materialUse/MaterialUseCreate';
import MaterialUseEdit from '../../resources/materialUse/MaterialUseEdit';
import DmaCreate from '../../resources/dma/DmaCreate';
import DmaEdit from '../../resources/dma/DmaEdit';
import NodeCreate from '../../resources/node/NodeCreate';
import NodeEdit from '../../resources/node/NodeEdit';
import PipeCreate from '../../resources/materialUse/PipeCreate';
import PipeEdit from '../../resources/materialUse/PipeEdit';
import FactoryCreate from '../../resources/factory/FactoryCreate';
import FactoryEdit from '../../resources/factory/FactoryEdit';

// const icons = {
//   FlowLogger: FlowLoggerIcon,
//   QualityLogger: QualityLoggerIcon,
//   Meter: MeterIcon,
//   Filter: FilterIcon,
//   PressureReducing: PressureReducingIcon,
//   Pump: PumpIcon,
//   Tank: TankIcon,
//   Valve: ValveIcon,
//   Other: OtherIcon,
// };

export const MapCreateItem = props => {
  const model = props.match.params.model;
  if (!model) return null;
  switch (model) {
    case 'Dma':
      return <DmaCreate {...props} model={model} redirect={`/design/${model}`} />;
    case 'Node':
      return <NodeCreate {...props} model={model} redirect={`/design/${model}`} />;
    case 'Pipe':
      return <PipeCreate {...props} model={model} redirect={`/design/${model}`} />;
    case 'Factory':
      return <FactoryCreate {...props} model={model} redirect={`/design/${model}`} />;
    default:
      return (
        <MaterialUseCreate
          {...props}
          model={model}
          redirect={`/design/${model}`}
          options={{ icon: { iconElement: model } }}
        />
      );
  }
};
MapCreateItem.propTypes = {
  match: PropTypes.object,
};

export const MapEditItem = props => {
  let model = props.match.params.model;
  if (!model) return null;
  switch (model) {
    case 'Dma':
      return <DmaEdit {...props} model={model} redirect={`/design/${model}`} />;
    case 'Node':
      return <NodeEdit {...props} model={model} redirect={`/design/${model}`} />;
    case 'Pipe':
      return <PipeEdit {...props} model={model} redirect={`/design/${model}`} />;
    case 'Factory':
      return <FactoryEdit {...props} model={model} redirect={`/design/${model}`} />;
    default:
      return <MaterialUseEdit {...props} model={model} redirect={`/design/${model}`} options={{ icon: model }} />;
  }
};
MapEditItem.propTypes = {
  match: PropTypes.object,
};
