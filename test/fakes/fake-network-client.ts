import { NetworkClient } from "../../src/network-client"
import { AccountData } from "../../generated/rippled_pb";
import { AccountInfo } from "../../generated/rippled_pb";
import { AccountInfoRequest } from "../../generated/rippled_pb";

/**
 * A fake network client which stubs network interaction. This client always returns a successful response.
 * 
 * TODO(keefertaylor): Add an interface to this class that allows for mocking of errors.
 */
class FakeNetworkClient implements NetworkClient {
  getAccountInfo(_accountInfoRequest: AccountInfoRequest): Promise<AccountInfo> {
    const accountData = new AccountData();
    accountData.setBalance("4000");
    
    const accountInfo = new AccountInfo();
    accountInfo.setAccountData(accountData);

    return new Promise((resolve, _reject) => { 
      resolve(accountInfo);
    });
  }
}

export default FakeNetworkClient;