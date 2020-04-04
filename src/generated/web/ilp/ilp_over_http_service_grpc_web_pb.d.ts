import * as grpcWeb from 'grpc-web';

import * as send_payment_request_pb from './send_payment_request_pb';
import * as send_payment_response_pb from './send_payment_response_pb';

export class IlpOverHttpServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  sendMoney(
    request: send_payment_request_pb.SendPaymentRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: send_payment_response_pb.SendPaymentResponse) => void
  ): grpcWeb.ClientReadableStream<send_payment_response_pb.SendPaymentResponse>;

}

export class IlpOverHttpServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  sendMoney(
    request: send_payment_request_pb.SendPaymentRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<send_payment_response_pb.SendPaymentResponse>;

}

