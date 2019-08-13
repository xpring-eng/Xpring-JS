"use strict";

const { XpringClient } = require("../build/xpring-client.js");
var assert = require("assert");

/** Placeholder test file to bootstrap project. */
describe("Test", function() {
  it("Does some client work!", function() {
    let client = new XpringClient();
    client.getBalance();    
  });
});

