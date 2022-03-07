import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate } from 'react-admin';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Dialog, AppBar, Toolbar, IconButton, Slide } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { showDialog } from '../actions/dialogAction';
const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class PdfView extends React.Component {
  handleClose = () => {
    this.props.showDialog(null);
  };

  render() {
    const { classes, url, translate, title, name, children, customRightButtons } = this.props;
    let fixTitle = title || name;
    fixTitle = translate(fixTitle, { _: fixTitle });
    return (
      <Dialog fullScreen open onClose={this.handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar variant="dense">
            <div style={{ display: 'flex', width: '100%', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                  <CloseIcon />
                </IconButton>
                {fixTitle}
              </div>
              <div style={{ flexGrow: 1 }} />
              <div>{customRightButtons}</div>
            </div>
          </Toolbar>
        </AppBar>
        {children ? (
          children
        ) : (
          <object data={url} name={fixTitle} type="application/pdf" width="100%" height="100%">
            <p>
              <a href={url}>{translate('ra.action.download')}</a>.
            </p>
          </object>
        )}
      </Dialog>
    );
  }
}

PdfView.propTypes = {
  classes: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  translate: PropTypes.func,
  showDialog: PropTypes.func,
  title: PropTypes.string,
  name: PropTypes.string,
  children: PropTypes.any,
  customLeftButtons: PropTypes.any,
  customRightButtons: PropTypes.any,
};

const enhance = compose(
  translate,
  withStyles(styles),
  connect(null, {
    showDialog,
  }),
);
export default enhance(PdfView);
