const RippleClient = require('./ripple-client.js');
const Terram = require('./terram/terram.js');

const XRP = {
    RippleClient: RippleClient,
    Utils: Terram.Utils
}

module.exports = XRP;
