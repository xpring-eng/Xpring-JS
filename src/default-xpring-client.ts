import { Signer, Utils, Wallet } from "xpring-common-js";
import { AccountInfo } from "../generated/legacy/account_info_pb";
import { GetAccountInfoRequest } from "../generated/legacy/get_account_info_request_pb";
import { GetFeeRequest } from "../generated/legacy/get_fee_request_pb";
import { GetLatestValidatedLedgerSequenceRequest } from "../generated/legacy/get_latest_validated_ledger_sequence_request_pb";
import { GetTransactionStatusRequest } from "../generated/legacy/get_transaction_status_request_pb";
import { Payment } from "../generated/legacy/payment_pb";
import { SubmitSignedTransactionRequest } from "../generated/legacy/submit_signed_transaction_request_pb";
import { Transaction } from "../generated/legacy/transaction_pb";
import { TransactionStatus as RawTransactionStatus } from "../generated/legacy/transaction_status_pb";
import { XRPAmount } from "../generated/legacy/xrp_amount_pb";
import { NetworkClient } from "./network-client";
import GRPCNetworkClient from "./grpc-network-client";
import { XpringClientDecorator } from "./xpring-client-decorator";
import TransactionStatus from "./transaction-status";

/* global BigInt */

/**
 * Error messages from XpringClient.
 */
export class XpringClientErrorMessages {
  public static readonly malformedResponse = "Malformed Response.";
  public static readonly signingFailure = "Unable to sign the transaction";
  /* eslint-disable  @typescript-eslint/indent */
  public static readonly xAddressRequired =
    "Please use the X-Address format. See: https://xrpaddress.info/.";
  /* eslint-enable  @typescript-eslint/indent */
}

/** A margin to pad the current ledger sequence with when submitting transactions. */
const ledgerSequenceMargin = 10;

/**
 * DefaultXpringClient is a client which interacts with the Xpring platform.
 */
class DefaultXpringClient implements XpringClientDecorator {
  /**
   * Create a new DefaultXpringClient.
   *
   * The DefaultXpringClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcURL The URL of the gRPC instance to connect to.
   */
  public static defaultXpringClientWithEndpoint(
    grpcURL: string
  ): DefaultXpringClient {
    const grpcClient = new GRPCNetworkClient(grpcURL);
    return new DefaultXpringClient(grpcClient);
  }

  /**
   * Create a new DefaultXpringClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `xpringClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   */
  public constructor(private readonly networkClient: NetworkClient) {}

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInt` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInt> {
    if (!Utils.isValidXAddress(address)) {
      return Promise.reject(
        new Error(XpringClientErrorMessages.xAddressRequired)
      );
    }

    return this.getAccountInfo(address).then(async accountInfo => {
      const balance = accountInfo.getBalance();
      if (balance === undefined) {
        return Promise.reject(
          new Error(XpringClientErrorMessages.malformedResponse)
        );
      }

      return BigInt(balance.getDrops());
    });
  }

  /**
   * Retrieve the transaction status for a given transaction hash.
   *
   * @param transactionHash The hash of the transaction.
   * @returns The status of the given transaction.
   */
  public async getTransactionStatus(
    transactionHash: string
  ): Promise<TransactionStatus> {
    const transactionStatus = await this.getRawTransactionStatus(
      transactionHash
    );

    // Return pending if the transaction is not validated.
    if (!transactionStatus.getValidated()) {
      return TransactionStatus.Pending;
    }

    return transactionStatus.getTransactionStatusCode().startsWith("tes")
      ? TransactionStatus.Succeeded
      : TransactionStatus.Failed;
  }

  /* eslint-disable no-dupe-class-members */

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param drops A `BigInt`, number or numeric string representing the number of drops to send.
   * @param destination A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async send(
    amount: BigInt | number | string,
    destination: string,
    sender: Wallet
  ): Promise<string> {
    if (!Utils.isValidXAddress(destination)) {
      return Promise.reject(
        new Error(XpringClientErrorMessages.xAddressRequired)
      );
    }

    const normalizedAmount = this.toBigInt(amount);

    return this.getFee().then(async fee => {
      return this.getAccountInfo(sender.getAddress()).then(
        async accountInfo => {
          return this.getLastValidatedLedgerSequence().then(
            async ledgerSequence => {
              if (accountInfo.getSequence() === undefined) {
                return Promise.reject(
                  new Error(XpringClientErrorMessages.malformedResponse)
                );
              }

              const xrpAmount = new XRPAmount();
              xrpAmount.setDrops(normalizedAmount.toString());

              const payment = new Payment();
              payment.setXrpAmount(xrpAmount);
              payment.setDestination(destination);

              const transaction = new Transaction();
              transaction.setAccount(sender.getAddress());
              transaction.setFee(fee);
              transaction.setSequence(accountInfo.getSequence());
              transaction.setPayment(payment);
              transaction.setLastLedgerSequence(
                ledgerSequence + ledgerSequenceMargin
              );
              transaction.setSigningPublicKeyHex(sender.getPublicKey());

              var signedTransaction;
              try {
                signedTransaction = Signer.signTransaction(transaction, sender);
              } catch (signingError) {
                const signingErrorMessage =
                  XpringClientErrorMessages.signingFailure +
                  ". " +
                  signingError.message;
                return Promise.reject(new Error(signingErrorMessage));
              }
              if (signedTransaction == undefined) {
                return Promise.reject(
                  new Error(XpringClientErrorMessages.signingFailure)
                );
              }

              const submitSignedTransactionRequest = new SubmitSignedTransactionRequest();
              submitSignedTransactionRequest.setSignedTransaction(
                signedTransaction
              );

              return this.networkClient
                .submitSignedTransaction(submitSignedTransactionRequest)
                .then(async response => {
                  const transactionBlob = response.getTransactionBlob();
                  const transactionHash = Utils.transactionBlobToTransactionHash(
                    transactionBlob
                  );
                  if (!transactionHash) {
                    return Promise.reject(
                      new Error(XpringClientErrorMessages.malformedResponse)
                    );
                  }
                  return Promise.resolve(transactionHash);
                });
            }
          );
        }
      );
    });
  }

  /* eslint-enable no-dupe-class-members */

  public async getLastValidatedLedgerSequence(): Promise<number> {
    const getLatestValidatedLedgerSequenceRequest = new GetLatestValidatedLedgerSequenceRequest();
    const ledgerSequence = await this.networkClient.getLatestValidatedLedgerSequence(
      getLatestValidatedLedgerSequenceRequest
    );
    return ledgerSequence.getIndex();
  }

  public async getRawTransactionStatus(
    transactionHash: string
  ): Promise<RawTransactionStatus> {
    const transactionStatusRequest = new GetTransactionStatusRequest();
    transactionStatusRequest.setTransactionHash(transactionHash);

    return await this.networkClient.getTransactionStatus(
      transactionStatusRequest
    );
  }

  private async getAccountInfo(address: string): Promise<AccountInfo> {
    const getAccountInfoRequest = new GetAccountInfoRequest();
    getAccountInfoRequest.setAddress(address);
    return this.networkClient.getAccountInfo(getAccountInfoRequest);
  }

  private async getFee(): Promise<XRPAmount> {
    const getFeeRequest = new GetFeeRequest();

    return this.networkClient.getFee(getFeeRequest).then(async fee => {
      const feeAmount = fee.getAmount();
      if (feeAmount == undefined) {
        return Promise.reject(
          new Error(XpringClientErrorMessages.malformedResponse)
        );
      }
      return feeAmount;
    });
  }

  /**
   * Convert a polymorphic numeric value into a BigInt.
   *
   * @param value The value to convert.
   * @returns A BigInt representing the input value.
   */
  private toBigInt(value: string | number | BigInt): BigInt {
    if (typeof value == "string" || typeof value == "number") {
      return BigInt(value);
    } else {
      // Value is already a BigInt.
      return value;
    }
  }
}

export default DefaultXpringClient;
