const STORAGE_KEY = 'persistence';

export function save(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return Promise.resolve({});
}

export function load() {
  const state = window.localStorage.getItem(STORAGE_KEY);
  return Promise.resolve(state ? JSON.parse(state) : {});
}
