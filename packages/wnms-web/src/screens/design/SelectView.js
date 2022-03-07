import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { isEqual, get } from 'lodash';
import classNames from 'classnames';
import { FlexFormFilter, DmaSelectInput, MaterialSelectInput } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SelectDesign from './SelectDesign';

const styles = () => ({
  dma: {},
  model: {},
});

class SelectView extends PureComponent {
  static propTypes = {
    viewSelected: PropTypes.arrayOf(PropTypes.string),
    model: PropTypes.string,
    viewDmaId: PropTypes.string,
    classes: PropTypes.any,
    translate: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  refFilter = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      dmaCenter: undefined,
      filter: {},
    };
  }

  // onChange = data => {
  //   let fixData = { ...data, viewDmaId: data.viewDmaId || '' };
  //   if (this.state.dmaCenter) {
  //     fixData.defaultCenter = this.state.dmaCenter;
  //   }
  //   this.props.onChange(fixData);
  // };
  onChange = (data, flgChangeDma) => {
    // console.log('select view', data, flgChangeDma);
    let viewSelected = get(data, 'viewSelected', []);
    let fixData = this.state.filter;
    if (flgChangeDma || (viewSelected.length === 1 && viewSelected[0] === 'Dma')) {
      fixData.viewDmaId = data.viewDmaId || '';
      if (this.state.dmaCenter) {
        fixData.defaultCenter = this.state.dmaCenter;
      }
    } else if (viewSelected.length === 1 && viewSelected[0] === 'Factory') {
      return;
    } else {
      fixData.viewSelected = data.viewSelected;
      // console.log('fix data', fixData);
    }
    this.setState({ filter: fixData });
    this.props.onChange(fixData);
  };
  onDmaChange = (e, newData, oldData, fullData) => {
    // console.log('on change dma:', newData);
    // special case, set directly
    // eslint-disable-next-line
    this.state.dmaCenter = fullData && fullData.center ? fullData.center : undefined;
    this.onChange({ viewDmaId: newData }, true);
  };

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.viewSelected, this.props.viewSelected)) {
      this.refFilter.current.props.change('viewSelected', this.props.viewSelected);
    }
  }
  onViewSelectedChange = (e, viewSelected) => {
    this.onChange({ viewSelected }, false);
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { classes, translate, viewSelected, viewDmaId, model } = this.props;
    // console.log('SelectView render', this.props);
    return (
      <FlexFormFilter
        defaultValue={{
          viewSelected,
          viewDmaId,
        }}
        formName="view-form"
        formRef={this.refFilter}
      >
        <Grid middle container>
          <Grid middle item xs={12} md={4} className={classNames(classes.dma)}>
            <SelectDesign translate={translate} model={model} onChange={this.onChange} />
          </Grid>
          <Grid middle item xs={12} md={4} className={classNames(classes.dma)}>
            <DmaSelectInput
              source="viewDmaId"
              label={translate('resources.dmas.name', {
                smart_count: 1,
              })}
              onChange={this.onDmaChange}
              allowEmpty
            />
          </Grid>
          <Grid middle item xs={12} md={4} className={classNames(classes.model)}>
            <MaterialSelectInput
              defaultValue={viewSelected}
              source="viewSelected"
              multi
              label={translate('generic.show')}
              node={true}
              onChange={this.onViewSelectedChange}
            />
          </Grid>
        </Grid>
      </FlexFormFilter>
    );
  }
}
const enhance = compose(withStyles(styles));

export default enhance(SelectView);
