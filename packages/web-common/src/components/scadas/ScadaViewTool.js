import React from 'react';
// import { round } from 'lodash';
import { ButtonGroup, Button, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { ZoomOutRounded, FullscreenRounded, ZoomInRounded } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    left: theme.spacing(1),
    top: theme.spacing(1),
    zIndex: theme.zIndex.drawer,
  },
}));

export default function ScadaViewTool({ canvasRef, zoom }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ButtonGroup size="small" variant="contained" aria-label="outlined primary button group">
        <Button onClick={() => canvasRef.current.handler.zoomHandler.zoomOut()} aria-label="Zoom Out">
          <ZoomOutRounded />
        </Button>
        <Button onClick={() => canvasRef.current.handler.zoomHandler.zoomOneToOne()} aria-label="Zoom Fit">
          {Math.round(zoom * 100)} %
        </Button>
        <Button onClick={() => canvasRef.current.handler.zoomHandler.zoomToFit()} aria-label="Zoom Fit">
          <FullscreenRounded />
        </Button>
        <Button onClick={() => canvasRef.current.handler.zoomHandler.zoomIn()} aria-label="Zoom In">
          <ZoomInRounded />
        </Button>
      </ButtonGroup>
    </div>
  );
}

ScadaViewTool.propTypes = {
  canvasRef: PropTypes.object,
  zoom: PropTypes.number,
};
