const cattus = artifacts.require("cattus");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("cattus", function (/* accounts */) {
  it("should assert true", async function () {
    await cattus.deployed();
    return assert.isTrue(true);
  });
});
