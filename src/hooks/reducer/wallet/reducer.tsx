export const initialState = () =>
  JSON.parse(localStorage.getItem("localWallet") || "{}");

export const actionTypes = {
  SET_WALLET_ADDRESS: "wallet/SET_WALLET_ADDRESS",
};

const reducer = (state = {}, action: any) => {
  switch (action.type) {
    case actionTypes.SET_WALLET_ADDRESS:
      return {
        walletAddress: action.payload.walletAddress,
        timeout: action.payload.timeout,
      };
  }
  return state;
};

export default reducer;
