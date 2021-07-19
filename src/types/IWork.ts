export interface IWork {
    description:     string;
    seller:          string;
    price:           string;
    transactionHash: string;
    id:              string;
    createAt:        CreateAt;
    tokenID:         string;
    name:            string;
    isShow:          boolean;
    resourceType:    string;
    resource:        Resource;
}

export interface CreateAt {
    seconds:     number;
    nanoseconds: number;
}

export interface Resource {
    thumbnail_256: string;
    origin:       string;
    thumbnail_512: string;
}
