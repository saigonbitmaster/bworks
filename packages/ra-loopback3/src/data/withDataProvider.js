import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { startUndoable } from 'react-admin';

const withDataProvider = undoAble => BaseComponent => {
  class DataProviderComponent extends Component {
    static propTypes = {
      dispatch: PropTypes.func,
      startUndoable: PropTypes.func,
    };
    fetchData = (type, resource, params, onSuccess = {}, onFailure = {}) => {
      return {
        type: 'CUSTOM_REST_DATA',
        payload: params,
        meta: {
          resource,
          fetch: type,
          onSuccess,
          onFailure,
        },
      };
    };
    dataProvider = (
      type,
      resource,
      params,
      onSuccess = {},
      onFailure = {
        notification: {
          body: 'ra.notification.http_error',
          level: 'warning',
        },
      },
    ) => {
      return new Promise((resolve, reject) => {
        let internalOnSuccess = {
          ...onSuccess,
          callback: ({ payload, requestPayload }) => {
            if (onSuccess.callback) onSuccess.callback({ payload, requestPayload });
            resolve(payload, requestPayload);
          },
        };
        let internalOnFailure = {
          ...onFailure,
          callback: ({ payload, requestPayload }) => {
            if (onFailure.callback) onFailure.callback({ payload, requestPayload });
            reject(payload, requestPayload);
          },
        };
        this.props.dispatch(this.fetchData(type, resource, params, internalOnSuccess, internalOnFailure));
      });
    };
    undoAbleProvider = (type, resource, params, onSuccess = {}, onFailure = {}) => {
      return new Promise((resolve, reject) => {
        let intetalOnSuccess = {
          ...onSuccess,
          callback: ({ payload, requestPayload }) => {
            if (onSuccess.callback) onSuccess.callback({ payload, requestPayload });
            resolve(payload, requestPayload);
          },
        };
        let internalOnFailure = {
          ...onFailure,
          callback: res => {
            const { payload, requestPayload } = res;
            if (onFailure.callback) onFailure.callback(res);
            reject(payload, requestPayload);
          },
        };
        this.props.startUndoable(this.fetchData(type, resource, params, intetalOnSuccess, internalOnFailure));
      });
    };
    render() {
      let options = {};
      const { dataProvider, undoAbleProvider } = this;
      if (undoAble) {
        options.undoAbleProvider = undoAbleProvider;
      } else {
        options.dataProvider = dataProvider;
      }
      const { startUndoable, dispatch, ...rest } = this.props;
      return <BaseComponent {...rest} {...options} />;
    }
  }
  const mapDispatchToProps = dispatch => ({ dispatch, startUndoable });
  return connect(null, mapDispatchToProps)(DataProviderComponent);
};
export const undoAbleProvider = withDataProvider(true);
export default withDataProvider(false);
