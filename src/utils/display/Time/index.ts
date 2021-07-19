export const Time = (time: number): string => {
  if (time) {
    return new Date(time).toDateString()
  }
  return "Unknown"
}
