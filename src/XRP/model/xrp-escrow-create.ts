import { XrpError, XrpErrorType } from '..'
import { XrplNetwork } from 'xpring-common-js'
import XrpUtils from '../xrp-utils'
import { EscrowCreate } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrpCurrencyAmount from './xrp-currency-amount'

/*
 * Represents an EscrowCreate transaction on the XRP Ledger.
 *
 * An EscrowCreate transaction sequesters XRP until the escrow process either finishes or is canceled.
 *
 * @see: https://xrpl.org/escrowcreate.html
 */
export default class XrpEscrowCreate {
  /**
   * Constructs an XrpEscrowCreate from an EscrowCreate protocol buffer.
   *
   * @param escrowCreate an EscrowCreate (protobuf object) whose field values will be used to construct an XrpEscrowCreate
   * @return an XrpEscrowCreate with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L178
   */
  public static from(
    escrowCreate: EscrowCreate,
    xrplNetwork: XrplNetwork,
  ): XrpEscrowCreate {
    // amount is a required field
    const amountCurrencyAmountProto = escrowCreate.getAmount()?.getValue()
    if (!amountCurrencyAmountProto) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'EscrowCreate protobuf is missing required `amount` field.',
      )
    }
    const amount = XrpCurrencyAmount.from(amountCurrencyAmountProto)

    const destination = escrowCreate.getDestination()?.getValue()?.getAddress()
    if (!destination) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'EscrowCreate protobuf is missing required `destination` field.',
      )
    }
    const destinationTag = escrowCreate.getDestinationTag()?.getValue()
    const destinationXAddress = XrpUtils.encodeXAddress(
      destination,
      destinationTag,
      xrplNetwork == XrplNetwork.Test || xrplNetwork == XrplNetwork.Dev,
    )
    // destinationXAddress is a required field
    if (!destinationXAddress) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Cannot construct XAddress from EscrowCreate protobuf `destination` and `destinationTag` fields.',
      )
    }

    const cancelAfter = escrowCreate.getCancelAfter()?.getValue()
    const finishAfter = escrowCreate.getFinishAfter()?.getValue()
    const condition = escrowCreate.getCondition()?.getValue_asB64()

    return new XrpEscrowCreate(
      amount,
      destinationXAddress,
      cancelAfter,
      finishAfter,
      condition,
    )
  }

  /**
   * @param amount Amount of XRP, in drops, to deduct from the sender's balance and escrow.
   *                Once escrowed, the XRP can either go to the Destination address (after the FinishAfter time)
   *                or returned to the sender (after the CancelAfter time).
   * @param destinationXAddress Address and (optional) destination tag to receive escrowed XRP, encoded as an X-address.
   *                            (See https://xrpaddress.info/)
   * @param cancelAfter (Optional) The time, in seconds since the Ripple Epoch, when this escrow expires.
   *                    This value is immutable; the funds can only be returned the sender after this time.
   * @param finishAfter (Optional) The time, in seconds since the Ripple Epoch, when the escrowed XRP can be released to the recipient.
   *                    This value is immutable; the funds cannot move until this time is reached.
   * @param condition (Optional) Hex value representing a PREIMAGE-SHA-256 crypto-condition.
   *                   The funds can only be delivered to the recipient if this condition is fulfilled.
   */
  private constructor(
    readonly amount: XrpCurrencyAmount,
    readonly destinationXAddress: string,
    readonly cancelAfter?: number,
    readonly finishAfter?: number,
    readonly condition?: string,
  ) {}
}
