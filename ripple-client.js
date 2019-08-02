const services = require('./pera/grpc/node_client/rippled_grpc_pb.js');
const messages = require('./pera/grpc/node_client/rippled_pb.js');
const Terram = require('./terram/terram.js');
const grpc = require('grpc');
const grpc_promise = require('grpc-promise');

class RippleClient {
    constructor(remoteAppianURL) {
        const networkClient = new services.RippledClient(remoteAppianURL, grpc.credentials.createInsecure());
        // grpc_promise.promisifyAll(networkClient);
        this.networkClient = networkClient;
    }

    async getBalance(address) {
        // if (!Terram.Utils.validateAddress(address)) {
        //     return undefined;
        // }

        const accountInfoRequest = new messages.AccountInfoRequest();
        accountInfoRequest.setAddress(address);

        // This is awful.
        const rippleClient = this;
        const accountInfoResponse = await new Promise(function(resolve, reject) {
            rippleClient.networkClient.getAccountInfo(accountInfoRequest, function(error, response) {
                resolve(response);
            });
        });
        
        
        console.log("WEEE: " + accountInfoResponse);
        return accountInfoResponse.getAccountData().getBalance();        
    }
}

module.exports = RippleClient;
