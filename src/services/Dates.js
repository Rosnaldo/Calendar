const months = [
  { name: 'January',
    lastDay: 31,
  },{
    name: 'February',
    lastDay: 29,
  }, {
    name: 'March',
    lastDay: 31,
  }, {
    name: 'April',
    lastDay: 30,
  }, {
    name: 'May',
    lastDay: 31
  }, {
    name: 'June',
    lastDay: 30
  }, {
    name: 'July',
    lastDay: 31
  }, {
    name: 'August',
    lastDay: 31
  }, {
    name: 'September',
    lastDay: 30
  }, {
    name: 'October',
    lastDay: 31
  }, {
    name: 'November',
    lastDay: 30
  }, {
    name: 'December',
    lastDay: 31
  },
];

const monthsName = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Out: 9,
  Nov: 10,
  Dec: 11,
};

// current dates
const dateCurr = new Date();
const today = dateCurr.getDate();
const monthCurr = dateCurr.getMonth();
const yearCurr = dateCurr.getFullYear();

const monthString = (month) => {
  return months[month].name.slice(0, 3);
};

const weekString = (week) => {
  const weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'];
  return weeks[week].slice(0, 3);
};

const dateFormat = (day = today, month = monthCurr, year = yearCurr) => {
  return `${day}/${monthString(month)}/${year}`
};

const matchDateType = (dateFormat2, dateFormatSelected, sunCb) => {
  const arr = dateFormat2.split('/');
  let objDate = { day: Number(arr[0]), month: monthsName[arr[1]], year: Number(arr[2]) };
  while(!dateBigerThan(dateFormat(objDate.day, objDate.month, objDate.year), dateFormatSelected)) {
    objDate = { ...sunCb(objDate) };
  }
  const { day, month, year } = objDate;
  if (dateFormatSelected === dateFormat(day, month, year)) {
    return true;
  }
  return false;
};

const dateBigerThan = (dateFormat2, dateFormat3) => {
  const arr = dateFormat2.split('/');
  const arr2 = dateFormat3.split('/');
  let objDate = { day: Number(arr[0]), month: monthsName[arr[1]], year: Number(arr[2]) };
  let objDate2 = { day: Number(arr2[0]), month: monthsName[arr2[1]], year: Number(arr2[2]) };

  if (objDate.year > objDate2.year) { return true; }
  if (objDate.year < objDate2.year) { return false; }
  if (objDate.month > objDate2.month) { return true; }
  if (objDate.month < objDate2.month) { return false; }
  if (objDate.day >= objDate2.day) return true;
  return false;
};

const sunDay = ({ day, month, year }) => {
  if (day + 1 > months[month].lastDay) {
    day = day + 1 - months[month].lastDay;
    month += 1;
  } else {
    day += 1;
  }
  if (month === 12) {
    month = 0;
    year += 1;
  }
  return { day, month, year };
};

const sunSemana = ({ day, month, year }) => {
  if (day + 7 > months[month].lastDay) {
    day = day + 7 - months[month].lastDay;
    month += 1;
  } else {
    day += 7;
  }
  if (month === 12) {
    month = 0;
    year += 1;
  }
  return { day, month, year };
};

const sunQuinzena = ({ day, month, year }) => {
  if (day + 14 > months[month].lastDay) {
    day = day + 14 - months[month].lastDay;
    month += 1;
  } else {
    day += 14;
  }
  if (month === 12) {
    month = 0;
    year += 1;
  }
  return { day, month, year };
};

const sunMes = ({ day, month, year }) => {
  if (month + 1 === 12) {
    month = 0;
    year += 1;
  } else {
    month += 1;
  }
  return { day, month, year };
};

const contTypes = (start, end, sunCb) => {
  const arr = start.split('/');
  let day = Number(arr[0]);
  let month = monthsName[arr[1]];
  let year = Number(arr[2]);
  let i = 0;
  while (dateFormat(day, month, year) !== end && dateBigerThan(end, dateFormat(day, month, year))) {
    let obj = sunCb({ day, month, year });
    day = obj.day;
    month = obj.month;
    year = obj.year;
    i++;
  }
  return i;
};

export {
  monthsName,
  months,
  monthString,
  weekString,
  today,
  monthCurr,
  yearCurr,
  dateFormat,
  sunDay,
  sunSemana,
  sunQuinzena,
  sunMes,
  matchDateType,
  dateBigerThan,
  contTypes,
};
