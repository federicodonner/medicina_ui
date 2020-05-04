export function convertDate(timestamp) {
  const date = new Date();
  date.setTime(timestamp * 1000);
  return (
    date.getUTCDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
}

export function getCurrentDatePlus(daysFromToday) {
  let newDate = new Date();
  newDate.setDate(newDate.getDate() + daysFromToday);
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  return date + "/" + month + "/" + year;
}
