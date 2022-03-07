import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Button, withDataProvider, URL_ONLY, showDialog, PdfView, translate } from 'ra-loopback3';
import { Link } from 'react-router-dom';
import { ExportPdfButtonIcon } from '../../styles/Icons';

class ExportPdfButton extends Component {
  state = { saving: false };
  static propTypes = {
    record: PropTypes.object,
    basePath: PropTypes.string,
  };
  onClick = async () => {
    let { dataProvider, record } = this.props;
    let res = await dataProvider(URL_ONLY, 'CtmFiles', {
      subUrl: `download/${record.fileName}`,
      fullUrl: true,
    });
    // console.log(res);
    if (res.data.url) {
      this.props.showDialog(<PdfView name="generic.pages.invoice" url={res.data.url} />);
    }
    this.setState({ saving: false });
  };

  componentWillUnmount() {
    this.unmount = true;
  }
  render() {
    const { basePath, showDialog, ...rest } = this.props;
    const { saving } = this.state;
    return (
      <Button
        saving={saving}
        component={Link}
        label="generic.printInvoice"
        to={{ pathname: basePath }}
        onClick={this.onClick}
        {...rest}
      >
        <ExportPdfButtonIcon />
      </Button>
    );
  }
}
ExportPdfButton.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  showDialog: PropTypes.func,
};
// eslint-disable-next-line
const mapStateToProps = state => {
  return {};
};
const enhance = compose(withDataProvider, translate, connect(mapStateToProps, { showDialog }));

export default enhance(ExportPdfButton);
