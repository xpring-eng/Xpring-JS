import { AccountInfo } from "../generated/account_info_pb";
import { GetAccountInfoRequest } from "../generated/get_account_info_request_pb"

/**
 * An error that can occur when making a request.
 */
export interface NetworkServiceError {
  message: string;
  code: number;
  metadata: object;
}

/**
 * The network client interface provides a wrapper around network calls to the Xpring Platform.
 */
export interface NetworkClient {
  getAccountInfo(accountInfoRequest: GetAccountInfoRequest): Promise<AccountInfo>;
}
