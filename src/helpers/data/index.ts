export function sortWorksList (list: any) {
  return Object.keys(list).sort((a: any, b: any) => a.nanoseconds - b.nanoseconds)
}
