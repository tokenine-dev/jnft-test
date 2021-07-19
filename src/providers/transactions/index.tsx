import React, { createContext, useContext } from 'react'

export const TransactionsContext = createContext<{
  transactions: []
}>({
  transactions: []
})

export function useTransactionsContext() {
  return useContext(TransactionsContext)
}

// @ts-ignore
export function TransactionsProvider({ children }: Props) {
  // @ts-ignore
  return <TransactionsContext.Provider value={{}} children={children} />
}
