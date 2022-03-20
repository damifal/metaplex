import { Creator, StringPublicKey } from '@oyster/common';
export const METADATA_PREFIX = 'metadata';
export const EDITION = 'edition';
export const RESERVATION = 'reservation';

export const MAX_NAME_LENGTH = 32;

export const MAX_SYMBOL_LENGTH = 10;

export const MAX_URI_LENGTH = 200;

export const MAX_CREATOR_LIMIT = 5;

export type Attribute = {
  trait_type?: string;
  display_type?: string;
  value: string | number;
};

export interface INftCollection {
  Name: string;
  Description: string;
  Email: string;
  OwnerAddress: StringPublicKey;
  UrlHandle: any;
  Twitter: any;
  Telegram: any;
  Discord: any;
  Website: any;
  Image: any;
  TotalVolume: number;
  Total: number;
  SellerFeeBasisPoints: number;
  Attributes?: Attribute[];
  Creators: Creator[] | null;
  ImageUrl: any;
}

export class NftCollection {
  Name: string;
  Description: string;
  Email: string;
  OwnerAddress: StringPublicKey;
  UrlHandle: string | null;
  Twitter: string | null;
  Telegram: string | null;
  Discord: string | null;
  Website: string | null;
  Image: string | null;
  TotalVolume: number;
  Total: number;
  SellerFeeBasisPoints: number;
  Attributes?: Attribute[];
  Creators?: Creator[] | null;

  constructor(args: {
    Name: string;
    Description: string;
    Email: string;
    OwnerAddress: StringPublicKey;
    UrlHandle: string | null;
    Twitter: string | null;
    Telegram: string | null;
    Discord: string | null;
    Website: string | null;
    Image: string | null;
    TotalVolume: number;
    Total: number;
    SellerFeeBasisPoints: number;
    Attributes: Attribute[];
    Creators: Creator[] | null;
  }) {
    this.Name = args.Name;
    this.Description = args.Description;
    this.Email = args.Email;
    this.OwnerAddress = args.OwnerAddress;
    this.UrlHandle = args.UrlHandle ?? null;
    this.Twitter = args.Twitter ?? null;
    this.Telegram = args.Telegram ?? null;
    this.Discord = args.Discord ?? null;
    this.Website = args.Website ?? null;
    this.Image = args.Image ?? null;
    this.TotalVolume = args.TotalVolume;
    this.Total = args.Total;
    this.Attributes = args.Attributes;
    this.SellerFeeBasisPoints = args.SellerFeeBasisPoints;
    this.Creators = args.Creators;
  }

  public async init() {}
}
