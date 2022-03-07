import React from 'react';
import PropTypes from 'prop-types';
import { Fade } from '@material-ui/core';
// import compose from 'recompose/compose';
import { translate } from 'react-admin';

const PageShell = (item, screens, screen, props) => {
  let FixScreen = typeof screen === 'object' && screen.component ? screen.component : screen;

  const PageShell = ({ staticContext: staticcontext, translate, ...rest }) => {
    let options = {};
    if (rest.match.params && rest.match.params.id) {
      options.id = rest.match.params.id;
    }
    let title = translate(item.label);
    document.title = title + ' - Bworks';
    return (
      <Fade in timeout={500}>
        <div>
          <FixScreen {...props} {...options} {...rest} staticcontext={staticcontext} title={title} />
        </div>
      </Fade>
    );
  };
  PageShell.propTypes = {
    staticContext: PropTypes.any,
    translate: PropTypes.func,
  };
  // console.log(translate);
  return translate(PageShell);
};

export default PageShell;
