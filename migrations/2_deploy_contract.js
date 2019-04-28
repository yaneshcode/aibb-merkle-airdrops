var aibbMerkleAirdrop = artifacts.require("./aibbMerkleAirdrop.sol");

module.exports = function(deployer) {
  deployer.deploy(aibbMerkleAirdrop);
}
