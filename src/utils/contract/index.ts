
// Convert all characters of address string (Hex/Hash) to lower case.
export const safeAddress = (address: string | null) => {
  if (address) return "0x" + address.substr(2, address.length - 1).toLowerCase()
  return "0x0"
}
