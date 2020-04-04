import * as jspb from "google-protobuf"

import * as org_xrpl_rpc_v1_common_pb from '../../../../org/xrpl/rpc/v1/common_pb';

export class LedgerObject extends jspb.Message {
  getAccountRoot(): AccountRoot | undefined;
  setAccountRoot(value?: AccountRoot): void;
  hasAccountRoot(): boolean;
  clearAccountRoot(): void;

  getAmendments(): Amendments | undefined;
  setAmendments(value?: Amendments): void;
  hasAmendments(): boolean;
  clearAmendments(): void;

  getCheck(): Check | undefined;
  setCheck(value?: Check): void;
  hasCheck(): boolean;
  clearCheck(): void;

  getDepositPreauth(): DepositPreauthObject | undefined;
  setDepositPreauth(value?: DepositPreauthObject): void;
  hasDepositPreauth(): boolean;
  clearDepositPreauth(): void;

  getDirectoryNode(): DirectoryNode | undefined;
  setDirectoryNode(value?: DirectoryNode): void;
  hasDirectoryNode(): boolean;
  clearDirectoryNode(): void;

  getEscrow(): Escrow | undefined;
  setEscrow(value?: Escrow): void;
  hasEscrow(): boolean;
  clearEscrow(): void;

  getFeeSettings(): FeeSettings | undefined;
  setFeeSettings(value?: FeeSettings): void;
  hasFeeSettings(): boolean;
  clearFeeSettings(): void;

  getLedgerHashes(): LedgerHashes | undefined;
  setLedgerHashes(value?: LedgerHashes): void;
  hasLedgerHashes(): boolean;
  clearLedgerHashes(): void;

  getOffer(): Offer | undefined;
  setOffer(value?: Offer): void;
  hasOffer(): boolean;
  clearOffer(): void;

  getPayChannel(): PayChannel | undefined;
  setPayChannel(value?: PayChannel): void;
  hasPayChannel(): boolean;
  clearPayChannel(): void;

  getRippleState(): RippleState | undefined;
  setRippleState(value?: RippleState): void;
  hasRippleState(): boolean;
  clearRippleState(): void;

  getSignerList(): SignerList | undefined;
  setSignerList(value?: SignerList): void;
  hasSignerList(): boolean;
  clearSignerList(): void;

  getObjectCase(): LedgerObject.ObjectCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LedgerObject.AsObject;
  static toObject(includeInstance: boolean, msg: LedgerObject): LedgerObject.AsObject;
  static serializeBinaryToWriter(message: LedgerObject, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LedgerObject;
  static deserializeBinaryFromReader(message: LedgerObject, reader: jspb.BinaryReader): LedgerObject;
}

export namespace LedgerObject {
  export type AsObject = {
    accountRoot?: AccountRoot.AsObject,
    amendments?: Amendments.AsObject,
    check?: Check.AsObject,
    depositPreauth?: DepositPreauthObject.AsObject,
    directoryNode?: DirectoryNode.AsObject,
    escrow?: Escrow.AsObject,
    feeSettings?: FeeSettings.AsObject,
    ledgerHashes?: LedgerHashes.AsObject,
    offer?: Offer.AsObject,
    payChannel?: PayChannel.AsObject,
    rippleState?: RippleState.AsObject,
    signerList?: SignerList.AsObject,
  }

  export enum ObjectCase { 
    OBJECT_NOT_SET = 0,
    ACCOUNT_ROOT = 1,
    AMENDMENTS = 2,
    CHECK = 3,
    DEPOSIT_PREAUTH = 4,
    DIRECTORY_NODE = 5,
    ESCROW = 6,
    FEE_SETTINGS = 7,
    LEDGER_HASHES = 8,
    OFFER = 9,
    PAY_CHANNEL = 10,
    RIPPLE_STATE = 11,
    SIGNER_LIST = 12,
  }
}

export class AccountRoot extends jspb.Message {
  getAccount(): org_xrpl_rpc_v1_common_pb.Account | undefined;
  setAccount(value?: org_xrpl_rpc_v1_common_pb.Account): void;
  hasAccount(): boolean;
  clearAccount(): void;

  getBalance(): org_xrpl_rpc_v1_common_pb.Balance | undefined;
  setBalance(value?: org_xrpl_rpc_v1_common_pb.Balance): void;
  hasBalance(): boolean;
  clearBalance(): void;

  getSequence(): org_xrpl_rpc_v1_common_pb.Sequence | undefined;
  setSequence(value?: org_xrpl_rpc_v1_common_pb.Sequence): void;
  hasSequence(): boolean;
  clearSequence(): void;

  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  getOwnerCount(): org_xrpl_rpc_v1_common_pb.OwnerCount | undefined;
  setOwnerCount(value?: org_xrpl_rpc_v1_common_pb.OwnerCount): void;
  hasOwnerCount(): boolean;
  clearOwnerCount(): void;

  getPreviousTransactionId(): org_xrpl_rpc_v1_common_pb.PreviousTransactionID | undefined;
  setPreviousTransactionId(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID): void;
  hasPreviousTransactionId(): boolean;
  clearPreviousTransactionId(): void;

  getPreviousTransactionLedgerSequence(): org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence | undefined;
  setPreviousTransactionLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence): void;
  hasPreviousTransactionLedgerSequence(): boolean;
  clearPreviousTransactionLedgerSequence(): void;

  getAccountTransactionId(): org_xrpl_rpc_v1_common_pb.AccountTransactionID | undefined;
  setAccountTransactionId(value?: org_xrpl_rpc_v1_common_pb.AccountTransactionID): void;
  hasAccountTransactionId(): boolean;
  clearAccountTransactionId(): void;

  getDomain(): org_xrpl_rpc_v1_common_pb.Domain | undefined;
  setDomain(value?: org_xrpl_rpc_v1_common_pb.Domain): void;
  hasDomain(): boolean;
  clearDomain(): void;

  getEmailHash(): org_xrpl_rpc_v1_common_pb.EmailHash | undefined;
  setEmailHash(value?: org_xrpl_rpc_v1_common_pb.EmailHash): void;
  hasEmailHash(): boolean;
  clearEmailHash(): void;

  getMessageKey(): org_xrpl_rpc_v1_common_pb.MessageKey | undefined;
  setMessageKey(value?: org_xrpl_rpc_v1_common_pb.MessageKey): void;
  hasMessageKey(): boolean;
  clearMessageKey(): void;

  getRegularKey(): org_xrpl_rpc_v1_common_pb.RegularKey | undefined;
  setRegularKey(value?: org_xrpl_rpc_v1_common_pb.RegularKey): void;
  hasRegularKey(): boolean;
  clearRegularKey(): void;

  getTickSize(): org_xrpl_rpc_v1_common_pb.TickSize | undefined;
  setTickSize(value?: org_xrpl_rpc_v1_common_pb.TickSize): void;
  hasTickSize(): boolean;
  clearTickSize(): void;

  getTransferRate(): org_xrpl_rpc_v1_common_pb.TransferRate | undefined;
  setTransferRate(value?: org_xrpl_rpc_v1_common_pb.TransferRate): void;
  hasTransferRate(): boolean;
  clearTransferRate(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountRoot.AsObject;
  static toObject(includeInstance: boolean, msg: AccountRoot): AccountRoot.AsObject;
  static serializeBinaryToWriter(message: AccountRoot, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountRoot;
  static deserializeBinaryFromReader(message: AccountRoot, reader: jspb.BinaryReader): AccountRoot;
}

export namespace AccountRoot {
  export type AsObject = {
    account?: org_xrpl_rpc_v1_common_pb.Account.AsObject,
    balance?: org_xrpl_rpc_v1_common_pb.Balance.AsObject,
    sequence?: org_xrpl_rpc_v1_common_pb.Sequence.AsObject,
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
    ownerCount?: org_xrpl_rpc_v1_common_pb.OwnerCount.AsObject,
    previousTransactionId?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID.AsObject,
    previousTransactionLedgerSequence?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence.AsObject,
    accountTransactionId?: org_xrpl_rpc_v1_common_pb.AccountTransactionID.AsObject,
    domain?: org_xrpl_rpc_v1_common_pb.Domain.AsObject,
    emailHash?: org_xrpl_rpc_v1_common_pb.EmailHash.AsObject,
    messageKey?: org_xrpl_rpc_v1_common_pb.MessageKey.AsObject,
    regularKey?: org_xrpl_rpc_v1_common_pb.RegularKey.AsObject,
    tickSize?: org_xrpl_rpc_v1_common_pb.TickSize.AsObject,
    transferRate?: org_xrpl_rpc_v1_common_pb.TransferRate.AsObject,
  }
}

export class Amendments extends jspb.Message {
  getAmendmentsList(): Array<Amendments.Amendment>;
  setAmendmentsList(value: Array<Amendments.Amendment>): void;
  clearAmendmentsList(): void;
  addAmendments(value?: Amendments.Amendment, index?: number): Amendments.Amendment;

  getMajoritiesList(): Array<Amendments.Majority>;
  setMajoritiesList(value: Array<Amendments.Majority>): void;
  clearMajoritiesList(): void;
  addMajorities(value?: Amendments.Majority, index?: number): Amendments.Majority;

  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Amendments.AsObject;
  static toObject(includeInstance: boolean, msg: Amendments): Amendments.AsObject;
  static serializeBinaryToWriter(message: Amendments, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Amendments;
  static deserializeBinaryFromReader(message: Amendments, reader: jspb.BinaryReader): Amendments;
}

export namespace Amendments {
  export type AsObject = {
    amendmentsList: Array<Amendments.Amendment.AsObject>,
    majoritiesList: Array<Amendments.Majority.AsObject>,
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
  }

  export class Amendment extends jspb.Message {
    getValue(): Uint8Array | string;
    getValue_asU8(): Uint8Array;
    getValue_asB64(): string;
    setValue(value: Uint8Array | string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Amendment.AsObject;
    static toObject(includeInstance: boolean, msg: Amendment): Amendment.AsObject;
    static serializeBinaryToWriter(message: Amendment, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Amendment;
    static deserializeBinaryFromReader(message: Amendment, reader: jspb.BinaryReader): Amendment;
  }

  export namespace Amendment {
    export type AsObject = {
      value: Uint8Array | string,
    }
  }


  export class Majority extends jspb.Message {
    getAmendment(): Amendments.Amendment | undefined;
    setAmendment(value?: Amendments.Amendment): void;
    hasAmendment(): boolean;
    clearAmendment(): void;

    getCloseTime(): org_xrpl_rpc_v1_common_pb.CloseTime | undefined;
    setCloseTime(value?: org_xrpl_rpc_v1_common_pb.CloseTime): void;
    hasCloseTime(): boolean;
    clearCloseTime(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Majority.AsObject;
    static toObject(includeInstance: boolean, msg: Majority): Majority.AsObject;
    static serializeBinaryToWriter(message: Majority, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Majority;
    static deserializeBinaryFromReader(message: Majority, reader: jspb.BinaryReader): Majority;
  }

  export namespace Majority {
    export type AsObject = {
      amendment?: Amendments.Amendment.AsObject,
      closeTime?: org_xrpl_rpc_v1_common_pb.CloseTime.AsObject,
    }
  }

}

export class Check extends jspb.Message {
  getAccount(): org_xrpl_rpc_v1_common_pb.Account | undefined;
  setAccount(value?: org_xrpl_rpc_v1_common_pb.Account): void;
  hasAccount(): boolean;
  clearAccount(): void;

  getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
  setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;
  hasDestination(): boolean;
  clearDestination(): void;

  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  getOwnerNode(): org_xrpl_rpc_v1_common_pb.OwnerNode | undefined;
  setOwnerNode(value?: org_xrpl_rpc_v1_common_pb.OwnerNode): void;
  hasOwnerNode(): boolean;
  clearOwnerNode(): void;

  getPreviousTransactionId(): org_xrpl_rpc_v1_common_pb.PreviousTransactionID | undefined;
  setPreviousTransactionId(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID): void;
  hasPreviousTransactionId(): boolean;
  clearPreviousTransactionId(): void;

  getPreviousTransactionLedgerSequence(): org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence | undefined;
  setPreviousTransactionLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence): void;
  hasPreviousTransactionLedgerSequence(): boolean;
  clearPreviousTransactionLedgerSequence(): void;

  getSendMax(): org_xrpl_rpc_v1_common_pb.SendMax | undefined;
  setSendMax(value?: org_xrpl_rpc_v1_common_pb.SendMax): void;
  hasSendMax(): boolean;
  clearSendMax(): void;

  getSequence(): org_xrpl_rpc_v1_common_pb.Sequence | undefined;
  setSequence(value?: org_xrpl_rpc_v1_common_pb.Sequence): void;
  hasSequence(): boolean;
  clearSequence(): void;

  getDestinationNode(): org_xrpl_rpc_v1_common_pb.DestinationNode | undefined;
  setDestinationNode(value?: org_xrpl_rpc_v1_common_pb.DestinationNode): void;
  hasDestinationNode(): boolean;
  clearDestinationNode(): void;

  getDestinationTag(): org_xrpl_rpc_v1_common_pb.DestinationTag | undefined;
  setDestinationTag(value?: org_xrpl_rpc_v1_common_pb.DestinationTag): void;
  hasDestinationTag(): boolean;
  clearDestinationTag(): void;

  getExpiration(): org_xrpl_rpc_v1_common_pb.Expiration | undefined;
  setExpiration(value?: org_xrpl_rpc_v1_common_pb.Expiration): void;
  hasExpiration(): boolean;
  clearExpiration(): void;

  getInvoiceId(): org_xrpl_rpc_v1_common_pb.InvoiceID | undefined;
  setInvoiceId(value?: org_xrpl_rpc_v1_common_pb.InvoiceID): void;
  hasInvoiceId(): boolean;
  clearInvoiceId(): void;

  getSourceTag(): org_xrpl_rpc_v1_common_pb.SourceTag | undefined;
  setSourceTag(value?: org_xrpl_rpc_v1_common_pb.SourceTag): void;
  hasSourceTag(): boolean;
  clearSourceTag(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Check.AsObject;
  static toObject(includeInstance: boolean, msg: Check): Check.AsObject;
  static serializeBinaryToWriter(message: Check, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Check;
  static deserializeBinaryFromReader(message: Check, reader: jspb.BinaryReader): Check;
}

export namespace Check {
  export type AsObject = {
    account?: org_xrpl_rpc_v1_common_pb.Account.AsObject,
    destination?: org_xrpl_rpc_v1_common_pb.Destination.AsObject,
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
    ownerNode?: org_xrpl_rpc_v1_common_pb.OwnerNode.AsObject,
    previousTransactionId?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID.AsObject,
    previousTransactionLedgerSequence?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence.AsObject,
    sendMax?: org_xrpl_rpc_v1_common_pb.SendMax.AsObject,
    sequence?: org_xrpl_rpc_v1_common_pb.Sequence.AsObject,
    destinationNode?: org_xrpl_rpc_v1_common_pb.DestinationNode.AsObject,
    destinationTag?: org_xrpl_rpc_v1_common_pb.DestinationTag.AsObject,
    expiration?: org_xrpl_rpc_v1_common_pb.Expiration.AsObject,
    invoiceId?: org_xrpl_rpc_v1_common_pb.InvoiceID.AsObject,
    sourceTag?: org_xrpl_rpc_v1_common_pb.SourceTag.AsObject,
  }
}

export class DepositPreauthObject extends jspb.Message {
  getAccount(): org_xrpl_rpc_v1_common_pb.Account | undefined;
  setAccount(value?: org_xrpl_rpc_v1_common_pb.Account): void;
  hasAccount(): boolean;
  clearAccount(): void;

  getAuthorize(): org_xrpl_rpc_v1_common_pb.Authorize | undefined;
  setAuthorize(value?: org_xrpl_rpc_v1_common_pb.Authorize): void;
  hasAuthorize(): boolean;
  clearAuthorize(): void;

  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  getOwnerNode(): org_xrpl_rpc_v1_common_pb.OwnerNode | undefined;
  setOwnerNode(value?: org_xrpl_rpc_v1_common_pb.OwnerNode): void;
  hasOwnerNode(): boolean;
  clearOwnerNode(): void;

  getPreviousTransactionId(): org_xrpl_rpc_v1_common_pb.PreviousTransactionID | undefined;
  setPreviousTransactionId(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID): void;
  hasPreviousTransactionId(): boolean;
  clearPreviousTransactionId(): void;

  getPreviousTransactionLedgerSequence(): org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence | undefined;
  setPreviousTransactionLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence): void;
  hasPreviousTransactionLedgerSequence(): boolean;
  clearPreviousTransactionLedgerSequence(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DepositPreauthObject.AsObject;
  static toObject(includeInstance: boolean, msg: DepositPreauthObject): DepositPreauthObject.AsObject;
  static serializeBinaryToWriter(message: DepositPreauthObject, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DepositPreauthObject;
  static deserializeBinaryFromReader(message: DepositPreauthObject, reader: jspb.BinaryReader): DepositPreauthObject;
}

export namespace DepositPreauthObject {
  export type AsObject = {
    account?: org_xrpl_rpc_v1_common_pb.Account.AsObject,
    authorize?: org_xrpl_rpc_v1_common_pb.Authorize.AsObject,
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
    ownerNode?: org_xrpl_rpc_v1_common_pb.OwnerNode.AsObject,
    previousTransactionId?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID.AsObject,
    previousTransactionLedgerSequence?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence.AsObject,
  }
}

export class DirectoryNode extends jspb.Message {
  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  getRootIndex(): org_xrpl_rpc_v1_common_pb.RootIndex | undefined;
  setRootIndex(value?: org_xrpl_rpc_v1_common_pb.RootIndex): void;
  hasRootIndex(): boolean;
  clearRootIndex(): void;

  getIndexesList(): Array<org_xrpl_rpc_v1_common_pb.Index>;
  setIndexesList(value: Array<org_xrpl_rpc_v1_common_pb.Index>): void;
  clearIndexesList(): void;
  addIndexes(value?: org_xrpl_rpc_v1_common_pb.Index, index?: number): org_xrpl_rpc_v1_common_pb.Index;

  getIndexNext(): org_xrpl_rpc_v1_common_pb.IndexNext | undefined;
  setIndexNext(value?: org_xrpl_rpc_v1_common_pb.IndexNext): void;
  hasIndexNext(): boolean;
  clearIndexNext(): void;

  getIndexPrevious(): org_xrpl_rpc_v1_common_pb.IndexPrevious | undefined;
  setIndexPrevious(value?: org_xrpl_rpc_v1_common_pb.IndexPrevious): void;
  hasIndexPrevious(): boolean;
  clearIndexPrevious(): void;

  getOwner(): org_xrpl_rpc_v1_common_pb.Owner | undefined;
  setOwner(value?: org_xrpl_rpc_v1_common_pb.Owner): void;
  hasOwner(): boolean;
  clearOwner(): void;

  getTakerPaysCurrency(): org_xrpl_rpc_v1_common_pb.TakerPaysCurrency | undefined;
  setTakerPaysCurrency(value?: org_xrpl_rpc_v1_common_pb.TakerPaysCurrency): void;
  hasTakerPaysCurrency(): boolean;
  clearTakerPaysCurrency(): void;

  getTakerPaysIssuer(): org_xrpl_rpc_v1_common_pb.TakerPaysIssuer | undefined;
  setTakerPaysIssuer(value?: org_xrpl_rpc_v1_common_pb.TakerPaysIssuer): void;
  hasTakerPaysIssuer(): boolean;
  clearTakerPaysIssuer(): void;

  getTakerGetsCurrency(): org_xrpl_rpc_v1_common_pb.TakerGetsCurreny | undefined;
  setTakerGetsCurrency(value?: org_xrpl_rpc_v1_common_pb.TakerGetsCurreny): void;
  hasTakerGetsCurrency(): boolean;
  clearTakerGetsCurrency(): void;

  getTakerGetsIssuer(): org_xrpl_rpc_v1_common_pb.TakerGetsIssuer | undefined;
  setTakerGetsIssuer(value?: org_xrpl_rpc_v1_common_pb.TakerGetsIssuer): void;
  hasTakerGetsIssuer(): boolean;
  clearTakerGetsIssuer(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DirectoryNode.AsObject;
  static toObject(includeInstance: boolean, msg: DirectoryNode): DirectoryNode.AsObject;
  static serializeBinaryToWriter(message: DirectoryNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DirectoryNode;
  static deserializeBinaryFromReader(message: DirectoryNode, reader: jspb.BinaryReader): DirectoryNode;
}

export namespace DirectoryNode {
  export type AsObject = {
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
    rootIndex?: org_xrpl_rpc_v1_common_pb.RootIndex.AsObject,
    indexesList: Array<org_xrpl_rpc_v1_common_pb.Index.AsObject>,
    indexNext?: org_xrpl_rpc_v1_common_pb.IndexNext.AsObject,
    indexPrevious?: org_xrpl_rpc_v1_common_pb.IndexPrevious.AsObject,
    owner?: org_xrpl_rpc_v1_common_pb.Owner.AsObject,
    takerPaysCurrency?: org_xrpl_rpc_v1_common_pb.TakerPaysCurrency.AsObject,
    takerPaysIssuer?: org_xrpl_rpc_v1_common_pb.TakerPaysIssuer.AsObject,
    takerGetsCurrency?: org_xrpl_rpc_v1_common_pb.TakerGetsCurreny.AsObject,
    takerGetsIssuer?: org_xrpl_rpc_v1_common_pb.TakerGetsIssuer.AsObject,
  }
}

export class Escrow extends jspb.Message {
  getAccount(): org_xrpl_rpc_v1_common_pb.Account | undefined;
  setAccount(value?: org_xrpl_rpc_v1_common_pb.Account): void;
  hasAccount(): boolean;
  clearAccount(): void;

  getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
  setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;
  hasDestination(): boolean;
  clearDestination(): void;

  getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
  setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;
  hasAmount(): boolean;
  clearAmount(): void;

  getCondition(): org_xrpl_rpc_v1_common_pb.Condition | undefined;
  setCondition(value?: org_xrpl_rpc_v1_common_pb.Condition): void;
  hasCondition(): boolean;
  clearCondition(): void;

  getCancelAfter(): org_xrpl_rpc_v1_common_pb.CancelAfter | undefined;
  setCancelAfter(value?: org_xrpl_rpc_v1_common_pb.CancelAfter): void;
  hasCancelAfter(): boolean;
  clearCancelAfter(): void;

  getFinishAfter(): org_xrpl_rpc_v1_common_pb.FinishAfter | undefined;
  setFinishAfter(value?: org_xrpl_rpc_v1_common_pb.FinishAfter): void;
  hasFinishAfter(): boolean;
  clearFinishAfter(): void;

  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  getSourceTag(): org_xrpl_rpc_v1_common_pb.SourceTag | undefined;
  setSourceTag(value?: org_xrpl_rpc_v1_common_pb.SourceTag): void;
  hasSourceTag(): boolean;
  clearSourceTag(): void;

  getDestinationTag(): org_xrpl_rpc_v1_common_pb.DestinationTag | undefined;
  setDestinationTag(value?: org_xrpl_rpc_v1_common_pb.DestinationTag): void;
  hasDestinationTag(): boolean;
  clearDestinationTag(): void;

  getOwnerNode(): org_xrpl_rpc_v1_common_pb.OwnerNode | undefined;
  setOwnerNode(value?: org_xrpl_rpc_v1_common_pb.OwnerNode): void;
  hasOwnerNode(): boolean;
  clearOwnerNode(): void;

  getDestinationNode(): org_xrpl_rpc_v1_common_pb.DestinationNode | undefined;
  setDestinationNode(value?: org_xrpl_rpc_v1_common_pb.DestinationNode): void;
  hasDestinationNode(): boolean;
  clearDestinationNode(): void;

  getPreviousTransactionId(): org_xrpl_rpc_v1_common_pb.PreviousTransactionID | undefined;
  setPreviousTransactionId(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID): void;
  hasPreviousTransactionId(): boolean;
  clearPreviousTransactionId(): void;

  getPreviousTransactionLedgerSequence(): org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence | undefined;
  setPreviousTransactionLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence): void;
  hasPreviousTransactionLedgerSequence(): boolean;
  clearPreviousTransactionLedgerSequence(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Escrow.AsObject;
  static toObject(includeInstance: boolean, msg: Escrow): Escrow.AsObject;
  static serializeBinaryToWriter(message: Escrow, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Escrow;
  static deserializeBinaryFromReader(message: Escrow, reader: jspb.BinaryReader): Escrow;
}

export namespace Escrow {
  export type AsObject = {
    account?: org_xrpl_rpc_v1_common_pb.Account.AsObject,
    destination?: org_xrpl_rpc_v1_common_pb.Destination.AsObject,
    amount?: org_xrpl_rpc_v1_common_pb.Amount.AsObject,
    condition?: org_xrpl_rpc_v1_common_pb.Condition.AsObject,
    cancelAfter?: org_xrpl_rpc_v1_common_pb.CancelAfter.AsObject,
    finishAfter?: org_xrpl_rpc_v1_common_pb.FinishAfter.AsObject,
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
    sourceTag?: org_xrpl_rpc_v1_common_pb.SourceTag.AsObject,
    destinationTag?: org_xrpl_rpc_v1_common_pb.DestinationTag.AsObject,
    ownerNode?: org_xrpl_rpc_v1_common_pb.OwnerNode.AsObject,
    destinationNode?: org_xrpl_rpc_v1_common_pb.DestinationNode.AsObject,
    previousTransactionId?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID.AsObject,
    previousTransactionLedgerSequence?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence.AsObject,
  }
}

export class FeeSettings extends jspb.Message {
  getBaseFee(): org_xrpl_rpc_v1_common_pb.BaseFee | undefined;
  setBaseFee(value?: org_xrpl_rpc_v1_common_pb.BaseFee): void;
  hasBaseFee(): boolean;
  clearBaseFee(): void;

  getReferenceFeeUnits(): org_xrpl_rpc_v1_common_pb.ReferenceFeeUnits | undefined;
  setReferenceFeeUnits(value?: org_xrpl_rpc_v1_common_pb.ReferenceFeeUnits): void;
  hasReferenceFeeUnits(): boolean;
  clearReferenceFeeUnits(): void;

  getReserveBase(): org_xrpl_rpc_v1_common_pb.ReserveBase | undefined;
  setReserveBase(value?: org_xrpl_rpc_v1_common_pb.ReserveBase): void;
  hasReserveBase(): boolean;
  clearReserveBase(): void;

  getReserveIncrement(): org_xrpl_rpc_v1_common_pb.ReserveIncrement | undefined;
  setReserveIncrement(value?: org_xrpl_rpc_v1_common_pb.ReserveIncrement): void;
  hasReserveIncrement(): boolean;
  clearReserveIncrement(): void;

  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeeSettings.AsObject;
  static toObject(includeInstance: boolean, msg: FeeSettings): FeeSettings.AsObject;
  static serializeBinaryToWriter(message: FeeSettings, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeeSettings;
  static deserializeBinaryFromReader(message: FeeSettings, reader: jspb.BinaryReader): FeeSettings;
}

export namespace FeeSettings {
  export type AsObject = {
    baseFee?: org_xrpl_rpc_v1_common_pb.BaseFee.AsObject,
    referenceFeeUnits?: org_xrpl_rpc_v1_common_pb.ReferenceFeeUnits.AsObject,
    reserveBase?: org_xrpl_rpc_v1_common_pb.ReserveBase.AsObject,
    reserveIncrement?: org_xrpl_rpc_v1_common_pb.ReserveIncrement.AsObject,
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
  }
}

export class LedgerHashes extends jspb.Message {
  getLastLedgerSequence(): org_xrpl_rpc_v1_common_pb.LastLedgerSequence | undefined;
  setLastLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.LastLedgerSequence): void;
  hasLastLedgerSequence(): boolean;
  clearLastLedgerSequence(): void;

  getHashesList(): Array<org_xrpl_rpc_v1_common_pb.Hash>;
  setHashesList(value: Array<org_xrpl_rpc_v1_common_pb.Hash>): void;
  clearHashesList(): void;
  addHashes(value?: org_xrpl_rpc_v1_common_pb.Hash, index?: number): org_xrpl_rpc_v1_common_pb.Hash;

  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LedgerHashes.AsObject;
  static toObject(includeInstance: boolean, msg: LedgerHashes): LedgerHashes.AsObject;
  static serializeBinaryToWriter(message: LedgerHashes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LedgerHashes;
  static deserializeBinaryFromReader(message: LedgerHashes, reader: jspb.BinaryReader): LedgerHashes;
}

export namespace LedgerHashes {
  export type AsObject = {
    lastLedgerSequence?: org_xrpl_rpc_v1_common_pb.LastLedgerSequence.AsObject,
    hashesList: Array<org_xrpl_rpc_v1_common_pb.Hash.AsObject>,
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
  }
}

export class Offer extends jspb.Message {
  getAccount(): org_xrpl_rpc_v1_common_pb.Account | undefined;
  setAccount(value?: org_xrpl_rpc_v1_common_pb.Account): void;
  hasAccount(): boolean;
  clearAccount(): void;

  getSequence(): org_xrpl_rpc_v1_common_pb.Sequence | undefined;
  setSequence(value?: org_xrpl_rpc_v1_common_pb.Sequence): void;
  hasSequence(): boolean;
  clearSequence(): void;

  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  getTakerPays(): org_xrpl_rpc_v1_common_pb.TakerPays | undefined;
  setTakerPays(value?: org_xrpl_rpc_v1_common_pb.TakerPays): void;
  hasTakerPays(): boolean;
  clearTakerPays(): void;

  getTakerGets(): org_xrpl_rpc_v1_common_pb.TakerGets | undefined;
  setTakerGets(value?: org_xrpl_rpc_v1_common_pb.TakerGets): void;
  hasTakerGets(): boolean;
  clearTakerGets(): void;

  getBookDirectory(): org_xrpl_rpc_v1_common_pb.BookDirectory | undefined;
  setBookDirectory(value?: org_xrpl_rpc_v1_common_pb.BookDirectory): void;
  hasBookDirectory(): boolean;
  clearBookDirectory(): void;

  getBookNode(): org_xrpl_rpc_v1_common_pb.BookNode | undefined;
  setBookNode(value?: org_xrpl_rpc_v1_common_pb.BookNode): void;
  hasBookNode(): boolean;
  clearBookNode(): void;

  getOwnerNode(): org_xrpl_rpc_v1_common_pb.OwnerNode | undefined;
  setOwnerNode(value?: org_xrpl_rpc_v1_common_pb.OwnerNode): void;
  hasOwnerNode(): boolean;
  clearOwnerNode(): void;

  getExpiration(): org_xrpl_rpc_v1_common_pb.Expiration | undefined;
  setExpiration(value?: org_xrpl_rpc_v1_common_pb.Expiration): void;
  hasExpiration(): boolean;
  clearExpiration(): void;

  getPreviousTransactionId(): org_xrpl_rpc_v1_common_pb.PreviousTransactionID | undefined;
  setPreviousTransactionId(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID): void;
  hasPreviousTransactionId(): boolean;
  clearPreviousTransactionId(): void;

  getPreviousTransactionLedgerSequence(): org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence | undefined;
  setPreviousTransactionLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence): void;
  hasPreviousTransactionLedgerSequence(): boolean;
  clearPreviousTransactionLedgerSequence(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Offer.AsObject;
  static toObject(includeInstance: boolean, msg: Offer): Offer.AsObject;
  static serializeBinaryToWriter(message: Offer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Offer;
  static deserializeBinaryFromReader(message: Offer, reader: jspb.BinaryReader): Offer;
}

export namespace Offer {
  export type AsObject = {
    account?: org_xrpl_rpc_v1_common_pb.Account.AsObject,
    sequence?: org_xrpl_rpc_v1_common_pb.Sequence.AsObject,
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
    takerPays?: org_xrpl_rpc_v1_common_pb.TakerPays.AsObject,
    takerGets?: org_xrpl_rpc_v1_common_pb.TakerGets.AsObject,
    bookDirectory?: org_xrpl_rpc_v1_common_pb.BookDirectory.AsObject,
    bookNode?: org_xrpl_rpc_v1_common_pb.BookNode.AsObject,
    ownerNode?: org_xrpl_rpc_v1_common_pb.OwnerNode.AsObject,
    expiration?: org_xrpl_rpc_v1_common_pb.Expiration.AsObject,
    previousTransactionId?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID.AsObject,
    previousTransactionLedgerSequence?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence.AsObject,
  }
}

export class PayChannel extends jspb.Message {
  getAccount(): org_xrpl_rpc_v1_common_pb.Account | undefined;
  setAccount(value?: org_xrpl_rpc_v1_common_pb.Account): void;
  hasAccount(): boolean;
  clearAccount(): void;

  getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
  setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;
  hasDestination(): boolean;
  clearDestination(): void;

  getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
  setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;
  hasAmount(): boolean;
  clearAmount(): void;

  getBalance(): org_xrpl_rpc_v1_common_pb.Balance | undefined;
  setBalance(value?: org_xrpl_rpc_v1_common_pb.Balance): void;
  hasBalance(): boolean;
  clearBalance(): void;

  getPublicKey(): org_xrpl_rpc_v1_common_pb.PublicKey | undefined;
  setPublicKey(value?: org_xrpl_rpc_v1_common_pb.PublicKey): void;
  hasPublicKey(): boolean;
  clearPublicKey(): void;

  getSettleDelay(): org_xrpl_rpc_v1_common_pb.SettleDelay | undefined;
  setSettleDelay(value?: org_xrpl_rpc_v1_common_pb.SettleDelay): void;
  hasSettleDelay(): boolean;
  clearSettleDelay(): void;

  getOwnerNode(): org_xrpl_rpc_v1_common_pb.OwnerNode | undefined;
  setOwnerNode(value?: org_xrpl_rpc_v1_common_pb.OwnerNode): void;
  hasOwnerNode(): boolean;
  clearOwnerNode(): void;

  getPreviousTransactionId(): org_xrpl_rpc_v1_common_pb.PreviousTransactionID | undefined;
  setPreviousTransactionId(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID): void;
  hasPreviousTransactionId(): boolean;
  clearPreviousTransactionId(): void;

  getPreviousTransactionLedgerSequence(): org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence | undefined;
  setPreviousTransactionLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence): void;
  hasPreviousTransactionLedgerSequence(): boolean;
  clearPreviousTransactionLedgerSequence(): void;

  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  getExpiration(): org_xrpl_rpc_v1_common_pb.Expiration | undefined;
  setExpiration(value?: org_xrpl_rpc_v1_common_pb.Expiration): void;
  hasExpiration(): boolean;
  clearExpiration(): void;

  getCancelAfter(): org_xrpl_rpc_v1_common_pb.CancelAfter | undefined;
  setCancelAfter(value?: org_xrpl_rpc_v1_common_pb.CancelAfter): void;
  hasCancelAfter(): boolean;
  clearCancelAfter(): void;

  getSourceTag(): org_xrpl_rpc_v1_common_pb.SourceTag | undefined;
  setSourceTag(value?: org_xrpl_rpc_v1_common_pb.SourceTag): void;
  hasSourceTag(): boolean;
  clearSourceTag(): void;

  getDestinationTag(): org_xrpl_rpc_v1_common_pb.DestinationTag | undefined;
  setDestinationTag(value?: org_xrpl_rpc_v1_common_pb.DestinationTag): void;
  hasDestinationTag(): boolean;
  clearDestinationTag(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PayChannel.AsObject;
  static toObject(includeInstance: boolean, msg: PayChannel): PayChannel.AsObject;
  static serializeBinaryToWriter(message: PayChannel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PayChannel;
  static deserializeBinaryFromReader(message: PayChannel, reader: jspb.BinaryReader): PayChannel;
}

export namespace PayChannel {
  export type AsObject = {
    account?: org_xrpl_rpc_v1_common_pb.Account.AsObject,
    destination?: org_xrpl_rpc_v1_common_pb.Destination.AsObject,
    amount?: org_xrpl_rpc_v1_common_pb.Amount.AsObject,
    balance?: org_xrpl_rpc_v1_common_pb.Balance.AsObject,
    publicKey?: org_xrpl_rpc_v1_common_pb.PublicKey.AsObject,
    settleDelay?: org_xrpl_rpc_v1_common_pb.SettleDelay.AsObject,
    ownerNode?: org_xrpl_rpc_v1_common_pb.OwnerNode.AsObject,
    previousTransactionId?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID.AsObject,
    previousTransactionLedgerSequence?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence.AsObject,
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
    expiration?: org_xrpl_rpc_v1_common_pb.Expiration.AsObject,
    cancelAfter?: org_xrpl_rpc_v1_common_pb.CancelAfter.AsObject,
    sourceTag?: org_xrpl_rpc_v1_common_pb.SourceTag.AsObject,
    destinationTag?: org_xrpl_rpc_v1_common_pb.DestinationTag.AsObject,
  }
}

export class RippleState extends jspb.Message {
  getBalance(): org_xrpl_rpc_v1_common_pb.Balance | undefined;
  setBalance(value?: org_xrpl_rpc_v1_common_pb.Balance): void;
  hasBalance(): boolean;
  clearBalance(): void;

  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  getLowLimit(): org_xrpl_rpc_v1_common_pb.LowLimit | undefined;
  setLowLimit(value?: org_xrpl_rpc_v1_common_pb.LowLimit): void;
  hasLowLimit(): boolean;
  clearLowLimit(): void;

  getHighLimit(): org_xrpl_rpc_v1_common_pb.HighLimit | undefined;
  setHighLimit(value?: org_xrpl_rpc_v1_common_pb.HighLimit): void;
  hasHighLimit(): boolean;
  clearHighLimit(): void;

  getLowNode(): org_xrpl_rpc_v1_common_pb.LowNode | undefined;
  setLowNode(value?: org_xrpl_rpc_v1_common_pb.LowNode): void;
  hasLowNode(): boolean;
  clearLowNode(): void;

  getHighNode(): org_xrpl_rpc_v1_common_pb.HighNode | undefined;
  setHighNode(value?: org_xrpl_rpc_v1_common_pb.HighNode): void;
  hasHighNode(): boolean;
  clearHighNode(): void;

  getLowQualityIn(): org_xrpl_rpc_v1_common_pb.LowQualityIn | undefined;
  setLowQualityIn(value?: org_xrpl_rpc_v1_common_pb.LowQualityIn): void;
  hasLowQualityIn(): boolean;
  clearLowQualityIn(): void;

  getLowQualityOut(): org_xrpl_rpc_v1_common_pb.LowQualityOut | undefined;
  setLowQualityOut(value?: org_xrpl_rpc_v1_common_pb.LowQualityOut): void;
  hasLowQualityOut(): boolean;
  clearLowQualityOut(): void;

  getHighQualityIn(): org_xrpl_rpc_v1_common_pb.HighQualityIn | undefined;
  setHighQualityIn(value?: org_xrpl_rpc_v1_common_pb.HighQualityIn): void;
  hasHighQualityIn(): boolean;
  clearHighQualityIn(): void;

  getHighQualityOut(): org_xrpl_rpc_v1_common_pb.HighQualityOut | undefined;
  setHighQualityOut(value?: org_xrpl_rpc_v1_common_pb.HighQualityOut): void;
  hasHighQualityOut(): boolean;
  clearHighQualityOut(): void;

  getPreviousTransactionId(): org_xrpl_rpc_v1_common_pb.PreviousTransactionID | undefined;
  setPreviousTransactionId(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID): void;
  hasPreviousTransactionId(): boolean;
  clearPreviousTransactionId(): void;

  getPreviousTransactionLedgerSequence(): org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence | undefined;
  setPreviousTransactionLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence): void;
  hasPreviousTransactionLedgerSequence(): boolean;
  clearPreviousTransactionLedgerSequence(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RippleState.AsObject;
  static toObject(includeInstance: boolean, msg: RippleState): RippleState.AsObject;
  static serializeBinaryToWriter(message: RippleState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RippleState;
  static deserializeBinaryFromReader(message: RippleState, reader: jspb.BinaryReader): RippleState;
}

export namespace RippleState {
  export type AsObject = {
    balance?: org_xrpl_rpc_v1_common_pb.Balance.AsObject,
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
    lowLimit?: org_xrpl_rpc_v1_common_pb.LowLimit.AsObject,
    highLimit?: org_xrpl_rpc_v1_common_pb.HighLimit.AsObject,
    lowNode?: org_xrpl_rpc_v1_common_pb.LowNode.AsObject,
    highNode?: org_xrpl_rpc_v1_common_pb.HighNode.AsObject,
    lowQualityIn?: org_xrpl_rpc_v1_common_pb.LowQualityIn.AsObject,
    lowQualityOut?: org_xrpl_rpc_v1_common_pb.LowQualityOut.AsObject,
    highQualityIn?: org_xrpl_rpc_v1_common_pb.HighQualityIn.AsObject,
    highQualityOut?: org_xrpl_rpc_v1_common_pb.HighQualityOut.AsObject,
    previousTransactionId?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID.AsObject,
    previousTransactionLedgerSequence?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence.AsObject,
  }
}

export class SignerList extends jspb.Message {
  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  getPreviousTransactionId(): org_xrpl_rpc_v1_common_pb.PreviousTransactionID | undefined;
  setPreviousTransactionId(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID): void;
  hasPreviousTransactionId(): boolean;
  clearPreviousTransactionId(): void;

  getPreviousTransactionLedgerSequence(): org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence | undefined;
  setPreviousTransactionLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence): void;
  hasPreviousTransactionLedgerSequence(): boolean;
  clearPreviousTransactionLedgerSequence(): void;

  getOwnerNode(): org_xrpl_rpc_v1_common_pb.OwnerNode | undefined;
  setOwnerNode(value?: org_xrpl_rpc_v1_common_pb.OwnerNode): void;
  hasOwnerNode(): boolean;
  clearOwnerNode(): void;

  getSignerEntriesList(): Array<org_xrpl_rpc_v1_common_pb.SignerEntry>;
  setSignerEntriesList(value: Array<org_xrpl_rpc_v1_common_pb.SignerEntry>): void;
  clearSignerEntriesList(): void;
  addSignerEntries(value?: org_xrpl_rpc_v1_common_pb.SignerEntry, index?: number): org_xrpl_rpc_v1_common_pb.SignerEntry;

  getSignerListId(): org_xrpl_rpc_v1_common_pb.SignerListID | undefined;
  setSignerListId(value?: org_xrpl_rpc_v1_common_pb.SignerListID): void;
  hasSignerListId(): boolean;
  clearSignerListId(): void;

  getSignerQuorum(): org_xrpl_rpc_v1_common_pb.SignerQuorum | undefined;
  setSignerQuorum(value?: org_xrpl_rpc_v1_common_pb.SignerQuorum): void;
  hasSignerQuorum(): boolean;
  clearSignerQuorum(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignerList.AsObject;
  static toObject(includeInstance: boolean, msg: SignerList): SignerList.AsObject;
  static serializeBinaryToWriter(message: SignerList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignerList;
  static deserializeBinaryFromReader(message: SignerList, reader: jspb.BinaryReader): SignerList;
}

export namespace SignerList {
  export type AsObject = {
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
    previousTransactionId?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID.AsObject,
    previousTransactionLedgerSequence?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence.AsObject,
    ownerNode?: org_xrpl_rpc_v1_common_pb.OwnerNode.AsObject,
    signerEntriesList: Array<org_xrpl_rpc_v1_common_pb.SignerEntry.AsObject>,
    signerListId?: org_xrpl_rpc_v1_common_pb.SignerListID.AsObject,
    signerQuorum?: org_xrpl_rpc_v1_common_pb.SignerQuorum.AsObject,
  }
}

export enum LedgerEntryType { 
  LEDGER_ENTRY_TYPE_UNSPECIFIED = 0,
  LEDGER_ENTRY_TYPE_ACCOUNT_ROOT = 1,
  LEDGER_ENTRY_TYPE_AMENDMENTS = 2,
  LEDGER_ENTRY_TYPE_CHECK = 3,
  LEDGER_ENTRY_TYPE_DEPOSIT_PREAUTH = 4,
  LEDGER_ENTRY_TYPE_DIRECTORY_NODE = 5,
  LEDGER_ENTRY_TYPE_ESCROW = 6,
  LEDGER_ENTRY_TYPE_FEE_SETTINGS = 7,
  LEDGER_ENTRY_TYPE_LEDGER_HASHES = 8,
  LEDGER_ENTRY_TYPE_OFFER = 9,
  LEDGER_ENTRY_TYPE_PAY_CHANNEL = 10,
  LEDGER_ENTRY_TYPE_RIPPLE_STATE = 11,
  LEDGER_ENTRY_TYPE_SIGNER_LIST = 12,
}
