import { assert } from 'chai'

import DefaultXpringClient, {
  XpringClientErrorMessages,
} from '../src/default-xpring-client'
import {
  FakeNetworkClient,
  FakeNetworkClientResponses,
} from './fakes/fake-network-client'
import 'mocha'

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'

const fakeSucceedingNetworkClient = new FakeNetworkClient()
const fakeErroringNetworkClient = new FakeNetworkClient(
  FakeNetworkClientResponses.defaultErrorResponses,
)

describe('Default Xpring Client', function(): void {
  it('Get Account Balance - successful response', async function(): Promise<
    void
  > {
    // GIVEN a LegacyDefaultXpringClient.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)

    // WHEN the balance for an account is requested.
    const balance = await xpringClient.getBalance(testAddress)

    // THEN the balance is returned.
    assert.exists(balance)
  })

  it('Get Account Balance - classic address', function(done): void {
    // GIVEN a XpringClient and a classic address
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
    const classicAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'

    // WHEN the balance for an account is requested THEN an error to use X-Addresses is thrown.
    xpringClient.getBalance(classicAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.message, XpringClientErrorMessages.xAddressRequired)
      done()
    })
  })

  it('Get Account Balance - error', function(done): void {
    // GIVEN a XpringClient which wraps an erroring network client.
    const xpringClient = new DefaultXpringClient(fakeErroringNetworkClient)

    // WHEN a balance is requested THEN an error is propagated.
    xpringClient.getBalance(testAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error, FakeNetworkClientResponses.defaultError)
      done()
    })
  })

  it('Get Account Balance - malformed response, no balance', function(done): void {
    // GIVEN a XpringClient which wraps a network client with a malformed response.
    const accountInfoResponse = FakeNetworkClientResponses.defaultAccountInfoResponse()
    accountInfoResponse.getAccountData()!.setBalance(undefined)
    const fakeNetworkClientResponses = new FakeNetworkClientResponses(
      accountInfoResponse,
    )
    const fakeNetworkClient = new FakeNetworkClient(fakeNetworkClientResponses)
    const xpringClient = new DefaultXpringClient(fakeNetworkClient)

    // WHEN a balance is requested THEN an error is propagated.
<<<<<<< HEAD
    xpringClient.getBalance(testAddress).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(error.message, XpringClientErrorMessages.malformedResponse);
      done();
    });
  });

  it("Get Transaction Status - Unvalidated Transaction and Failure Code", async function(): Promise<
    void
  > {
    // GIVEN a XpringClient which will return an unvalidated transaction with a failure code.
    const transactionStatusResponse = makeGetTxResponse(
      false,
      transactionStatusCodeFailure
    );
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      transactionStatusResponse
    );
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses);
    const xpringClient = new DefaultXpringClient(fakeNetworkClient);

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash
    );

    // THEN the status is pending.
    assert.deepEqual(transactionStatus, TransactionStatus.Pending);
  });

  it("Get Transaction Status - Unvalidated Transaction and Success Code", async function(): Promise<
    void
  > {
    // GIVEN a XpringClient which will return an unvalidated transaction with a success code.
    const transactionStatusResponse = makeGetTxResponse(
      false,
      transactionStatusCodeSuccess
    );
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      transactionStatusResponse
    );
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses);
    const xpringClient = new DefaultXpringClient(fakeNetworkClient);

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash
    );

    // THEN the status is pending.
    assert.deepEqual(transactionStatus, TransactionStatus.Pending);
  });

  it("Get Transaction Status - Validated Transaction and Failure Code", async function(): Promise<
    void
  > {
    // GIVEN a XpringClient which will return an validated transaction with a failure code.
    const transactionStatusResponse = makeGetTxResponse(
      true,
      transactionStatusCodeFailure
    );
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      transactionStatusResponse
    );
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses);
    const xpringClient = new DefaultXpringClient(fakeNetworkClient);

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash
    );

    // THEN the status is failed.
    assert.deepEqual(transactionStatus, TransactionStatus.Failed);
  });

  it("Get Transaction Status - Validated Transaction and Success Code", async function(): Promise<
    void
  > {
    // GIVEN a XpringClient which will return an validated transaction with a success code.
    const transactionStatusResponse = makeGetTxResponse(
      true,
      transactionStatusCodeSuccess
    );
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      transactionStatusResponse
    );
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses);
    const xpringClient = new DefaultXpringClient(fakeNetworkClient);

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash
    );

    // THEN the status is succeeded.
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded);
  });

  it("Get Transaction Status - Node Error", function(done): void {
    // GIVEN a XpringClient which will error when a transaction status is requested.
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      FakeNetworkClientResponses.defaultError
    );
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses);
    const xpringClient = new DefaultXpringClient(fakeNetworkClient);

    // WHEN the transaction status is retrieved THEN an error is thrown.
    xpringClient.getTransactionStatus(transactionHash).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(
        error.message,
        FakeNetworkClientResponses.defaultError.message
      );
      done();
    });
  });
});
=======
    xpringClient.getBalance(testAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.message, XpringClientErrorMessages.malformedResponse)
      done()
    })
  })
})
>>>>>>> origin/master
