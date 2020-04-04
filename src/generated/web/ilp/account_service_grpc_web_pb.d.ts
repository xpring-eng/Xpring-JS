import * as grpcWeb from 'grpc-web';

import * as get_account_response_pb from './get_account_response_pb';
import * as get_account_request_pb from './get_account_request_pb';
import * as create_account_request_pb from './create_account_request_pb';
import * as create_account_response_pb from './create_account_response_pb';

export class AccountServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getAccount(
    request: get_account_request_pb.GetAccountRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: get_account_response_pb.GetAccountResponse) => void
  ): grpcWeb.ClientReadableStream<get_account_response_pb.GetAccountResponse>;

  createAccount(
    request: create_account_request_pb.CreateAccountRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: create_account_response_pb.CreateAccountResponse) => void
  ): grpcWeb.ClientReadableStream<create_account_response_pb.CreateAccountResponse>;

}

export class AccountServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getAccount(
    request: get_account_request_pb.GetAccountRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<get_account_response_pb.GetAccountResponse>;

  createAccount(
    request: create_account_request_pb.CreateAccountRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<create_account_response_pb.CreateAccountResponse>;

}

