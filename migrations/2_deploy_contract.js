var aibbMerkleAirdrop = artifacts.require("./aibbMerkleAirdrop.sol");

module.exports = function(deployer) {
  deployer.deploy(aibbMerkleAirdrop, "0xca35b7d915458ef540ade6068dfe2f44e8fa733c");
}
