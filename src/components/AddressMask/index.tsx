
export const AddressMask = ({ address, account }: any) => {
  let _address = account || address
  if (!_address || _address === "" || _address === "0x0") { _address = "Unknown address" }
  else { _address = _address.substr(0, 6) + '...' + _address.substr(_address.length - 4, 4) }
  return (<>
    { _address}
  </>)
}
