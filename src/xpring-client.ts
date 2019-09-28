import {
  AccountInfo,
  GetAccountInfoRequest,
  GetFeeRequest,
  Payment,
  Signer,
  SubmitSignedTransactionRequest,
  SubmitSignedTransactionResponse,
  Transaction,
  Wallet,
  XRPAmount
} from "xpring-common-js";
import { NetworkClient } from "./network-client";
import GRPCNetworkClient from "./grpc-network-client";

/**
 * Error messages from XpringClient.
 */
export class XpringClientErrorMessages {
  public static readonly malformedResponse = "Malformed Response.";
  public static readonly signingFailure = "Unable to sign the transaction";
}

/**
 * XpringClient is a client which interacts with the Xpring platform.
 */
class XpringClient {
  /**
   * Create a new XpringClient.
   *
   * The XpringClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcURL The URL of the gRPC instance to connect to.
   */
  public static xpringClientWithEndpoint(grpcURL: string): XpringClient {
    const grpcClient = new GRPCNetworkClient(grpcURL);
    return new XpringClient(grpcClient);
  }

  /**
   * Create a new XpringClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `xpringClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   */
  public constructor(private readonly networkClient: NetworkClient) {}

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The address to retrieve a balance for.
   * @returns The amount of XRP in the account.
   */
  public async getBalance(address: string): Promise<XRPAmount> {
    return this.getAccountInfo(address).then(async accountInfo => {
      const balance = accountInfo.getBalance();
      if (balance === undefined) {
        return Promise.reject(
          new Error(XpringClientErrorMessages.malformedResponse)
        );
      }

      return balance;
    });
  }

  public async send(
    sender: Wallet,
    amount: XRPAmount,
    destination: string
  ): Promise<SubmitSignedTransactionResponse> {
    return this.getFee().then(async fee => {
      return this.getAccountInfo(sender.getAddress()).then(
        async accountInfo => {
          if (accountInfo.getSequence() == undefined) {
            return Promise.reject(
              new Error(XpringClientErrorMessages.malformedResponse)
            );
          }

          const payment = new Payment();
          payment.setXrpAmount(amount);
          payment.setDestination(destination);

          const transaction = new Transaction();
          transaction.setAccount(sender.getAddress());
          transaction.setFee(fee);
          transaction.setSequence(accountInfo.getSequence());
          transaction.setPayment(payment);
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

          return this.networkClient.submitSignedTransaction(
            submitSignedTransactionRequest
          );
        }
      );
    });
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
}

export default XpringClient;
