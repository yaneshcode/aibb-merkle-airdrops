var ethers = require('ethers');
const aibbMerkleAirdrop = artifacts.require("aibbMerkleAirdrop");

// Hashes two Nodes together and returns one hash.
function hashTwoNodes(a, b) {

  // Convert to bytes
  let aBytes = ethers.utils.toUtf8Bytes(a);
  let bBytes = ethers.utils.toUtf8Bytes(b);

  // Apply keccak256 hash
  return ethers.utils.keccak256([...aBytes, ...bBytes]);
}

// Hashes an Address and returns hash
function hashAddress(a) {
  let aBytes = ethers.utils.toUtf8Bytes(a);
  return ethers.utils.keccak256(aBytes);
}

// Calculate merkle root from leaf nodes
// note: leaf nodes must be hashed from data already
function computeMerkleRoot(nodes) {

  while(nodes.length != 1) {
    let layerNodes = [];
    for(let i = 0; i < nodes.length/2; i++) {
      layerNodes.push(hashTwoNodes(nodes[i*2], nodes[(i*2)+1]?nodes[(i*2)+1]:nodes[i*2]));
    }
    nodes = layerNodes;
  }

  return nodes[0];
}

// Start contract testing
contract('aibbMerkleAirdrop', (accounts) => {

  it("Should have owner", async () => {
    let instance = await aibbMerkleAirdrop.deployed();
    let owner = await instance.owner();
    let ownerAcc = accounts[0];
    assert.equal(ownerAcc, owner);
  });


  it("Calculate Merkle Root", async function () {

    // Take the first 6 accounts and hash them
    let nodes = [];
    for(let i = 0; i < 6; i++) {
      nodes.push(hashAddress(accounts[i]));
    }

    console.log("merkle root: ", computeMerkleRoot(nodes));
  })
});
