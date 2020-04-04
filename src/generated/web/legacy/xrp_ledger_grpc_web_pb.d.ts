import * as grpcWeb from 'grpc-web';

import * as account_info_pb from './account_info_pb';
import * as fee_pb from './fee_pb';
import * as get_account_info_request_pb from './get_account_info_request_pb';
import * as get_fee_request_pb from './get_fee_request_pb';
import * as get_latest_validated_ledger_sequence_request_pb from './get_latest_validated_ledger_sequence_request_pb';
import * as get_transaction_status_request_pb from './get_transaction_status_request_pb';
import * as ledger_sequence_pb from './ledger_sequence_pb';
import * as submit_signed_transaction_request_pb from './submit_signed_transaction_request_pb';
import * as submit_signed_transaction_response_pb from './submit_signed_transaction_response_pb';
import * as transaction_status_pb from './transaction_status_pb';

export class XRPLedgerAPIClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getAccountInfo(
    request: get_account_info_request_pb.GetAccountInfoRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: account_info_pb.AccountInfo) => void
  ): grpcWeb.ClientReadableStream<account_info_pb.AccountInfo>;

  getFee(
    request: get_fee_request_pb.GetFeeRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: fee_pb.Fee) => void
  ): grpcWeb.ClientReadableStream<fee_pb.Fee>;

  submitSignedTransaction(
    request: submit_signed_transaction_request_pb.SubmitSignedTransactionRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: submit_signed_transaction_response_pb.SubmitSignedTransactionResponse) => void
  ): grpcWeb.ClientReadableStream<submit_signed_transaction_response_pb.SubmitSignedTransactionResponse>;

  getTransactionStatus(
    request: get_transaction_status_request_pb.GetTransactionStatusRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: transaction_status_pb.TransactionStatus) => void
  ): grpcWeb.ClientReadableStream<transaction_status_pb.TransactionStatus>;

  getLatestValidatedLedgerSequence(
    request: get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ledger_sequence_pb.LedgerSequence) => void
  ): grpcWeb.ClientReadableStream<ledger_sequence_pb.LedgerSequence>;

}

export class XRPLedgerAPIPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getAccountInfo(
    request: get_account_info_request_pb.GetAccountInfoRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<account_info_pb.AccountInfo>;

  getFee(
    request: get_fee_request_pb.GetFeeRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<fee_pb.Fee>;

  submitSignedTransaction(
    request: submit_signed_transaction_request_pb.SubmitSignedTransactionRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<submit_signed_transaction_response_pb.SubmitSignedTransactionResponse>;

  getTransactionStatus(
    request: get_transaction_status_request_pb.GetTransactionStatusRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<transaction_status_pb.TransactionStatus>;

  getLatestValidatedLedgerSequence(
    request: get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ledger_sequence_pb.LedgerSequence>;

}

