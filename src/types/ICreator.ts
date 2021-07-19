export interface ICreator {
    id: string
    name?: string
    bio?: string
    publicAddress: string
    isApprovedCreator: boolean
    images: ICreatorImage
}

export interface ICreatorImage {
    thumbnail_256: string;
    thumbnail_128: string;
}