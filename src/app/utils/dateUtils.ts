export function parseDate(value?: string) {
  if (!value) return "-"
  const dateValue = new Date(value)

  return [
    ("0" + dateValue.getDate()).slice(-2),
    ("0" + (dateValue.getMonth() + 1)).slice(-2),
    dateValue.getFullYear(),
  ].join("-")
}
