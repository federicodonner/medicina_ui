export function convertDate(timestamp) {
  const date = new Date();
  date.setTime(timestamp*1000);
  return (
    date.getUTCDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
}
