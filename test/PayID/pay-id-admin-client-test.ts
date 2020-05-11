// import { assert } from 'chai'
// import PayIDAdminClient from '../../src/PayID/pay-id-admin-client'
// import PayIDError, { PayIDErrorType } from '../../src/PayID/pay-id-error'

// const payID = '$xpring.money/keefertaylor'
// const xrpAddress = 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'
// const serviceURL = 'https://xpring.money'
// const authorizationToken = 'fake-bearer-token'

// describe('Pay ID Admin Client', function (): void {
//   it('addOrUpdateXRPAddressMapping - throws unimplemented', function (done): void {
//     // GIVEN a PayIDAdminClient.
//     const payIDAdminClient = new PayIDAdminClient(
//       authorizationToken,
//       serviceURL,
//     )

//     // WHEN an update is requested THEN an unimplemented error is thrown.
//     payIDAdminClient
//       .addOrUpdateXRPAddressMapping(payID, xrpAddress)
//       .catch((error) => {
//         assert.equal(
//           (error as PayIDError).errorType,
//           PayIDErrorType.Unimplemented,
//         )
//         done()
//       })
//   })

//   it('removeXRPAddressMapping - throws unimplemented', function (done): void {
//     // GIVEN a PayIDAdminClient.
//     const payIDAdminClient = new PayIDAdminClient(
//       authorizationToken,
//       serviceURL,
//     )

//     // WHEN an update is requested THEN an unimplemented error is thrown.
//     payIDAdminClient
//       .removeXRPAddressMapping(payID, xrpAddress)
//       .catch((error) => {
//         assert.equal(
//           (error as PayIDError).errorType,
//           PayIDErrorType.Unimplemented,
//         )
//         done()
//       })
//   })
// })
