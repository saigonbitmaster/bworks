const sortByDate = (prevDate, thisDate) => new Date(thisDate).valueOf() - new Date(prevDate).valueOf();

const getDayForEvent = event => {
  const date = new Date(event.createdDate);
  date.setMilliseconds(0);
  date.setSeconds(0);
  date.setMinutes(0);
  date.setHours(0);
  return date.toISOString();
};

const groupByDay = histories => {
  const groups = histories.reduce((days, history) => {
    const day = getDayForEvent(history);
    if (!days[day]) {
      days[day] = [];
    }
    days[day] = days[day].concat(history);
    return days;
  }, {});
  return {
    days: Object.keys(groups).sort(sortByDate),
    historiesByDay: groups,
  };
};

export { groupByDay, sortByDate };
