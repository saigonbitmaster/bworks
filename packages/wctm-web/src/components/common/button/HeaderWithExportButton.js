import React, { Component } from 'react';
import { CUSTOM, Header, Button, withDataProvider, CardActions, translate } from 'ra-loopback3';
import PropTypes from 'prop-types';
import { PictureAsPdf } from '@material-ui/icons';
import { get } from 'lodash';

@withDataProvider
@translate
class HeaderWithExportButton extends Component {
  state = {
    saving: false,
  };

  export = () => {
    const { templateId, formReference, apis } = this.props;
    const sortQuery = {
      order: `${get(formReference.current.props.sort, 'field')} ${get(formReference.current.props.sort, 'order')}`,
    };
    const filterQuery = {
      where: { ...formReference.current.props.filter, flgTotal: true, flgGetFull: true },
    };
    this.setState({ saving: true });
    this.props
      .dataProvider(CUSTOM, 'CtmReports', {
        subUrl: 'exportReport',
        method: 'GET',
        fullUrl: true,
        query: { apis: JSON.stringify(apis), filter: JSON.stringify({ ...sortQuery, ...filterQuery }), templateId },
        stream: 'file',
      })
      .finally(() => this.setState({ saving: false }));
  };

  render() {
    const { title, translate, permission } = this.props;
    const { saving } = this.state;
    return (
      <Header
        title={title}
        actions={
          <CardActions>
            <Button
              label={translate('generic.exportPdf')}
              saving={saving}
              onClick={this.export}
              permission={permission}
            >
              <PictureAsPdf />
            </Button>
          </CardActions>
        }
      />
    );
  }
}

HeaderWithExportButton.propTypes = {
  dataProvider: PropTypes.func,
  title: PropTypes.string,
  filter: PropTypes.object,
  templateId: PropTypes.string,
  formReference: PropTypes.object,
  apis: PropTypes.array,
  translate: PropTypes.func,
  permission: PropTypes.object,
};

HeaderWithExportButton.defaultProps = {};

export default HeaderWithExportButton;
