import * as jspb from "google-protobuf"

import * as org_xrpl_rpc_v1_common_pb from '../../../../org/xrpl/rpc/v1/common_pb';
import * as org_xrpl_rpc_v1_amount_pb from '../../../../org/xrpl/rpc/v1/amount_pb';
import * as org_xrpl_rpc_v1_account_pb from '../../../../org/xrpl/rpc/v1/account_pb';

export class Transaction extends jspb.Message {
  getAccount(): org_xrpl_rpc_v1_common_pb.Account | undefined;
  setAccount(value?: org_xrpl_rpc_v1_common_pb.Account): void;
  hasAccount(): boolean;
  clearAccount(): void;

  getFee(): org_xrpl_rpc_v1_amount_pb.XRPDropsAmount | undefined;
  setFee(value?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount): void;
  hasFee(): boolean;
  clearFee(): void;

  getSequence(): org_xrpl_rpc_v1_common_pb.Sequence | undefined;
  setSequence(value?: org_xrpl_rpc_v1_common_pb.Sequence): void;
  hasSequence(): boolean;
  clearSequence(): void;

  getPayment(): Payment | undefined;
  setPayment(value?: Payment): void;
  hasPayment(): boolean;
  clearPayment(): void;

  getAccountSet(): AccountSet | undefined;
  setAccountSet(value?: AccountSet): void;
  hasAccountSet(): boolean;
  clearAccountSet(): void;

  getAccountDelete(): AccountDelete | undefined;
  setAccountDelete(value?: AccountDelete): void;
  hasAccountDelete(): boolean;
  clearAccountDelete(): void;

  getCheckCancel(): CheckCancel | undefined;
  setCheckCancel(value?: CheckCancel): void;
  hasCheckCancel(): boolean;
  clearCheckCancel(): void;

  getCheckCash(): CheckCash | undefined;
  setCheckCash(value?: CheckCash): void;
  hasCheckCash(): boolean;
  clearCheckCash(): void;

  getCheckCreate(): CheckCreate | undefined;
  setCheckCreate(value?: CheckCreate): void;
  hasCheckCreate(): boolean;
  clearCheckCreate(): void;

  getDepositPreauth(): DepositPreauth | undefined;
  setDepositPreauth(value?: DepositPreauth): void;
  hasDepositPreauth(): boolean;
  clearDepositPreauth(): void;

  getEscrowCancel(): EscrowCancel | undefined;
  setEscrowCancel(value?: EscrowCancel): void;
  hasEscrowCancel(): boolean;
  clearEscrowCancel(): void;

  getEscrowCreate(): EscrowCreate | undefined;
  setEscrowCreate(value?: EscrowCreate): void;
  hasEscrowCreate(): boolean;
  clearEscrowCreate(): void;

  getEscrowFinish(): EscrowFinish | undefined;
  setEscrowFinish(value?: EscrowFinish): void;
  hasEscrowFinish(): boolean;
  clearEscrowFinish(): void;

  getOfferCancel(): OfferCancel | undefined;
  setOfferCancel(value?: OfferCancel): void;
  hasOfferCancel(): boolean;
  clearOfferCancel(): void;

  getOfferCreate(): OfferCreate | undefined;
  setOfferCreate(value?: OfferCreate): void;
  hasOfferCreate(): boolean;
  clearOfferCreate(): void;

  getPaymentChannelClaim(): PaymentChannelClaim | undefined;
  setPaymentChannelClaim(value?: PaymentChannelClaim): void;
  hasPaymentChannelClaim(): boolean;
  clearPaymentChannelClaim(): void;

  getPaymentChannelCreate(): PaymentChannelCreate | undefined;
  setPaymentChannelCreate(value?: PaymentChannelCreate): void;
  hasPaymentChannelCreate(): boolean;
  clearPaymentChannelCreate(): void;

  getPaymentChannelFund(): PaymentChannelFund | undefined;
  setPaymentChannelFund(value?: PaymentChannelFund): void;
  hasPaymentChannelFund(): boolean;
  clearPaymentChannelFund(): void;

  getSetRegularKey(): SetRegularKey | undefined;
  setSetRegularKey(value?: SetRegularKey): void;
  hasSetRegularKey(): boolean;
  clearSetRegularKey(): void;

  getSignerListSet(): SignerListSet | undefined;
  setSignerListSet(value?: SignerListSet): void;
  hasSignerListSet(): boolean;
  clearSignerListSet(): void;

  getTrustSet(): TrustSet | undefined;
  setTrustSet(value?: TrustSet): void;
  hasTrustSet(): boolean;
  clearTrustSet(): void;

  getSigningPublicKey(): org_xrpl_rpc_v1_common_pb.SigningPublicKey | undefined;
  setSigningPublicKey(value?: org_xrpl_rpc_v1_common_pb.SigningPublicKey): void;
  hasSigningPublicKey(): boolean;
  clearSigningPublicKey(): void;

  getTransactionSignature(): org_xrpl_rpc_v1_common_pb.TransactionSignature | undefined;
  setTransactionSignature(value?: org_xrpl_rpc_v1_common_pb.TransactionSignature): void;
  hasTransactionSignature(): boolean;
  clearTransactionSignature(): void;

  getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
  setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;
  hasFlags(): boolean;
  clearFlags(): void;

  getLastLedgerSequence(): org_xrpl_rpc_v1_common_pb.LastLedgerSequence | undefined;
  setLastLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.LastLedgerSequence): void;
  hasLastLedgerSequence(): boolean;
  clearLastLedgerSequence(): void;

  getSourceTag(): org_xrpl_rpc_v1_common_pb.SourceTag | undefined;
  setSourceTag(value?: org_xrpl_rpc_v1_common_pb.SourceTag): void;
  hasSourceTag(): boolean;
  clearSourceTag(): void;

  getMemosList(): Array<Memo>;
  setMemosList(value: Array<Memo>): void;
  clearMemosList(): void;
  addMemos(value?: Memo, index?: number): Memo;

  getSignersList(): Array<Signer>;
  setSignersList(value: Array<Signer>): void;
  clearSignersList(): void;
  addSigners(value?: Signer, index?: number): Signer;

  getAccountTransactionId(): org_xrpl_rpc_v1_common_pb.AccountTransactionID | undefined;
  setAccountTransactionId(value?: org_xrpl_rpc_v1_common_pb.AccountTransactionID): void;
  hasAccountTransactionId(): boolean;
  clearAccountTransactionId(): void;

  getTransactionDataCase(): Transaction.TransactionDataCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    account?: org_xrpl_rpc_v1_common_pb.Account.AsObject,
    fee?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount.AsObject,
    sequence?: org_xrpl_rpc_v1_common_pb.Sequence.AsObject,
    payment?: Payment.AsObject,
    accountSet?: AccountSet.AsObject,
    accountDelete?: AccountDelete.AsObject,
    checkCancel?: CheckCancel.AsObject,
    checkCash?: CheckCash.AsObject,
    checkCreate?: CheckCreate.AsObject,
    depositPreauth?: DepositPreauth.AsObject,
    escrowCancel?: EscrowCancel.AsObject,
    escrowCreate?: EscrowCreate.AsObject,
    escrowFinish?: EscrowFinish.AsObject,
    offerCancel?: OfferCancel.AsObject,
    offerCreate?: OfferCreate.AsObject,
    paymentChannelClaim?: PaymentChannelClaim.AsObject,
    paymentChannelCreate?: PaymentChannelCreate.AsObject,
    paymentChannelFund?: PaymentChannelFund.AsObject,
    setRegularKey?: SetRegularKey.AsObject,
    signerListSet?: SignerListSet.AsObject,
    trustSet?: TrustSet.AsObject,
    signingPublicKey?: org_xrpl_rpc_v1_common_pb.SigningPublicKey.AsObject,
    transactionSignature?: org_xrpl_rpc_v1_common_pb.TransactionSignature.AsObject,
    flags?: org_xrpl_rpc_v1_common_pb.Flags.AsObject,
    lastLedgerSequence?: org_xrpl_rpc_v1_common_pb.LastLedgerSequence.AsObject,
    sourceTag?: org_xrpl_rpc_v1_common_pb.SourceTag.AsObject,
    memosList: Array<Memo.AsObject>,
    signersList: Array<Signer.AsObject>,
    accountTransactionId?: org_xrpl_rpc_v1_common_pb.AccountTransactionID.AsObject,
  }

  export enum TransactionDataCase { 
    TRANSACTION_DATA_NOT_SET = 0,
    PAYMENT = 4,
    ACCOUNT_SET = 13,
    ACCOUNT_DELETE = 14,
    CHECK_CANCEL = 15,
    CHECK_CASH = 16,
    CHECK_CREATE = 17,
    DEPOSIT_PREAUTH = 18,
    ESCROW_CANCEL = 19,
    ESCROW_CREATE = 20,
    ESCROW_FINISH = 21,
    OFFER_CANCEL = 22,
    OFFER_CREATE = 23,
    PAYMENT_CHANNEL_CLAIM = 24,
    PAYMENT_CHANNEL_CREATE = 25,
    PAYMENT_CHANNEL_FUND = 26,
    SET_REGULAR_KEY = 27,
    SIGNER_LIST_SET = 28,
    TRUST_SET = 29,
  }
}

export class Memo extends jspb.Message {
  getMemoData(): org_xrpl_rpc_v1_common_pb.MemoData | undefined;
  setMemoData(value?: org_xrpl_rpc_v1_common_pb.MemoData): void;
  hasMemoData(): boolean;
  clearMemoData(): void;

  getMemoFormat(): org_xrpl_rpc_v1_common_pb.MemoFormat | undefined;
  setMemoFormat(value?: org_xrpl_rpc_v1_common_pb.MemoFormat): void;
  hasMemoFormat(): boolean;
  clearMemoFormat(): void;

  getMemoType(): org_xrpl_rpc_v1_common_pb.MemoType | undefined;
  setMemoType(value?: org_xrpl_rpc_v1_common_pb.MemoType): void;
  hasMemoType(): boolean;
  clearMemoType(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Memo.AsObject;
  static toObject(includeInstance: boolean, msg: Memo): Memo.AsObject;
  static serializeBinaryToWriter(message: Memo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Memo;
  static deserializeBinaryFromReader(message: Memo, reader: jspb.BinaryReader): Memo;
}

export namespace Memo {
  export type AsObject = {
    memoData?: org_xrpl_rpc_v1_common_pb.MemoData.AsObject,
    memoFormat?: org_xrpl_rpc_v1_common_pb.MemoFormat.AsObject,
    memoType?: org_xrpl_rpc_v1_common_pb.MemoType.AsObject,
  }
}

export class Signer extends jspb.Message {
  getAccount(): org_xrpl_rpc_v1_common_pb.Account | undefined;
  setAccount(value?: org_xrpl_rpc_v1_common_pb.Account): void;
  hasAccount(): boolean;
  clearAccount(): void;

  getTransactionSignature(): org_xrpl_rpc_v1_common_pb.TransactionSignature | undefined;
  setTransactionSignature(value?: org_xrpl_rpc_v1_common_pb.TransactionSignature): void;
  hasTransactionSignature(): boolean;
  clearTransactionSignature(): void;

  getSigningPublicKey(): org_xrpl_rpc_v1_common_pb.SigningPublicKey | undefined;
  setSigningPublicKey(value?: org_xrpl_rpc_v1_common_pb.SigningPublicKey): void;
  hasSigningPublicKey(): boolean;
  clearSigningPublicKey(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Signer.AsObject;
  static toObject(includeInstance: boolean, msg: Signer): Signer.AsObject;
  static serializeBinaryToWriter(message: Signer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Signer;
  static deserializeBinaryFromReader(message: Signer, reader: jspb.BinaryReader): Signer;
}

export namespace Signer {
  export type AsObject = {
    account?: org_xrpl_rpc_v1_common_pb.Account.AsObject,
    transactionSignature?: org_xrpl_rpc_v1_common_pb.TransactionSignature.AsObject,
    signingPublicKey?: org_xrpl_rpc_v1_common_pb.SigningPublicKey.AsObject,
  }
}

export class AccountSet extends jspb.Message {
  getClearFlag(): org_xrpl_rpc_v1_common_pb.ClearFlag | undefined;
  setClearFlag(value?: org_xrpl_rpc_v1_common_pb.ClearFlag): void;
  hasClearFlag(): boolean;
  clearClearFlag(): void;

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

  getSetFlag(): org_xrpl_rpc_v1_common_pb.SetFlag | undefined;
  setSetFlag(value?: org_xrpl_rpc_v1_common_pb.SetFlag): void;
  hasSetFlag(): boolean;
  clearSetFlag(): void;

  getTransferRate(): org_xrpl_rpc_v1_common_pb.TransferRate | undefined;
  setTransferRate(value?: org_xrpl_rpc_v1_common_pb.TransferRate): void;
  hasTransferRate(): boolean;
  clearTransferRate(): void;

  getTickSize(): org_xrpl_rpc_v1_common_pb.TickSize | undefined;
  setTickSize(value?: org_xrpl_rpc_v1_common_pb.TickSize): void;
  hasTickSize(): boolean;
  clearTickSize(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountSet.AsObject;
  static toObject(includeInstance: boolean, msg: AccountSet): AccountSet.AsObject;
  static serializeBinaryToWriter(message: AccountSet, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountSet;
  static deserializeBinaryFromReader(message: AccountSet, reader: jspb.BinaryReader): AccountSet;
}

export namespace AccountSet {
  export type AsObject = {
    clearFlag?: org_xrpl_rpc_v1_common_pb.ClearFlag.AsObject,
    domain?: org_xrpl_rpc_v1_common_pb.Domain.AsObject,
    emailHash?: org_xrpl_rpc_v1_common_pb.EmailHash.AsObject,
    messageKey?: org_xrpl_rpc_v1_common_pb.MessageKey.AsObject,
    setFlag?: org_xrpl_rpc_v1_common_pb.SetFlag.AsObject,
    transferRate?: org_xrpl_rpc_v1_common_pb.TransferRate.AsObject,
    tickSize?: org_xrpl_rpc_v1_common_pb.TickSize.AsObject,
  }
}

export class AccountDelete extends jspb.Message {
  getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
  setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;
  hasDestination(): boolean;
  clearDestination(): void;

  getDestinationTag(): org_xrpl_rpc_v1_common_pb.DestinationTag | undefined;
  setDestinationTag(value?: org_xrpl_rpc_v1_common_pb.DestinationTag): void;
  hasDestinationTag(): boolean;
  clearDestinationTag(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountDelete.AsObject;
  static toObject(includeInstance: boolean, msg: AccountDelete): AccountDelete.AsObject;
  static serializeBinaryToWriter(message: AccountDelete, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountDelete;
  static deserializeBinaryFromReader(message: AccountDelete, reader: jspb.BinaryReader): AccountDelete;
}

export namespace AccountDelete {
  export type AsObject = {
    destination?: org_xrpl_rpc_v1_common_pb.Destination.AsObject,
    destinationTag?: org_xrpl_rpc_v1_common_pb.DestinationTag.AsObject,
  }
}

export class CheckCancel extends jspb.Message {
  getCheckId(): org_xrpl_rpc_v1_common_pb.CheckID | undefined;
  setCheckId(value?: org_xrpl_rpc_v1_common_pb.CheckID): void;
  hasCheckId(): boolean;
  clearCheckId(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckCancel.AsObject;
  static toObject(includeInstance: boolean, msg: CheckCancel): CheckCancel.AsObject;
  static serializeBinaryToWriter(message: CheckCancel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckCancel;
  static deserializeBinaryFromReader(message: CheckCancel, reader: jspb.BinaryReader): CheckCancel;
}

export namespace CheckCancel {
  export type AsObject = {
    checkId?: org_xrpl_rpc_v1_common_pb.CheckID.AsObject,
  }
}

export class CheckCash extends jspb.Message {
  getCheckId(): org_xrpl_rpc_v1_common_pb.CheckID | undefined;
  setCheckId(value?: org_xrpl_rpc_v1_common_pb.CheckID): void;
  hasCheckId(): boolean;
  clearCheckId(): void;

  getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
  setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;
  hasAmount(): boolean;
  clearAmount(): void;

  getDeliverMin(): org_xrpl_rpc_v1_common_pb.DeliverMin | undefined;
  setDeliverMin(value?: org_xrpl_rpc_v1_common_pb.DeliverMin): void;
  hasDeliverMin(): boolean;
  clearDeliverMin(): void;

  getAmountOneofCase(): CheckCash.AmountOneofCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckCash.AsObject;
  static toObject(includeInstance: boolean, msg: CheckCash): CheckCash.AsObject;
  static serializeBinaryToWriter(message: CheckCash, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckCash;
  static deserializeBinaryFromReader(message: CheckCash, reader: jspb.BinaryReader): CheckCash;
}

export namespace CheckCash {
  export type AsObject = {
    checkId?: org_xrpl_rpc_v1_common_pb.CheckID.AsObject,
    amount?: org_xrpl_rpc_v1_common_pb.Amount.AsObject,
    deliverMin?: org_xrpl_rpc_v1_common_pb.DeliverMin.AsObject,
  }

  export enum AmountOneofCase { 
    AMOUNT_ONEOF_NOT_SET = 0,
    AMOUNT = 2,
    DELIVER_MIN = 3,
  }
}

export class CheckCreate extends jspb.Message {
  getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
  setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;
  hasDestination(): boolean;
  clearDestination(): void;

  getSendMax(): org_xrpl_rpc_v1_common_pb.SendMax | undefined;
  setSendMax(value?: org_xrpl_rpc_v1_common_pb.SendMax): void;
  hasSendMax(): boolean;
  clearSendMax(): void;

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

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckCreate.AsObject;
  static toObject(includeInstance: boolean, msg: CheckCreate): CheckCreate.AsObject;
  static serializeBinaryToWriter(message: CheckCreate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckCreate;
  static deserializeBinaryFromReader(message: CheckCreate, reader: jspb.BinaryReader): CheckCreate;
}

export namespace CheckCreate {
  export type AsObject = {
    destination?: org_xrpl_rpc_v1_common_pb.Destination.AsObject,
    sendMax?: org_xrpl_rpc_v1_common_pb.SendMax.AsObject,
    destinationTag?: org_xrpl_rpc_v1_common_pb.DestinationTag.AsObject,
    expiration?: org_xrpl_rpc_v1_common_pb.Expiration.AsObject,
    invoiceId?: org_xrpl_rpc_v1_common_pb.InvoiceID.AsObject,
  }
}

export class DepositPreauth extends jspb.Message {
  getAuthorize(): org_xrpl_rpc_v1_common_pb.Authorize | undefined;
  setAuthorize(value?: org_xrpl_rpc_v1_common_pb.Authorize): void;
  hasAuthorize(): boolean;
  clearAuthorize(): void;

  getUnauthorize(): org_xrpl_rpc_v1_common_pb.Unauthorize | undefined;
  setUnauthorize(value?: org_xrpl_rpc_v1_common_pb.Unauthorize): void;
  hasUnauthorize(): boolean;
  clearUnauthorize(): void;

  getAuthorizationOneofCase(): DepositPreauth.AuthorizationOneofCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DepositPreauth.AsObject;
  static toObject(includeInstance: boolean, msg: DepositPreauth): DepositPreauth.AsObject;
  static serializeBinaryToWriter(message: DepositPreauth, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DepositPreauth;
  static deserializeBinaryFromReader(message: DepositPreauth, reader: jspb.BinaryReader): DepositPreauth;
}

export namespace DepositPreauth {
  export type AsObject = {
    authorize?: org_xrpl_rpc_v1_common_pb.Authorize.AsObject,
    unauthorize?: org_xrpl_rpc_v1_common_pb.Unauthorize.AsObject,
  }

  export enum AuthorizationOneofCase { 
    AUTHORIZATION_ONEOF_NOT_SET = 0,
    AUTHORIZE = 1,
    UNAUTHORIZE = 2,
  }
}

export class EscrowCancel extends jspb.Message {
  getOwner(): org_xrpl_rpc_v1_common_pb.Owner | undefined;
  setOwner(value?: org_xrpl_rpc_v1_common_pb.Owner): void;
  hasOwner(): boolean;
  clearOwner(): void;

  getOfferSequence(): org_xrpl_rpc_v1_common_pb.OfferSequence | undefined;
  setOfferSequence(value?: org_xrpl_rpc_v1_common_pb.OfferSequence): void;
  hasOfferSequence(): boolean;
  clearOfferSequence(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EscrowCancel.AsObject;
  static toObject(includeInstance: boolean, msg: EscrowCancel): EscrowCancel.AsObject;
  static serializeBinaryToWriter(message: EscrowCancel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EscrowCancel;
  static deserializeBinaryFromReader(message: EscrowCancel, reader: jspb.BinaryReader): EscrowCancel;
}

export namespace EscrowCancel {
  export type AsObject = {
    owner?: org_xrpl_rpc_v1_common_pb.Owner.AsObject,
    offerSequence?: org_xrpl_rpc_v1_common_pb.OfferSequence.AsObject,
  }
}

export class EscrowCreate extends jspb.Message {
  getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
  setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;
  hasAmount(): boolean;
  clearAmount(): void;

  getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
  setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;
  hasDestination(): boolean;
  clearDestination(): void;

  getCancelAfter(): org_xrpl_rpc_v1_common_pb.CancelAfter | undefined;
  setCancelAfter(value?: org_xrpl_rpc_v1_common_pb.CancelAfter): void;
  hasCancelAfter(): boolean;
  clearCancelAfter(): void;

  getFinishAfter(): org_xrpl_rpc_v1_common_pb.FinishAfter | undefined;
  setFinishAfter(value?: org_xrpl_rpc_v1_common_pb.FinishAfter): void;
  hasFinishAfter(): boolean;
  clearFinishAfter(): void;

  getCondition(): org_xrpl_rpc_v1_common_pb.Condition | undefined;
  setCondition(value?: org_xrpl_rpc_v1_common_pb.Condition): void;
  hasCondition(): boolean;
  clearCondition(): void;

  getDestinationTag(): org_xrpl_rpc_v1_common_pb.DestinationTag | undefined;
  setDestinationTag(value?: org_xrpl_rpc_v1_common_pb.DestinationTag): void;
  hasDestinationTag(): boolean;
  clearDestinationTag(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EscrowCreate.AsObject;
  static toObject(includeInstance: boolean, msg: EscrowCreate): EscrowCreate.AsObject;
  static serializeBinaryToWriter(message: EscrowCreate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EscrowCreate;
  static deserializeBinaryFromReader(message: EscrowCreate, reader: jspb.BinaryReader): EscrowCreate;
}

export namespace EscrowCreate {
  export type AsObject = {
    amount?: org_xrpl_rpc_v1_common_pb.Amount.AsObject,
    destination?: org_xrpl_rpc_v1_common_pb.Destination.AsObject,
    cancelAfter?: org_xrpl_rpc_v1_common_pb.CancelAfter.AsObject,
    finishAfter?: org_xrpl_rpc_v1_common_pb.FinishAfter.AsObject,
    condition?: org_xrpl_rpc_v1_common_pb.Condition.AsObject,
    destinationTag?: org_xrpl_rpc_v1_common_pb.DestinationTag.AsObject,
  }
}

export class EscrowFinish extends jspb.Message {
  getOwner(): org_xrpl_rpc_v1_common_pb.Owner | undefined;
  setOwner(value?: org_xrpl_rpc_v1_common_pb.Owner): void;
  hasOwner(): boolean;
  clearOwner(): void;

  getOfferSequence(): org_xrpl_rpc_v1_common_pb.OfferSequence | undefined;
  setOfferSequence(value?: org_xrpl_rpc_v1_common_pb.OfferSequence): void;
  hasOfferSequence(): boolean;
  clearOfferSequence(): void;

  getCondition(): org_xrpl_rpc_v1_common_pb.Condition | undefined;
  setCondition(value?: org_xrpl_rpc_v1_common_pb.Condition): void;
  hasCondition(): boolean;
  clearCondition(): void;

  getFulfillment(): org_xrpl_rpc_v1_common_pb.Fulfillment | undefined;
  setFulfillment(value?: org_xrpl_rpc_v1_common_pb.Fulfillment): void;
  hasFulfillment(): boolean;
  clearFulfillment(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EscrowFinish.AsObject;
  static toObject(includeInstance: boolean, msg: EscrowFinish): EscrowFinish.AsObject;
  static serializeBinaryToWriter(message: EscrowFinish, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EscrowFinish;
  static deserializeBinaryFromReader(message: EscrowFinish, reader: jspb.BinaryReader): EscrowFinish;
}

export namespace EscrowFinish {
  export type AsObject = {
    owner?: org_xrpl_rpc_v1_common_pb.Owner.AsObject,
    offerSequence?: org_xrpl_rpc_v1_common_pb.OfferSequence.AsObject,
    condition?: org_xrpl_rpc_v1_common_pb.Condition.AsObject,
    fulfillment?: org_xrpl_rpc_v1_common_pb.Fulfillment.AsObject,
  }
}

export class OfferCancel extends jspb.Message {
  getOfferSequence(): org_xrpl_rpc_v1_common_pb.OfferSequence | undefined;
  setOfferSequence(value?: org_xrpl_rpc_v1_common_pb.OfferSequence): void;
  hasOfferSequence(): boolean;
  clearOfferSequence(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OfferCancel.AsObject;
  static toObject(includeInstance: boolean, msg: OfferCancel): OfferCancel.AsObject;
  static serializeBinaryToWriter(message: OfferCancel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OfferCancel;
  static deserializeBinaryFromReader(message: OfferCancel, reader: jspb.BinaryReader): OfferCancel;
}

export namespace OfferCancel {
  export type AsObject = {
    offerSequence?: org_xrpl_rpc_v1_common_pb.OfferSequence.AsObject,
  }
}

export class OfferCreate extends jspb.Message {
  getExpiration(): org_xrpl_rpc_v1_common_pb.Expiration | undefined;
  setExpiration(value?: org_xrpl_rpc_v1_common_pb.Expiration): void;
  hasExpiration(): boolean;
  clearExpiration(): void;

  getOfferSequence(): org_xrpl_rpc_v1_common_pb.OfferSequence | undefined;
  setOfferSequence(value?: org_xrpl_rpc_v1_common_pb.OfferSequence): void;
  hasOfferSequence(): boolean;
  clearOfferSequence(): void;

  getTakerGets(): org_xrpl_rpc_v1_common_pb.TakerGets | undefined;
  setTakerGets(value?: org_xrpl_rpc_v1_common_pb.TakerGets): void;
  hasTakerGets(): boolean;
  clearTakerGets(): void;

  getTakerPays(): org_xrpl_rpc_v1_common_pb.TakerPays | undefined;
  setTakerPays(value?: org_xrpl_rpc_v1_common_pb.TakerPays): void;
  hasTakerPays(): boolean;
  clearTakerPays(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OfferCreate.AsObject;
  static toObject(includeInstance: boolean, msg: OfferCreate): OfferCreate.AsObject;
  static serializeBinaryToWriter(message: OfferCreate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OfferCreate;
  static deserializeBinaryFromReader(message: OfferCreate, reader: jspb.BinaryReader): OfferCreate;
}

export namespace OfferCreate {
  export type AsObject = {
    expiration?: org_xrpl_rpc_v1_common_pb.Expiration.AsObject,
    offerSequence?: org_xrpl_rpc_v1_common_pb.OfferSequence.AsObject,
    takerGets?: org_xrpl_rpc_v1_common_pb.TakerGets.AsObject,
    takerPays?: org_xrpl_rpc_v1_common_pb.TakerPays.AsObject,
  }
}

export class Payment extends jspb.Message {
  getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
  setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;
  hasAmount(): boolean;
  clearAmount(): void;

  getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
  setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;
  hasDestination(): boolean;
  clearDestination(): void;

  getDestinationTag(): org_xrpl_rpc_v1_common_pb.DestinationTag | undefined;
  setDestinationTag(value?: org_xrpl_rpc_v1_common_pb.DestinationTag): void;
  hasDestinationTag(): boolean;
  clearDestinationTag(): void;

  getInvoiceId(): org_xrpl_rpc_v1_common_pb.InvoiceID | undefined;
  setInvoiceId(value?: org_xrpl_rpc_v1_common_pb.InvoiceID): void;
  hasInvoiceId(): boolean;
  clearInvoiceId(): void;

  getPathsList(): Array<Payment.Path>;
  setPathsList(value: Array<Payment.Path>): void;
  clearPathsList(): void;
  addPaths(value?: Payment.Path, index?: number): Payment.Path;

  getSendMax(): org_xrpl_rpc_v1_common_pb.SendMax | undefined;
  setSendMax(value?: org_xrpl_rpc_v1_common_pb.SendMax): void;
  hasSendMax(): boolean;
  clearSendMax(): void;

  getDeliverMin(): org_xrpl_rpc_v1_common_pb.DeliverMin | undefined;
  setDeliverMin(value?: org_xrpl_rpc_v1_common_pb.DeliverMin): void;
  hasDeliverMin(): boolean;
  clearDeliverMin(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Payment.AsObject;
  static toObject(includeInstance: boolean, msg: Payment): Payment.AsObject;
  static serializeBinaryToWriter(message: Payment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Payment;
  static deserializeBinaryFromReader(message: Payment, reader: jspb.BinaryReader): Payment;
}

export namespace Payment {
  export type AsObject = {
    amount?: org_xrpl_rpc_v1_common_pb.Amount.AsObject,
    destination?: org_xrpl_rpc_v1_common_pb.Destination.AsObject,
    destinationTag?: org_xrpl_rpc_v1_common_pb.DestinationTag.AsObject,
    invoiceId?: org_xrpl_rpc_v1_common_pb.InvoiceID.AsObject,
    pathsList: Array<Payment.Path.AsObject>,
    sendMax?: org_xrpl_rpc_v1_common_pb.SendMax.AsObject,
    deliverMin?: org_xrpl_rpc_v1_common_pb.DeliverMin.AsObject,
  }

  export class PathElement extends jspb.Message {
    getAccount(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
    setAccount(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;
    hasAccount(): boolean;
    clearAccount(): void;

    getCurrency(): org_xrpl_rpc_v1_amount_pb.Currency | undefined;
    setCurrency(value?: org_xrpl_rpc_v1_amount_pb.Currency): void;
    hasCurrency(): boolean;
    clearCurrency(): void;

    getIssuer(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
    setIssuer(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;
    hasIssuer(): boolean;
    clearIssuer(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PathElement.AsObject;
    static toObject(includeInstance: boolean, msg: PathElement): PathElement.AsObject;
    static serializeBinaryToWriter(message: PathElement, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PathElement;
    static deserializeBinaryFromReader(message: PathElement, reader: jspb.BinaryReader): PathElement;
  }

  export namespace PathElement {
    export type AsObject = {
      account?: org_xrpl_rpc_v1_account_pb.AccountAddress.AsObject,
      currency?: org_xrpl_rpc_v1_amount_pb.Currency.AsObject,
      issuer?: org_xrpl_rpc_v1_account_pb.AccountAddress.AsObject,
    }
  }


  export class Path extends jspb.Message {
    getElementsList(): Array<Payment.PathElement>;
    setElementsList(value: Array<Payment.PathElement>): void;
    clearElementsList(): void;
    addElements(value?: Payment.PathElement, index?: number): Payment.PathElement;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Path.AsObject;
    static toObject(includeInstance: boolean, msg: Path): Path.AsObject;
    static serializeBinaryToWriter(message: Path, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Path;
    static deserializeBinaryFromReader(message: Path, reader: jspb.BinaryReader): Path;
  }

  export namespace Path {
    export type AsObject = {
      elementsList: Array<Payment.PathElement.AsObject>,
    }
  }

}

export class PaymentChannelClaim extends jspb.Message {
  getChannel(): org_xrpl_rpc_v1_common_pb.Channel | undefined;
  setChannel(value?: org_xrpl_rpc_v1_common_pb.Channel): void;
  hasChannel(): boolean;
  clearChannel(): void;

  getBalance(): org_xrpl_rpc_v1_common_pb.Balance | undefined;
  setBalance(value?: org_xrpl_rpc_v1_common_pb.Balance): void;
  hasBalance(): boolean;
  clearBalance(): void;

  getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
  setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;
  hasAmount(): boolean;
  clearAmount(): void;

  getPaymentChannelSignature(): org_xrpl_rpc_v1_common_pb.PaymentChannelSignature | undefined;
  setPaymentChannelSignature(value?: org_xrpl_rpc_v1_common_pb.PaymentChannelSignature): void;
  hasPaymentChannelSignature(): boolean;
  clearPaymentChannelSignature(): void;

  getPublicKey(): org_xrpl_rpc_v1_common_pb.PublicKey | undefined;
  setPublicKey(value?: org_xrpl_rpc_v1_common_pb.PublicKey): void;
  hasPublicKey(): boolean;
  clearPublicKey(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PaymentChannelClaim.AsObject;
  static toObject(includeInstance: boolean, msg: PaymentChannelClaim): PaymentChannelClaim.AsObject;
  static serializeBinaryToWriter(message: PaymentChannelClaim, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PaymentChannelClaim;
  static deserializeBinaryFromReader(message: PaymentChannelClaim, reader: jspb.BinaryReader): PaymentChannelClaim;
}

export namespace PaymentChannelClaim {
  export type AsObject = {
    channel?: org_xrpl_rpc_v1_common_pb.Channel.AsObject,
    balance?: org_xrpl_rpc_v1_common_pb.Balance.AsObject,
    amount?: org_xrpl_rpc_v1_common_pb.Amount.AsObject,
    paymentChannelSignature?: org_xrpl_rpc_v1_common_pb.PaymentChannelSignature.AsObject,
    publicKey?: org_xrpl_rpc_v1_common_pb.PublicKey.AsObject,
  }
}

export class PaymentChannelCreate extends jspb.Message {
  getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
  setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;
  hasAmount(): boolean;
  clearAmount(): void;

  getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
  setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;
  hasDestination(): boolean;
  clearDestination(): void;

  getSettleDelay(): org_xrpl_rpc_v1_common_pb.SettleDelay | undefined;
  setSettleDelay(value?: org_xrpl_rpc_v1_common_pb.SettleDelay): void;
  hasSettleDelay(): boolean;
  clearSettleDelay(): void;

  getPublicKey(): org_xrpl_rpc_v1_common_pb.PublicKey | undefined;
  setPublicKey(value?: org_xrpl_rpc_v1_common_pb.PublicKey): void;
  hasPublicKey(): boolean;
  clearPublicKey(): void;

  getCancelAfter(): org_xrpl_rpc_v1_common_pb.CancelAfter | undefined;
  setCancelAfter(value?: org_xrpl_rpc_v1_common_pb.CancelAfter): void;
  hasCancelAfter(): boolean;
  clearCancelAfter(): void;

  getDestinationTag(): org_xrpl_rpc_v1_common_pb.DestinationTag | undefined;
  setDestinationTag(value?: org_xrpl_rpc_v1_common_pb.DestinationTag): void;
  hasDestinationTag(): boolean;
  clearDestinationTag(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PaymentChannelCreate.AsObject;
  static toObject(includeInstance: boolean, msg: PaymentChannelCreate): PaymentChannelCreate.AsObject;
  static serializeBinaryToWriter(message: PaymentChannelCreate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PaymentChannelCreate;
  static deserializeBinaryFromReader(message: PaymentChannelCreate, reader: jspb.BinaryReader): PaymentChannelCreate;
}

export namespace PaymentChannelCreate {
  export type AsObject = {
    amount?: org_xrpl_rpc_v1_common_pb.Amount.AsObject,
    destination?: org_xrpl_rpc_v1_common_pb.Destination.AsObject,
    settleDelay?: org_xrpl_rpc_v1_common_pb.SettleDelay.AsObject,
    publicKey?: org_xrpl_rpc_v1_common_pb.PublicKey.AsObject,
    cancelAfter?: org_xrpl_rpc_v1_common_pb.CancelAfter.AsObject,
    destinationTag?: org_xrpl_rpc_v1_common_pb.DestinationTag.AsObject,
  }
}

export class PaymentChannelFund extends jspb.Message {
  getChannel(): org_xrpl_rpc_v1_common_pb.Channel | undefined;
  setChannel(value?: org_xrpl_rpc_v1_common_pb.Channel): void;
  hasChannel(): boolean;
  clearChannel(): void;

  getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
  setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;
  hasAmount(): boolean;
  clearAmount(): void;

  getExpiration(): org_xrpl_rpc_v1_common_pb.Expiration | undefined;
  setExpiration(value?: org_xrpl_rpc_v1_common_pb.Expiration): void;
  hasExpiration(): boolean;
  clearExpiration(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PaymentChannelFund.AsObject;
  static toObject(includeInstance: boolean, msg: PaymentChannelFund): PaymentChannelFund.AsObject;
  static serializeBinaryToWriter(message: PaymentChannelFund, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PaymentChannelFund;
  static deserializeBinaryFromReader(message: PaymentChannelFund, reader: jspb.BinaryReader): PaymentChannelFund;
}

export namespace PaymentChannelFund {
  export type AsObject = {
    channel?: org_xrpl_rpc_v1_common_pb.Channel.AsObject,
    amount?: org_xrpl_rpc_v1_common_pb.Amount.AsObject,
    expiration?: org_xrpl_rpc_v1_common_pb.Expiration.AsObject,
  }
}

export class SetRegularKey extends jspb.Message {
  getRegularKey(): org_xrpl_rpc_v1_common_pb.RegularKey | undefined;
  setRegularKey(value?: org_xrpl_rpc_v1_common_pb.RegularKey): void;
  hasRegularKey(): boolean;
  clearRegularKey(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetRegularKey.AsObject;
  static toObject(includeInstance: boolean, msg: SetRegularKey): SetRegularKey.AsObject;
  static serializeBinaryToWriter(message: SetRegularKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetRegularKey;
  static deserializeBinaryFromReader(message: SetRegularKey, reader: jspb.BinaryReader): SetRegularKey;
}

export namespace SetRegularKey {
  export type AsObject = {
    regularKey?: org_xrpl_rpc_v1_common_pb.RegularKey.AsObject,
  }
}

export class SignerListSet extends jspb.Message {
  getSignerQuorum(): org_xrpl_rpc_v1_common_pb.SignerQuorum | undefined;
  setSignerQuorum(value?: org_xrpl_rpc_v1_common_pb.SignerQuorum): void;
  hasSignerQuorum(): boolean;
  clearSignerQuorum(): void;

  getSignerEntriesList(): Array<org_xrpl_rpc_v1_common_pb.SignerEntry>;
  setSignerEntriesList(value: Array<org_xrpl_rpc_v1_common_pb.SignerEntry>): void;
  clearSignerEntriesList(): void;
  addSignerEntries(value?: org_xrpl_rpc_v1_common_pb.SignerEntry, index?: number): org_xrpl_rpc_v1_common_pb.SignerEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignerListSet.AsObject;
  static toObject(includeInstance: boolean, msg: SignerListSet): SignerListSet.AsObject;
  static serializeBinaryToWriter(message: SignerListSet, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignerListSet;
  static deserializeBinaryFromReader(message: SignerListSet, reader: jspb.BinaryReader): SignerListSet;
}

export namespace SignerListSet {
  export type AsObject = {
    signerQuorum?: org_xrpl_rpc_v1_common_pb.SignerQuorum.AsObject,
    signerEntriesList: Array<org_xrpl_rpc_v1_common_pb.SignerEntry.AsObject>,
  }
}

export class TrustSet extends jspb.Message {
  getLimitAmount(): org_xrpl_rpc_v1_common_pb.LimitAmount | undefined;
  setLimitAmount(value?: org_xrpl_rpc_v1_common_pb.LimitAmount): void;
  hasLimitAmount(): boolean;
  clearLimitAmount(): void;

  getQualityIn(): org_xrpl_rpc_v1_common_pb.QualityIn | undefined;
  setQualityIn(value?: org_xrpl_rpc_v1_common_pb.QualityIn): void;
  hasQualityIn(): boolean;
  clearQualityIn(): void;

  getQualityOut(): org_xrpl_rpc_v1_common_pb.QualityOut | undefined;
  setQualityOut(value?: org_xrpl_rpc_v1_common_pb.QualityOut): void;
  hasQualityOut(): boolean;
  clearQualityOut(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrustSet.AsObject;
  static toObject(includeInstance: boolean, msg: TrustSet): TrustSet.AsObject;
  static serializeBinaryToWriter(message: TrustSet, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrustSet;
  static deserializeBinaryFromReader(message: TrustSet, reader: jspb.BinaryReader): TrustSet;
}

export namespace TrustSet {
  export type AsObject = {
    limitAmount?: org_xrpl_rpc_v1_common_pb.LimitAmount.AsObject,
    qualityIn?: org_xrpl_rpc_v1_common_pb.QualityIn.AsObject,
    qualityOut?: org_xrpl_rpc_v1_common_pb.QualityOut.AsObject,
  }
}

