export const MAP_DESIGN_SELECTED = 'MAP_DESIGN_SELECTED';

export const mapChangeSelected = data => {
  return {
    type: MAP_DESIGN_SELECTED,
    payload: data,
  };
};
