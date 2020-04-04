// package: org.xrpl.rpc.v1
// file: org/xrpl/rpc/v1/transaction.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as org_xrpl_rpc_v1_common_pb from "../../../../org/xrpl/rpc/v1/common_pb";
import * as org_xrpl_rpc_v1_amount_pb from "../../../../org/xrpl/rpc/v1/amount_pb";
import * as org_xrpl_rpc_v1_account_pb from "../../../../org/xrpl/rpc/v1/account_pb";

export class Transaction extends jspb.Message { 

    hasAccount(): boolean;
    clearAccount(): void;
    getAccount(): org_xrpl_rpc_v1_common_pb.Account | undefined;
    setAccount(value?: org_xrpl_rpc_v1_common_pb.Account): void;


    hasFee(): boolean;
    clearFee(): void;
    getFee(): org_xrpl_rpc_v1_amount_pb.XRPDropsAmount | undefined;
    setFee(value?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount): void;


    hasSequence(): boolean;
    clearSequence(): void;
    getSequence(): org_xrpl_rpc_v1_common_pb.Sequence | undefined;
    setSequence(value?: org_xrpl_rpc_v1_common_pb.Sequence): void;


    hasPayment(): boolean;
    clearPayment(): void;
    getPayment(): Payment | undefined;
    setPayment(value?: Payment): void;


    hasAccountSet(): boolean;
    clearAccountSet(): void;
    getAccountSet(): AccountSet | undefined;
    setAccountSet(value?: AccountSet): void;


    hasAccountDelete(): boolean;
    clearAccountDelete(): void;
    getAccountDelete(): AccountDelete | undefined;
    setAccountDelete(value?: AccountDelete): void;


    hasCheckCancel(): boolean;
    clearCheckCancel(): void;
    getCheckCancel(): CheckCancel | undefined;
    setCheckCancel(value?: CheckCancel): void;


    hasCheckCash(): boolean;
    clearCheckCash(): void;
    getCheckCash(): CheckCash | undefined;
    setCheckCash(value?: CheckCash): void;


    hasCheckCreate(): boolean;
    clearCheckCreate(): void;
    getCheckCreate(): CheckCreate | undefined;
    setCheckCreate(value?: CheckCreate): void;


    hasDepositPreauth(): boolean;
    clearDepositPreauth(): void;
    getDepositPreauth(): DepositPreauth | undefined;
    setDepositPreauth(value?: DepositPreauth): void;


    hasEscrowCancel(): boolean;
    clearEscrowCancel(): void;
    getEscrowCancel(): EscrowCancel | undefined;
    setEscrowCancel(value?: EscrowCancel): void;


    hasEscrowCreate(): boolean;
    clearEscrowCreate(): void;
    getEscrowCreate(): EscrowCreate | undefined;
    setEscrowCreate(value?: EscrowCreate): void;


    hasEscrowFinish(): boolean;
    clearEscrowFinish(): void;
    getEscrowFinish(): EscrowFinish | undefined;
    setEscrowFinish(value?: EscrowFinish): void;


    hasOfferCancel(): boolean;
    clearOfferCancel(): void;
    getOfferCancel(): OfferCancel | undefined;
    setOfferCancel(value?: OfferCancel): void;


    hasOfferCreate(): boolean;
    clearOfferCreate(): void;
    getOfferCreate(): OfferCreate | undefined;
    setOfferCreate(value?: OfferCreate): void;


    hasPaymentChannelClaim(): boolean;
    clearPaymentChannelClaim(): void;
    getPaymentChannelClaim(): PaymentChannelClaim | undefined;
    setPaymentChannelClaim(value?: PaymentChannelClaim): void;


    hasPaymentChannelCreate(): boolean;
    clearPaymentChannelCreate(): void;
    getPaymentChannelCreate(): PaymentChannelCreate | undefined;
    setPaymentChannelCreate(value?: PaymentChannelCreate): void;


    hasPaymentChannelFund(): boolean;
    clearPaymentChannelFund(): void;
    getPaymentChannelFund(): PaymentChannelFund | undefined;
    setPaymentChannelFund(value?: PaymentChannelFund): void;


    hasSetRegularKey(): boolean;
    clearSetRegularKey(): void;
    getSetRegularKey(): SetRegularKey | undefined;
    setSetRegularKey(value?: SetRegularKey): void;


    hasSignerListSet(): boolean;
    clearSignerListSet(): void;
    getSignerListSet(): SignerListSet | undefined;
    setSignerListSet(value?: SignerListSet): void;


    hasTrustSet(): boolean;
    clearTrustSet(): void;
    getTrustSet(): TrustSet | undefined;
    setTrustSet(value?: TrustSet): void;


    hasSigningPublicKey(): boolean;
    clearSigningPublicKey(): void;
    getSigningPublicKey(): org_xrpl_rpc_v1_common_pb.SigningPublicKey | undefined;
    setSigningPublicKey(value?: org_xrpl_rpc_v1_common_pb.SigningPublicKey): void;


    hasTransactionSignature(): boolean;
    clearTransactionSignature(): void;
    getTransactionSignature(): org_xrpl_rpc_v1_common_pb.TransactionSignature | undefined;
    setTransactionSignature(value?: org_xrpl_rpc_v1_common_pb.TransactionSignature): void;


    hasFlags(): boolean;
    clearFlags(): void;
    getFlags(): org_xrpl_rpc_v1_common_pb.Flags | undefined;
    setFlags(value?: org_xrpl_rpc_v1_common_pb.Flags): void;


    hasLastLedgerSequence(): boolean;
    clearLastLedgerSequence(): void;
    getLastLedgerSequence(): org_xrpl_rpc_v1_common_pb.LastLedgerSequence | undefined;
    setLastLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.LastLedgerSequence): void;


    hasSourceTag(): boolean;
    clearSourceTag(): void;
    getSourceTag(): org_xrpl_rpc_v1_common_pb.SourceTag | undefined;
    setSourceTag(value?: org_xrpl_rpc_v1_common_pb.SourceTag): void;

    clearMemosList(): void;
    getMemosList(): Array<Memo>;
    setMemosList(value: Array<Memo>): void;
    addMemos(value?: Memo, index?: number): Memo;

    clearSignersList(): void;
    getSignersList(): Array<Signer>;
    setSignersList(value: Array<Signer>): void;
    addSigners(value?: Signer, index?: number): Signer;


    hasAccountTransactionId(): boolean;
    clearAccountTransactionId(): void;
    getAccountTransactionId(): org_xrpl_rpc_v1_common_pb.AccountTransactionID | undefined;
    setAccountTransactionId(value?: org_xrpl_rpc_v1_common_pb.AccountTransactionID): void;


    getTransactionDataCase(): Transaction.TransactionDataCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Transaction.AsObject;
    static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasMemoData(): boolean;
    clearMemoData(): void;
    getMemoData(): org_xrpl_rpc_v1_common_pb.MemoData | undefined;
    setMemoData(value?: org_xrpl_rpc_v1_common_pb.MemoData): void;


    hasMemoFormat(): boolean;
    clearMemoFormat(): void;
    getMemoFormat(): org_xrpl_rpc_v1_common_pb.MemoFormat | undefined;
    setMemoFormat(value?: org_xrpl_rpc_v1_common_pb.MemoFormat): void;


    hasMemoType(): boolean;
    clearMemoType(): void;
    getMemoType(): org_xrpl_rpc_v1_common_pb.MemoType | undefined;
    setMemoType(value?: org_xrpl_rpc_v1_common_pb.MemoType): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Memo.AsObject;
    static toObject(includeInstance: boolean, msg: Memo): Memo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasAccount(): boolean;
    clearAccount(): void;
    getAccount(): org_xrpl_rpc_v1_common_pb.Account | undefined;
    setAccount(value?: org_xrpl_rpc_v1_common_pb.Account): void;


    hasTransactionSignature(): boolean;
    clearTransactionSignature(): void;
    getTransactionSignature(): org_xrpl_rpc_v1_common_pb.TransactionSignature | undefined;
    setTransactionSignature(value?: org_xrpl_rpc_v1_common_pb.TransactionSignature): void;


    hasSigningPublicKey(): boolean;
    clearSigningPublicKey(): void;
    getSigningPublicKey(): org_xrpl_rpc_v1_common_pb.SigningPublicKey | undefined;
    setSigningPublicKey(value?: org_xrpl_rpc_v1_common_pb.SigningPublicKey): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Signer.AsObject;
    static toObject(includeInstance: boolean, msg: Signer): Signer.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasClearFlag(): boolean;
    clearClearFlag(): void;
    getClearFlag(): org_xrpl_rpc_v1_common_pb.ClearFlag | undefined;
    setClearFlag(value?: org_xrpl_rpc_v1_common_pb.ClearFlag): void;


    hasDomain(): boolean;
    clearDomain(): void;
    getDomain(): org_xrpl_rpc_v1_common_pb.Domain | undefined;
    setDomain(value?: org_xrpl_rpc_v1_common_pb.Domain): void;


    hasEmailHash(): boolean;
    clearEmailHash(): void;
    getEmailHash(): org_xrpl_rpc_v1_common_pb.EmailHash | undefined;
    setEmailHash(value?: org_xrpl_rpc_v1_common_pb.EmailHash): void;


    hasMessageKey(): boolean;
    clearMessageKey(): void;
    getMessageKey(): org_xrpl_rpc_v1_common_pb.MessageKey | undefined;
    setMessageKey(value?: org_xrpl_rpc_v1_common_pb.MessageKey): void;


    hasSetFlag(): boolean;
    clearSetFlag(): void;
    getSetFlag(): org_xrpl_rpc_v1_common_pb.SetFlag | undefined;
    setSetFlag(value?: org_xrpl_rpc_v1_common_pb.SetFlag): void;


    hasTransferRate(): boolean;
    clearTransferRate(): void;
    getTransferRate(): org_xrpl_rpc_v1_common_pb.TransferRate | undefined;
    setTransferRate(value?: org_xrpl_rpc_v1_common_pb.TransferRate): void;


    hasTickSize(): boolean;
    clearTickSize(): void;
    getTickSize(): org_xrpl_rpc_v1_common_pb.TickSize | undefined;
    setTickSize(value?: org_xrpl_rpc_v1_common_pb.TickSize): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AccountSet.AsObject;
    static toObject(includeInstance: boolean, msg: AccountSet): AccountSet.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasDestination(): boolean;
    clearDestination(): void;
    getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
    setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;


    hasDestinationTag(): boolean;
    clearDestinationTag(): void;
    getDestinationTag(): org_xrpl_rpc_v1_common_pb.DestinationTag | undefined;
    setDestinationTag(value?: org_xrpl_rpc_v1_common_pb.DestinationTag): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AccountDelete.AsObject;
    static toObject(includeInstance: boolean, msg: AccountDelete): AccountDelete.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasCheckId(): boolean;
    clearCheckId(): void;
    getCheckId(): org_xrpl_rpc_v1_common_pb.CheckID | undefined;
    setCheckId(value?: org_xrpl_rpc_v1_common_pb.CheckID): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CheckCancel.AsObject;
    static toObject(includeInstance: boolean, msg: CheckCancel): CheckCancel.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasCheckId(): boolean;
    clearCheckId(): void;
    getCheckId(): org_xrpl_rpc_v1_common_pb.CheckID | undefined;
    setCheckId(value?: org_xrpl_rpc_v1_common_pb.CheckID): void;


    hasAmount(): boolean;
    clearAmount(): void;
    getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
    setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;


    hasDeliverMin(): boolean;
    clearDeliverMin(): void;
    getDeliverMin(): org_xrpl_rpc_v1_common_pb.DeliverMin | undefined;
    setDeliverMin(value?: org_xrpl_rpc_v1_common_pb.DeliverMin): void;


    getAmountOneofCase(): CheckCash.AmountOneofCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CheckCash.AsObject;
    static toObject(includeInstance: boolean, msg: CheckCash): CheckCash.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasDestination(): boolean;
    clearDestination(): void;
    getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
    setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;


    hasSendMax(): boolean;
    clearSendMax(): void;
    getSendMax(): org_xrpl_rpc_v1_common_pb.SendMax | undefined;
    setSendMax(value?: org_xrpl_rpc_v1_common_pb.SendMax): void;


    hasDestinationTag(): boolean;
    clearDestinationTag(): void;
    getDestinationTag(): org_xrpl_rpc_v1_common_pb.DestinationTag | undefined;
    setDestinationTag(value?: org_xrpl_rpc_v1_common_pb.DestinationTag): void;


    hasExpiration(): boolean;
    clearExpiration(): void;
    getExpiration(): org_xrpl_rpc_v1_common_pb.Expiration | undefined;
    setExpiration(value?: org_xrpl_rpc_v1_common_pb.Expiration): void;


    hasInvoiceId(): boolean;
    clearInvoiceId(): void;
    getInvoiceId(): org_xrpl_rpc_v1_common_pb.InvoiceID | undefined;
    setInvoiceId(value?: org_xrpl_rpc_v1_common_pb.InvoiceID): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CheckCreate.AsObject;
    static toObject(includeInstance: boolean, msg: CheckCreate): CheckCreate.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasAuthorize(): boolean;
    clearAuthorize(): void;
    getAuthorize(): org_xrpl_rpc_v1_common_pb.Authorize | undefined;
    setAuthorize(value?: org_xrpl_rpc_v1_common_pb.Authorize): void;


    hasUnauthorize(): boolean;
    clearUnauthorize(): void;
    getUnauthorize(): org_xrpl_rpc_v1_common_pb.Unauthorize | undefined;
    setUnauthorize(value?: org_xrpl_rpc_v1_common_pb.Unauthorize): void;


    getAuthorizationOneofCase(): DepositPreauth.AuthorizationOneofCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DepositPreauth.AsObject;
    static toObject(includeInstance: boolean, msg: DepositPreauth): DepositPreauth.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasOwner(): boolean;
    clearOwner(): void;
    getOwner(): org_xrpl_rpc_v1_common_pb.Owner | undefined;
    setOwner(value?: org_xrpl_rpc_v1_common_pb.Owner): void;


    hasOfferSequence(): boolean;
    clearOfferSequence(): void;
    getOfferSequence(): org_xrpl_rpc_v1_common_pb.OfferSequence | undefined;
    setOfferSequence(value?: org_xrpl_rpc_v1_common_pb.OfferSequence): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EscrowCancel.AsObject;
    static toObject(includeInstance: boolean, msg: EscrowCancel): EscrowCancel.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasAmount(): boolean;
    clearAmount(): void;
    getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
    setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;


    hasDestination(): boolean;
    clearDestination(): void;
    getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
    setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;


    hasCancelAfter(): boolean;
    clearCancelAfter(): void;
    getCancelAfter(): org_xrpl_rpc_v1_common_pb.CancelAfter | undefined;
    setCancelAfter(value?: org_xrpl_rpc_v1_common_pb.CancelAfter): void;


    hasFinishAfter(): boolean;
    clearFinishAfter(): void;
    getFinishAfter(): org_xrpl_rpc_v1_common_pb.FinishAfter | undefined;
    setFinishAfter(value?: org_xrpl_rpc_v1_common_pb.FinishAfter): void;


    hasCondition(): boolean;
    clearCondition(): void;
    getCondition(): org_xrpl_rpc_v1_common_pb.Condition | undefined;
    setCondition(value?: org_xrpl_rpc_v1_common_pb.Condition): void;


    hasDestinationTag(): boolean;
    clearDestinationTag(): void;
    getDestinationTag(): org_xrpl_rpc_v1_common_pb.DestinationTag | undefined;
    setDestinationTag(value?: org_xrpl_rpc_v1_common_pb.DestinationTag): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EscrowCreate.AsObject;
    static toObject(includeInstance: boolean, msg: EscrowCreate): EscrowCreate.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasOwner(): boolean;
    clearOwner(): void;
    getOwner(): org_xrpl_rpc_v1_common_pb.Owner | undefined;
    setOwner(value?: org_xrpl_rpc_v1_common_pb.Owner): void;


    hasOfferSequence(): boolean;
    clearOfferSequence(): void;
    getOfferSequence(): org_xrpl_rpc_v1_common_pb.OfferSequence | undefined;
    setOfferSequence(value?: org_xrpl_rpc_v1_common_pb.OfferSequence): void;


    hasCondition(): boolean;
    clearCondition(): void;
    getCondition(): org_xrpl_rpc_v1_common_pb.Condition | undefined;
    setCondition(value?: org_xrpl_rpc_v1_common_pb.Condition): void;


    hasFulfillment(): boolean;
    clearFulfillment(): void;
    getFulfillment(): org_xrpl_rpc_v1_common_pb.Fulfillment | undefined;
    setFulfillment(value?: org_xrpl_rpc_v1_common_pb.Fulfillment): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EscrowFinish.AsObject;
    static toObject(includeInstance: boolean, msg: EscrowFinish): EscrowFinish.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasOfferSequence(): boolean;
    clearOfferSequence(): void;
    getOfferSequence(): org_xrpl_rpc_v1_common_pb.OfferSequence | undefined;
    setOfferSequence(value?: org_xrpl_rpc_v1_common_pb.OfferSequence): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OfferCancel.AsObject;
    static toObject(includeInstance: boolean, msg: OfferCancel): OfferCancel.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasExpiration(): boolean;
    clearExpiration(): void;
    getExpiration(): org_xrpl_rpc_v1_common_pb.Expiration | undefined;
    setExpiration(value?: org_xrpl_rpc_v1_common_pb.Expiration): void;


    hasOfferSequence(): boolean;
    clearOfferSequence(): void;
    getOfferSequence(): org_xrpl_rpc_v1_common_pb.OfferSequence | undefined;
    setOfferSequence(value?: org_xrpl_rpc_v1_common_pb.OfferSequence): void;


    hasTakerGets(): boolean;
    clearTakerGets(): void;
    getTakerGets(): org_xrpl_rpc_v1_common_pb.TakerGets | undefined;
    setTakerGets(value?: org_xrpl_rpc_v1_common_pb.TakerGets): void;


    hasTakerPays(): boolean;
    clearTakerPays(): void;
    getTakerPays(): org_xrpl_rpc_v1_common_pb.TakerPays | undefined;
    setTakerPays(value?: org_xrpl_rpc_v1_common_pb.TakerPays): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OfferCreate.AsObject;
    static toObject(includeInstance: boolean, msg: OfferCreate): OfferCreate.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasAmount(): boolean;
    clearAmount(): void;
    getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
    setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;


    hasDestination(): boolean;
    clearDestination(): void;
    getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
    setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;


    hasDestinationTag(): boolean;
    clearDestinationTag(): void;
    getDestinationTag(): org_xrpl_rpc_v1_common_pb.DestinationTag | undefined;
    setDestinationTag(value?: org_xrpl_rpc_v1_common_pb.DestinationTag): void;


    hasInvoiceId(): boolean;
    clearInvoiceId(): void;
    getInvoiceId(): org_xrpl_rpc_v1_common_pb.InvoiceID | undefined;
    setInvoiceId(value?: org_xrpl_rpc_v1_common_pb.InvoiceID): void;

    clearPathsList(): void;
    getPathsList(): Array<Payment.Path>;
    setPathsList(value: Array<Payment.Path>): void;
    addPaths(value?: Payment.Path, index?: number): Payment.Path;


    hasSendMax(): boolean;
    clearSendMax(): void;
    getSendMax(): org_xrpl_rpc_v1_common_pb.SendMax | undefined;
    setSendMax(value?: org_xrpl_rpc_v1_common_pb.SendMax): void;


    hasDeliverMin(): boolean;
    clearDeliverMin(): void;
    getDeliverMin(): org_xrpl_rpc_v1_common_pb.DeliverMin | undefined;
    setDeliverMin(value?: org_xrpl_rpc_v1_common_pb.DeliverMin): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Payment.AsObject;
    static toObject(includeInstance: boolean, msg: Payment): Payment.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

        hasAccount(): boolean;
        clearAccount(): void;
        getAccount(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
        setAccount(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;


        hasCurrency(): boolean;
        clearCurrency(): void;
        getCurrency(): org_xrpl_rpc_v1_amount_pb.Currency | undefined;
        setCurrency(value?: org_xrpl_rpc_v1_amount_pb.Currency): void;


        hasIssuer(): boolean;
        clearIssuer(): void;
        getIssuer(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
        setIssuer(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): PathElement.AsObject;
        static toObject(includeInstance: boolean, msg: PathElement): PathElement.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
        clearElementsList(): void;
        getElementsList(): Array<Payment.PathElement>;
        setElementsList(value: Array<Payment.PathElement>): void;
        addElements(value?: Payment.PathElement, index?: number): Payment.PathElement;


        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): Path.AsObject;
        static toObject(includeInstance: boolean, msg: Path): Path.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasChannel(): boolean;
    clearChannel(): void;
    getChannel(): org_xrpl_rpc_v1_common_pb.Channel | undefined;
    setChannel(value?: org_xrpl_rpc_v1_common_pb.Channel): void;


    hasBalance(): boolean;
    clearBalance(): void;
    getBalance(): org_xrpl_rpc_v1_common_pb.Balance | undefined;
    setBalance(value?: org_xrpl_rpc_v1_common_pb.Balance): void;


    hasAmount(): boolean;
    clearAmount(): void;
    getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
    setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;


    hasPaymentChannelSignature(): boolean;
    clearPaymentChannelSignature(): void;
    getPaymentChannelSignature(): org_xrpl_rpc_v1_common_pb.PaymentChannelSignature | undefined;
    setPaymentChannelSignature(value?: org_xrpl_rpc_v1_common_pb.PaymentChannelSignature): void;


    hasPublicKey(): boolean;
    clearPublicKey(): void;
    getPublicKey(): org_xrpl_rpc_v1_common_pb.PublicKey | undefined;
    setPublicKey(value?: org_xrpl_rpc_v1_common_pb.PublicKey): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PaymentChannelClaim.AsObject;
    static toObject(includeInstance: boolean, msg: PaymentChannelClaim): PaymentChannelClaim.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasAmount(): boolean;
    clearAmount(): void;
    getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
    setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;


    hasDestination(): boolean;
    clearDestination(): void;
    getDestination(): org_xrpl_rpc_v1_common_pb.Destination | undefined;
    setDestination(value?: org_xrpl_rpc_v1_common_pb.Destination): void;


    hasSettleDelay(): boolean;
    clearSettleDelay(): void;
    getSettleDelay(): org_xrpl_rpc_v1_common_pb.SettleDelay | undefined;
    setSettleDelay(value?: org_xrpl_rpc_v1_common_pb.SettleDelay): void;


    hasPublicKey(): boolean;
    clearPublicKey(): void;
    getPublicKey(): org_xrpl_rpc_v1_common_pb.PublicKey | undefined;
    setPublicKey(value?: org_xrpl_rpc_v1_common_pb.PublicKey): void;


    hasCancelAfter(): boolean;
    clearCancelAfter(): void;
    getCancelAfter(): org_xrpl_rpc_v1_common_pb.CancelAfter | undefined;
    setCancelAfter(value?: org_xrpl_rpc_v1_common_pb.CancelAfter): void;


    hasDestinationTag(): boolean;
    clearDestinationTag(): void;
    getDestinationTag(): org_xrpl_rpc_v1_common_pb.DestinationTag | undefined;
    setDestinationTag(value?: org_xrpl_rpc_v1_common_pb.DestinationTag): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PaymentChannelCreate.AsObject;
    static toObject(includeInstance: boolean, msg: PaymentChannelCreate): PaymentChannelCreate.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasChannel(): boolean;
    clearChannel(): void;
    getChannel(): org_xrpl_rpc_v1_common_pb.Channel | undefined;
    setChannel(value?: org_xrpl_rpc_v1_common_pb.Channel): void;


    hasAmount(): boolean;
    clearAmount(): void;
    getAmount(): org_xrpl_rpc_v1_common_pb.Amount | undefined;
    setAmount(value?: org_xrpl_rpc_v1_common_pb.Amount): void;


    hasExpiration(): boolean;
    clearExpiration(): void;
    getExpiration(): org_xrpl_rpc_v1_common_pb.Expiration | undefined;
    setExpiration(value?: org_xrpl_rpc_v1_common_pb.Expiration): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PaymentChannelFund.AsObject;
    static toObject(includeInstance: boolean, msg: PaymentChannelFund): PaymentChannelFund.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasRegularKey(): boolean;
    clearRegularKey(): void;
    getRegularKey(): org_xrpl_rpc_v1_common_pb.RegularKey | undefined;
    setRegularKey(value?: org_xrpl_rpc_v1_common_pb.RegularKey): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetRegularKey.AsObject;
    static toObject(includeInstance: boolean, msg: SetRegularKey): SetRegularKey.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasSignerQuorum(): boolean;
    clearSignerQuorum(): void;
    getSignerQuorum(): org_xrpl_rpc_v1_common_pb.SignerQuorum | undefined;
    setSignerQuorum(value?: org_xrpl_rpc_v1_common_pb.SignerQuorum): void;

    clearSignerEntriesList(): void;
    getSignerEntriesList(): Array<org_xrpl_rpc_v1_common_pb.SignerEntry>;
    setSignerEntriesList(value: Array<org_xrpl_rpc_v1_common_pb.SignerEntry>): void;
    addSignerEntries(value?: org_xrpl_rpc_v1_common_pb.SignerEntry, index?: number): org_xrpl_rpc_v1_common_pb.SignerEntry;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SignerListSet.AsObject;
    static toObject(includeInstance: boolean, msg: SignerListSet): SignerListSet.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

    hasLimitAmount(): boolean;
    clearLimitAmount(): void;
    getLimitAmount(): org_xrpl_rpc_v1_common_pb.LimitAmount | undefined;
    setLimitAmount(value?: org_xrpl_rpc_v1_common_pb.LimitAmount): void;


    hasQualityIn(): boolean;
    clearQualityIn(): void;
    getQualityIn(): org_xrpl_rpc_v1_common_pb.QualityIn | undefined;
    setQualityIn(value?: org_xrpl_rpc_v1_common_pb.QualityIn): void;


    hasQualityOut(): boolean;
    clearQualityOut(): void;
    getQualityOut(): org_xrpl_rpc_v1_common_pb.QualityOut | undefined;
    setQualityOut(value?: org_xrpl_rpc_v1_common_pb.QualityOut): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TrustSet.AsObject;
    static toObject(includeInstance: boolean, msg: TrustSet): TrustSet.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
