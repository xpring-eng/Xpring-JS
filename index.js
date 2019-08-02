const RippleClient = require('./ripple-client.js');
const Terram = require('./terram/terram.js');

const XRP = {
    RippleClient: RippleClient,
    Utils: Terram.Utils
}

module.exports = XRP;

async function main() {
    const r = new RippleClient("127.0.0.1:3001");
    const b = await r.getBalance("rnJfS9ozTiMXrQPTU53vxAgy9XWo9nGYNh");
    console.log("Balance: " + b + " drops!");
}

main();