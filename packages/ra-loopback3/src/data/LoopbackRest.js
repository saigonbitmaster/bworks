import { stringify } from 'query-string';
import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE,
  DELETE_MANY,
  UPDATE_MANY,
  FETCH_ERROR,
} from 'react-admin';
import { merge, get, cloneDeep } from 'lodash';
import { Storage } from './Storage';
import { fetchJson } from './fetch';

export const CUSTOM = 'CUSTOM';
export const URL_ONLY = 'URL_ONLY';
export const UPLOAD = 'UPLOAD';

/**
 * Maps admin-on-rest queries to a loopback powered REST API
 *
 * @see https://github.com/strongloop/loopback
 * @example
 * GET_LIST     => GET http://my.api.url/posts?filter[sort]="title ASC"&filter[skip]=0&filter[limit]=20
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts?filter[where][or]=[{id:123},{id:456}]
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts/123
 * DELETE       => DELETE http://my.api.url/posts/123
 *
 * Bworks Changes:
 *
 * - Copy from jsonServer.js
 * - Add loopback supported client
 * - Ignore null property in filters
 * - customRest {
 *    resources: { <resource>: { <type>: <custom>}}
 *    alias: { <aliasResource>: <realReasource> }
 *  }
 */
export const LoopbackRest = (apiUrl, customRest = {}, httpClient = fetchJson) => {
  window.API_URL = apiUrl; // hard code
  const fixUrl = (url, fullUrlTarget, ignoreToken) => {
    let token = Storage.getToken();
    let result = url;
    if (!ignoreToken) {
      token = token || '';
      if (url.indexOf('?') >= 0) {
        result = url + '&access_token=' + token;
      } else {
        result = url + '?access_token=' + token;
      }
    }
    if (fullUrlTarget && apiUrl.indexOf('http') !== 0) {
      result = location.origin + result;
    }
    return result;
  };
  /**
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The REST request params, depending on the type
   * @returns {Object} { url, options } The HTTP request parameters
   */
  const convertRESTRequestToHTTP = (type, resource, params) => {
    resource = resource.toLowerCase();
    // alias resource for dumplicate screen list with a resource api
    if (customRest.alias[resource]) {
      resource = customRest.alias[resource];
    }
    let url = '';
    const options = {};
    let fullUrlTarget = false;
    let ignoreToken = false;
    switch (type) {
      case GET_LIST: {
        const { sort = {}, pagination = {} } = params;
        const { page = 1, perPage = 25 } = pagination;
        const { field, order } = sort;
        let query = {};
        const { $fixUrl = '', $rawQuery, $order = [], $fields = undefined, ...filter } = params.filter || {};
        query.where = cloneDeep(filter);

        if (field) {
          query.order = $order || [];
          if (field.constructor === Array) {
            for (let i = 0; i < field.length; i++) {
              query.order.push(`${field[i]} ${order[i] || 'ASC'}`);
            }
          } else {
            query.order.push(`${field} ${order}`);
          }
        }
        if (perPage > 0) {
          query.limit = perPage;
          if (page >= 0) {
            query.skip = (page - 1) * perPage;
          }
        }
        // override raw loopback filter.
        if (params.rawFilter) {
          query = { ...query, ...params.rawFilter };
        }

        // $keepNull: stringify JSON's raw form
        const $keepNull = query.where.$keepNull || false;
        if ($keepNull) delete query.where.$keepNull;
        const replacer = $keepNull ? undefined : (_, v) => (v !== null ? v : undefined);
        // fields
        if ($fields) {
          if (query) {
            query.fields = $fields;
          }
          if ($rawQuery) {
            $rawQuery.fields = $fields;
          }
        }

        // When clients search by text, wrap remove all existing order and leave MongoDB return the data ranked by relevance
        if (query.where.$text) {
          query.where.$text.search = `"${query.where.$text.search}"`;
          delete query.order;
        }

        url = `${apiUrl}/${$fixUrl ? $fixUrl : resource}?${stringify({
          filter: JSON.stringify(query, replacer),
          ...$rawQuery,
        })}`;
        break;
      }
      case GET_ONE:
        url = `${apiUrl}/${resource}/${params.id}`;
        break;
      case GET_MANY: {
        // const listId = params.ids.map(id => ({ id }));
        let query = {
          where: { id: { inq: params.ids } },
        };
        const { fields = null } = params;
        // override raw loopback filter.
        if (params.rawFilter) {
          query = { ...query, ...params.rawFilter };
        }
        // fields
        if (fields) {
          if (query) {
            query.fields = fields;
          }
        }
        url = `${apiUrl}/${resource}?${stringify({
          filter: JSON.stringify(query, (k, v) => (v !== null ? v : undefined)),
        })}`;
        break;
      }
      case GET_MANY_REFERENCE: {
        const { sort = {}, pagination = {}, fields = null } = params;
        const { page = 1, perPage = 25 } = pagination;
        const { field, order } = sort;
        let query = {};
        query.where = { ...params.filter };
        query.where[params.target] = params.id;
        if (field) query.order = [`${field} ${order}`];
        if (perPage > 0) {
          query.limit = perPage;
          if (page >= 0) {
            query.skip = (page - 1) * perPage;
          }
        }
        // override raw loopback filter.
        if (params.rawFilter) {
          query = { ...query, ...params.rawFilter };
        }
        // fields
        if (fields) {
          if (query) {
            query.fields = fields;
          }
        }
        url = `${apiUrl}/${resource}?${stringify({
          filter: JSON.stringify(query, (k, v) => (v !== null ? v : undefined)),
        })}`;
        break;
      }
      case UPDATE:
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = 'PUT';
        options.body = JSON.stringify(params.data);
        break;
      case CREATE:
        url = `${apiUrl}/${resource}`;
        options.method = 'POST';
        options.body = JSON.stringify(params.data);
        break;
      case DELETE:
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = 'DELETE';
        break;
      case CUSTOM:
      case URL_ONLY: {
        const {
          method = 'GET',
          subUrl,
          filter,
          rawFilter,
          body,
          query,
          fullUrl,
          stream,
          ignoreToken: removeToken,
          fields = null,
        } = params;
        fullUrlTarget = !!fullUrl;
        ignoreToken = !!removeToken;
        url = `${apiUrl}/${resource}${subUrl ? '/' + subUrl : ''}`;
        options.method = method;
        let separate = '?';
        let fixFilter = filter || rawFilter;
        // fields
        if (fields) {
          if (query) {
            fixFilter.fields = fields;
          }
        }
        if (fixFilter) {
          url += `${separate}${stringify({
            filter: JSON.stringify(fixFilter),
          })}`;
          separate = '&';
        }
        if (query) {
          url += `${separate}${stringify(query)}`;
        }
        if (body) {
          options.body = JSON.stringify(body);
        }
        options.stream = stream;
        break;
      }
      case UPLOAD: {
        const { files, subUrl, query, filter, rawFilter } = params;
        let separate = '?';
        let fixFilter = filter || rawFilter;
        if (fixFilter) {
          url += `${separate}${stringify({
            filter: JSON.stringify(fixFilter),
          })}`;
          separate = '&';
        }
        url = `${apiUrl}/${resource}${subUrl ? '/' + subUrl : ''}`;
        if (query) {
          url += `${separate}${stringify(query)}`;
        }
        options.headers = new Headers();
        options.method = 'POST';
        var data = new FormData();
        for (const file of files) {
          data.append('files', file, file.name);
        }
        options.body = data;
        break;
      }
      default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
    // check custom crud
    if (customRest.resources[resource]) {
      let customFunc = customRest.resources[resource][type];
      if (customFunc) {
        const { url: customUrl, options: customOptions } = customFunc({
          apiUrl,
          httpClient,
          type,
          resource,
          params,
        });
        url = customUrl || url;
        merge(options, customOptions);
      }
    }
    // add token
    url = fixUrl(url, fullUrlTarget, ignoreToken);
    return { url, options };
  };

  /**
   * @param {Object} response HTTP response from fetch()
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The REST request params, depending on the type
   * @returns {Object} REST response
   */
  // eslint-disable-next-line no-unused-vars
  const convertHTTPResponseToREST = (response, type, resource, params) => {
    const { headers, json } = response;
    switch (type) {
      case GET_LIST:
      case GET_MANY_REFERENCE:
        if (!headers.has('content-range')) {
          throw new Error(
            'The content-range header is missing in the HTTP Response. The jsonServer REST client expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?',
          );
        }
        return {
          data: json,
          total: parseInt(
            headers
              .get('content-range')
              .split('/')
              .pop(),
            10,
          ),
        };
      case DELETE:
        if (json.count && json.count === 1) {
          return {
            data: { ...params.previousData },
          };
        }
        break;
      default: {
        let result = { data: json };
        if (headers.has('content-range')) {
          result.total = parseInt(
            headers
              .get('content-range')
              .split('/')
              .pop(),
            10,
          );
        }
        return result;
      }
    }
  };

  /**
   * @param {string} type Request type, e.g GET_LIST
   * @param {string} resource Resource name, e.g. "posts"
   * @param {Object} payload Request parameters. Depends on the request type
   * @returns {Promise} the Promise for a REST response
   */
  return (type, resource, params, dispatch) => {
    // incase reset data in client (clear resource data in redux)
    if (type === GET_LIST && !!get(params, 'filter.$reset')) {
      return { data: [], total: 0 };
    }

    // simple-rest doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
    if (type === UPDATE_MANY) {
      return Promise.all(
        params.ids.map(id => {
          const { url, options } = convertRESTRequestToHTTP(UPDATE, resource, { id, ...params });
          return httpClient(url, options);
        }),
      ).then(responses => ({
        data: responses.map(response => convertHTTPResponseToREST(response, type, resource, params)),
      }));
    }
    // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    else if (type === DELETE_MANY) {
      return Promise.all(
        params.ids.map(id => {
          const { url, options } = convertRESTRequestToHTTP(DELETE, resource, { id, ...params });
          return httpClient(url, options);
        }),
      ).then(responses => ({
        data: responses.map(response => convertHTTPResponseToREST(response, type, resource, params)),
      }));
    } else if (type === URL_ONLY) {
      return { data: convertRESTRequestToHTTP(type, resource, params) };
    }

    const { url, options } = convertRESTRequestToHTTP(type, resource, params);
    return httpClient(url, options)
      .then(response => convertHTTPResponseToREST(response, type, resource, params))
      .catch(e => {
        let error = get(e, 'body.error');
        // replace default msg
        e = error || e || {};
        e.body = error || {};
        if (dispatch) {
          dispatch({ type: FETCH_ERROR, e });
          return { error: e, data: null };
        } else {
          return Promise.reject(e);
        }
      });
  };
};
