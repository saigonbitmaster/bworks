export const GIS_ACTIVE_GROUP = 'GIS_ACTIVE_GROUP';
export const gisActiveGroup = function(group) {
  return {
    type: GIS_ACTIVE_GROUP,
    payload: group,
  };
};

export const GIS_TOGGLE_GROUP = 'GIS_TOGGLE_GROUP';
export const gisToggleGroup = function(group) {
  return {
    type: GIS_TOGGLE_GROUP,
    payload: group,
  };
};
