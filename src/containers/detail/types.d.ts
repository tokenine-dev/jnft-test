export interface IWorkDetail {
  id: string
  description: string
  isShow: boolean
  name: string
  price: string
  resource: any
  resourceType: string
  creator: string
  owner: string
  createAt: any
  blockNumber: number
  isApproved: boolean
}

export interface IWorkCreator {
  id: string
  description: string
}
