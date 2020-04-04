import * as jspb from "google-protobuf"

export class CreateAccountResponse extends jspb.Message {
  getAccountRelationship(): string;
  setAccountRelationship(value: string): void;

  getAssetCode(): string;
  setAssetCode(value: string): void;

  getAssetScale(): number;
  setAssetScale(value: number): void;

  getMaximumPacketAmount(): number;
  setMaximumPacketAmount(value: number): void;

  getCustomSettingsMap(): jspb.Map<string, string>;
  clearCustomSettingsMap(): void;

  getAccountId(): string;
  setAccountId(value: string): void;

  getCreatedAt(): string;
  setCreatedAt(value: string): void;

  getModifiedAt(): string;
  setModifiedAt(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getLinkType(): string;
  setLinkType(value: string): void;

  getIsInternal(): boolean;
  setIsInternal(value: boolean): void;

  getIsConnectioninitiator(): boolean;
  setIsConnectioninitiator(value: boolean): void;

  getIlpAddressSegment(): string;
  setIlpAddressSegment(value: string): void;

  getIsSendRoutes(): boolean;
  setIsSendRoutes(value: boolean): void;

  getIsReceiveRoutes(): boolean;
  setIsReceiveRoutes(value: boolean): void;

  getBalanceSettings(): CreateAccountResponse.BalanceSettings | undefined;
  setBalanceSettings(value?: CreateAccountResponse.BalanceSettings): void;
  hasBalanceSettings(): boolean;
  clearBalanceSettings(): void;

  getMaxPacketsPerSecond(): number;
  setMaxPacketsPerSecond(value: number): void;

  getSettlementEngineDetails(): CreateAccountResponse.SettlementEngineDetails | undefined;
  setSettlementEngineDetails(value?: CreateAccountResponse.SettlementEngineDetails): void;
  hasSettlementEngineDetails(): boolean;
  clearSettlementEngineDetails(): void;

  getIsParentAccount(): boolean;
  setIsParentAccount(value: boolean): void;

  getIsChildAccount(): boolean;
  setIsChildAccount(value: boolean): void;

  getIsPeerAccount(): boolean;
  setIsPeerAccount(value: boolean): void;

  getIsPeerOrParentAccount(): boolean;
  setIsPeerOrParentAccount(value: boolean): void;

  getPaymentpointer(): string;
  setPaymentpointer(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateAccountResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateAccountResponse): CreateAccountResponse.AsObject;
  static serializeBinaryToWriter(message: CreateAccountResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateAccountResponse;
  static deserializeBinaryFromReader(message: CreateAccountResponse, reader: jspb.BinaryReader): CreateAccountResponse;
}

export namespace CreateAccountResponse {
  export type AsObject = {
    accountRelationship: string,
    assetCode: string,
    assetScale: number,
    maximumPacketAmount: number,
    customSettingsMap: Array<[string, string]>,
    accountId: string,
    createdAt: string,
    modifiedAt: string,
    description: string,
    linkType: string,
    isInternal: boolean,
    isConnectioninitiator: boolean,
    ilpAddressSegment: string,
    isSendRoutes: boolean,
    isReceiveRoutes: boolean,
    balanceSettings?: CreateAccountResponse.BalanceSettings.AsObject,
    maxPacketsPerSecond: number,
    settlementEngineDetails?: CreateAccountResponse.SettlementEngineDetails.AsObject,
    isParentAccount: boolean,
    isChildAccount: boolean,
    isPeerAccount: boolean,
    isPeerOrParentAccount: boolean,
    paymentpointer: string,
  }

  export class SettlementEngineDetails extends jspb.Message {
    getSettlementEngineAccountId(): string;
    setSettlementEngineAccountId(value: string): void;

    getBaseUrl(): string;
    setBaseUrl(value: string): void;

    getCustomSettingsMap(): jspb.Map<string, string>;
    clearCustomSettingsMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SettlementEngineDetails.AsObject;
    static toObject(includeInstance: boolean, msg: SettlementEngineDetails): SettlementEngineDetails.AsObject;
    static serializeBinaryToWriter(message: SettlementEngineDetails, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SettlementEngineDetails;
    static deserializeBinaryFromReader(message: SettlementEngineDetails, reader: jspb.BinaryReader): SettlementEngineDetails;
  }

  export namespace SettlementEngineDetails {
    export type AsObject = {
      settlementEngineAccountId: string,
      baseUrl: string,
      customSettingsMap: Array<[string, string]>,
    }
  }


  export class BalanceSettings extends jspb.Message {
    getMinBalance(): number;
    setMinBalance(value: number): void;

    getSettleThreshold(): number;
    setSettleThreshold(value: number): void;

    getSettleTo(): number;
    setSettleTo(value: number): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BalanceSettings.AsObject;
    static toObject(includeInstance: boolean, msg: BalanceSettings): BalanceSettings.AsObject;
    static serializeBinaryToWriter(message: BalanceSettings, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BalanceSettings;
    static deserializeBinaryFromReader(message: BalanceSettings, reader: jspb.BinaryReader): BalanceSettings;
  }

  export namespace BalanceSettings {
    export type AsObject = {
      minBalance: number,
      settleThreshold: number,
      settleTo: number,
    }
  }

}

