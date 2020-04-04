import * as grpcWeb from 'grpc-web';

import * as get_balance_response_pb from './get_balance_response_pb';
import * as get_balance_request_pb from './get_balance_request_pb';

export class BalanceServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getBalance(
    request: get_balance_request_pb.GetBalanceRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: get_balance_response_pb.GetBalanceResponse) => void
  ): grpcWeb.ClientReadableStream<get_balance_response_pb.GetBalanceResponse>;

}

export class BalanceServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  getBalance(
    request: get_balance_request_pb.GetBalanceRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<get_balance_response_pb.GetBalanceResponse>;

}

