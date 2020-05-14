import { assert } from 'chai'
import 'mocha'
import DefaultXRPClient from '../../src/XRP/default-xrp-client'

/** A default Xpring Client under test. */
const defaultClient = DefaultXRPClient.defaultXRPClientWithEndpoint(
  'main.xrp.xpring.io:50051',
)

describe('Default Xpring Client Integration Tests', function (): void {
  it('isLedgerSequenceValidated - validated ledger', async function (): Promise<
    void
  > {
    // GIVEN a sequence representing a validated ledger.
    const validatedLedgerSequence =
      (await defaultClient.getLastValidatedLedgerSequence()) - 10

    // WHEN the ledger is tested to be validated.
    const isValidated = await defaultClient.isLedgerSequenceValidated(
      validatedLedgerSequence,
    )

    // THEN the ledger is reported as validated.
    assert.isTrue(isValidated)
  })

  it('isLedgerSequenceValidated - open ledger', async function (): Promise<
    void
  > {
    // GIVEN a sequence representing the open ledger.
    const validatedLedgerSequence = await defaultClient.getLastValidatedLedgerSequence()

    // WHEN the ledger is tested to be validated.
    const isValidated = await defaultClient.isLedgerSequenceValidated(
      validatedLedgerSequence,
    )

    // THEN the ledger is reported as not validated.
    assert.isFalse(isValidated)
  })

  it('isLedgerSequenceValidated - not validated ledger', async function (): Promise<
    void
  > {
    // GIVEN a sequence representing a ledger in the future.
    const validatedLedgerSequence =
      (await defaultClient.getLastValidatedLedgerSequence()) + 100

    // WHEN the ledger is tested to be validated.
    const isValidated = await defaultClient.isLedgerSequenceValidated(
      validatedLedgerSequence,
    )

    // THEN the ledger is reported as not validated.
    assert.isFalse(isValidated)
  })
})
