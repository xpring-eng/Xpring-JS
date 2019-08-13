"use strict";

const XpringClient = require("./xpring-client.js");

let client = new XpringClient();
client.getBalance();

const x = function() {
  console.log("this is not run by tests");
};

console.log("Hello, world");

module.exports = {};
