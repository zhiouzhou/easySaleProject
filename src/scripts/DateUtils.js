/**
 * 获取当前月的第一天
 */
function getCurrentMonthFirst() {
  let date = new Date();
  date.setDate(1);
  return date;
}

/**
 * 获取当前月的最后一天
 */
function getCurrentMonthLast() {
  let date = new Date();
  let currentMonth = date.getMonth();
  let nextMonth = ++currentMonth;
  let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  let oneDay = 1000 * 60 * 60 * 24;
  return new Date(nextMonthFirstDay - oneDay);
}

export default {
  getCurrentMonthFirst, getCurrentMonthLast
}
