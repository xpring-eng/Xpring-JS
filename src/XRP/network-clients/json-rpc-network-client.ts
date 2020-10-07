import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

interface JsonRequest {
  method: string
  params: unknown
}

/**
 * A network client for interacting with the rippled JSON RPC.
 * @see https://xrpl.org/rippled-api.html
 */
export default class JsonRpcNetworkClient {
  private readonly axiosInstance: AxiosInstance

  public constructor(jsonUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: jsonUrl,
    })
  }

  public async submitRequest(
    jsonRequest: JsonRequest,
  ): Promise<AxiosResponse<unknown>> {
    const requestOptions: AxiosRequestConfig = {
      url: '/',
      method: 'post',
      data: jsonRequest,
      headers: { 'Content-Type': 'application/json' },
    }
    return await this.axiosInstance.request(requestOptions)
  }
}
