import {
  AccountLinesResponse,
  JsonRpcRequestOptions,
} from '../shared/json-schema'
import axios, { AxiosInstance, AxiosResponse } from 'axios'

/**
 * A network client for interacting with the rippled JSON RPC.
 * @see https://xrpl.org/rippled-api.html
 */
export default class JsonRpcNetworkClient {
  private readonly axiosInstance: AxiosInstance

  /**
   * Create a new JsonRpcNetworkClient.
   *
   * @param jsonUrl The URL of the rippled node to query.
   * @see https://xrpl.org/get-started-with-the-rippled-api.html
   */
  public constructor(jsonUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: jsonUrl,
    })
  }

  /**
   * Submit a JSON request to the rippled server.
   *
   * @param jsonRequest A JSON object specifying the method and params of the request.
   * @see https://xrpl.org/request-formatting.html#json-rpc-format
   * @returns The response from the rippled server.
   */
  private async submitRequest(
    jsonRequest: JsonRpcRequestOptions,
  ): Promise<AxiosResponse<unknown>> {
    const axiosResponse = await this.axiosInstance
      .request({
        url: '/',
        method: 'post',
        data: jsonRequest,
        headers: { 'Content-Type': 'application/json' },
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(error.toJSON())
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          throw new Error('The request was made but no response was received.')
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error(error.message)
        }
      })
    return axiosResponse
  }

  /**
   * Submits an account_lines request to the rippled JSON RPC.
   *
   * @param account The XRPL account to query for trust lines.
   */
  public async getAccountLines(account: string): Promise<AccountLinesResponse> {
    // TODO: consider an option for including the 'peer' param in the request, which limits the returned trust lines to only
    // those shared between the two accounts. (This would have to be an argument to the method here and in i-c-client too.)
    const accountLinesRequest = {
      method: 'account_lines',
      params: [
        {
          account: account,
          ledger_index: 'validated',
        },
      ],
    }
    const axiosResponse: AxiosResponse = await this.submitRequest(
      accountLinesRequest,
    )
    const accountLinesResponse: AccountLinesResponse = axiosResponse.data
    return accountLinesResponse
  }
}
