// Format date for display
export const formatDate = (date) => {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(
    new Date(date)
  );

  // Extract day, month, and year
  const day = parts.find((part) => part.type === "day").value;
  const month = parts.find((part) => part.type === "month").value;
  const year = parts.find((part) => part.type === "year").value;

  return `${day} ${month}, ${year}`;
};
