import * as grpcWeb from 'grpc-web';

import * as org_xrpl_rpc_v1_get_account_info_pb from '../../../../org/xrpl/rpc/v1/get_account_info_pb';
import * as org_xrpl_rpc_v1_get_fee_pb from '../../../../org/xrpl/rpc/v1/get_fee_pb';
import * as org_xrpl_rpc_v1_submit_pb from '../../../../org/xrpl/rpc/v1/submit_pb';
import * as org_xrpl_rpc_v1_get_transaction_pb from '../../../../org/xrpl/rpc/v1/get_transaction_pb';
import * as org_xrpl_rpc_v1_get_account_transaction_history_pb from '../../../../org/xrpl/rpc/v1/get_account_transaction_history_pb';

export class XRPLedgerAPIServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getAccountInfo(
    request: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse) => void
  ): grpcWeb.ClientReadableStream<org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse>;

  getFee(
    request: org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse) => void
  ): grpcWeb.ClientReadableStream<org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse>;

  submitTransaction(
    request: org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse) => void
  ): grpcWeb.ClientReadableStream<org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse>;

  getTransaction(
    request: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse) => void
  ): grpcWeb.ClientReadableStream<org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse>;

  getAccountTransactionHistory(
    request: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse) => void
  ): grpcWeb.ClientReadableStream<org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse>;

}

export class XRPLedgerAPIServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getAccountInfo(
    request: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse>;

  getFee(
    request: org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse>;

  submitTransaction(
    request: org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse>;

  getTransaction(
    request: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse>;

  getAccountTransactionHistory(
    request: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse>;

}

