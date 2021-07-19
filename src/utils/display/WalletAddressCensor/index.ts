export const WalletAddressCensor = (account: string): string => account ? (account.substr(0, 6) + '...' + account.substr(account.length - 4, 4)) : 'Unknown'
