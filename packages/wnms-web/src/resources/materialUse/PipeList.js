import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate } from 'ra-loopback3';
import MaterialUseList from './MaterialUseList';

const Title = ({ translate }) => <span>{translate('resources.materialstocks.types.pipe')}</span>;
Title.propTypes = { translate: PropTypes.func.isRequired };

const PipeList = ({ translate, updateView, onUpdateList, dataProvider, ...props }) => {
  return <MaterialUseList {...props} filter={{ type: 'Pipe' }} title={<Title translate={translate} />} />;
};
PipeList.propTypes = {
  dataProvider: PropTypes.func,
  updateView: PropTypes.number,
  onUpdateList: PropTypes.func,
  translate: PropTypes.func.isRequired,
};

const enhance = compose(translate);
export default enhance(PipeList);
