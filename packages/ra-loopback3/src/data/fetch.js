import { stringify } from 'query-string';
import { HttpError } from 'react-admin';
import FileSaver from 'file-saver';

export const fetchJson = (url, rawOptions = {}) => {
  const { stream, ...options } = rawOptions;
  const requestHeaders =
    options.headers || stream
      ? new Headers()
      : new Headers({
          Accept: 'application/json',
        });
  if (!requestHeaders.has('Content-Type') && !(options && options.body && options.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  if (options.user && options.user.authenticated && options.user.token) {
    requestHeaders.set('Authorization', options.user.token);
  }

  if (stream) {
    let headers;
    return fetch(url, { ...options, headers: requestHeaders }).then(response => {
      if (!response.ok || response.status >= 400) {
        return response.text().then(text => {
          const json = JSON.parse(text);
          const { error } = json || { error: {} };
          return Promise.reject(new HttpError((error && error.message) || response.statusText, response.status, error));
        });
      }

      headers = response.headers;
      if (stream !== 'base64') {
        let fileName = 'downloadFile';
        var disposition = headers.get('Content-Disposition');
        if (disposition && disposition.indexOf('filename=') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }
        } else {
          // get f from params
          const url = new URL(response.url);
          let f = url.searchParams.get('f');
          if (f) {
            fileName = f;
          } else {
            f = response.url.split(/(\\|\/)/g).pop();
            if (f) {
              f = f.split('?').shift();
              if (f) {
                fileName = f;
              }
            }
          }
        }
        return response
          .blob()
          .then(blob => {
            if (blob.size > 2) return FileSaver.saveAs(blob, fileName);
          })
          .then(arg =>
            arg
              ? {
                  status: response.status,
                  headers,
                  body: { fileName },
                  json: { fileName },
                }
              : { status: response.status, headers },
          );
      } else {
        return response.blob().then(blob => {
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          return new Promise(resolve => {
            reader.onloadend = function() {
              let base64data = reader.result;
              resolve(base64data);
            };
          }).then(base64 => ({
            status: response.status,
            headers,
            body: {},
            json: { base64 },
          }));
        });
      }
    });
  }

  return fetch(url, { ...options, headers: requestHeaders })
    .then(response =>
      response.text().then(text => ({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: text,
      })),
    )
    .then(({ status, statusText, headers, body }) => {
      let json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        // not json, no big deal
      }
      if (status < 200 || status >= 300) {
        return Promise.reject(new HttpError((json && json.message) || statusText, status, json));
      }
      return { status, headers, body, json };
    });
};

export const queryParameters = stringify;

const isValidObject = value => {
  if (!value) {
    return false;
  }

  const isArray = Array.isArray(value);
  const isBuffer = Buffer && Buffer.isBuffer(value);
  const isObject = Object.prototype.toString.call(value) === '[object Object]';
  const hasKeys = !!Object.keys(value).length;

  return !isArray && !isBuffer && isObject && hasKeys;
};

export const flattenObject = (value, path = []) => {
  if (isValidObject(value)) {
    return Object.assign({}, ...Object.keys(value).map(key => flattenObject(value[key], path.concat([key]))));
  } else {
    return path.length ? { [path.join('.')]: value } : value;
  }
};
