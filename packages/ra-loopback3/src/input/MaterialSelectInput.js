import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SelectInput, SelectArrayInput } from 'react-admin';

class MaterialSelectInput extends Component {
  static propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    dma: PropTypes.bool,
    node: PropTypes.bool,
    allmat: PropTypes.string,
    multi: PropTypes.bool,
    translate: PropTypes.func,
    factory: PropTypes.bool,
  };

  static defaultProps = {
    choices: [
      { id: 'Pipe', name: 'resources.materialstocks.types.pipe' },
      { id: 'FlowLogger', name: 'resources.materialstocks.types.flowLogger' },
      { id: 'ElectricLogger', name: 'resources.materialstocks.types.electricLogger' },
      { id: 'QualityLogger', name: 'resources.materialstocks.types.qualityLogger' },
      { id: 'Meter', name: 'resources.materialstocks.types.meter' },
      { id: 'Filter', name: 'resources.materialstocks.types.filter' },
      { id: 'PressureReducing', name: 'resources.materialstocks.types.pressureReducing' },
      { id: 'Pump', name: 'resources.materialstocks.types.pump' },
      { id: 'Tank', name: 'resources.materialstocks.types.tank' },
      { id: 'Valve', name: 'resources.materialstocks.types.valve' },
      { id: 'Other', name: 'resources.materialstocks.types.other' },
    ],
  };

  state = {
    choices: [],
  };

  componentDidMount() {
    const { choices: rawChoises, node, dma, allmat, factory } = this.props;
    let choices = [];
    if (dma) {
      choices.push({ id: 'Dma', name: 'generic.dma' });
    }
    if (node) {
      choices.push({ id: 'Node', name: 'generic.node' });
    }
    if (allmat) {
      choices.push({ id: 'AllMat', name: 'generic.allMat' });
    }
    if (factory) {
      choices.push({ id: 'Factory', name: 'generic.factory' });
    }
    choices = choices.concat(rawChoises);
    this.setState({ choices });
  }

  render() {
    const { choices, node, dma, multi, factory, ...rest } = this.props;
    if (!this.state.choices || !this.state.choices.length) {
      return null;
    }
    if (multi) {
      return <SelectArrayInput {...rest} choices={this.state.choices} translateChoice={true} />;
    }
    return <SelectInput {...rest} choices={this.state.choices} translateChoice={true} />;
  }
}
export default MaterialSelectInput;
