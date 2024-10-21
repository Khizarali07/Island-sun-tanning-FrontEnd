export default function calculateExpirationDate(duration, durationUnit) {
  const currentDate = new Date(); // Current date
  let expirationDate = new Date(currentDate); // Clone the current date

  switch (durationUnit) {
    case "days":
      expirationDate.setDate(currentDate.getDate() + duration);
      break;
    case "weeks":
      expirationDate.setDate(currentDate.getDate() + duration * 7);
      break;
    case "months":
      expirationDate.setMonth(currentDate.getMonth() + duration);
      break;
    default:
      console.error("Invalid duration unit");
      return null;
  }

  return expirationDate;
}
