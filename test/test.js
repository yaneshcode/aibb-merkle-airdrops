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

function computeMerkleProof(nodes, index) {
  let proof = [];

  if (index % 2 == 0) {
    proof.push(nodes[index-1]);
  }else{
    proof.push(nodes[index+1]);
  }

  let layer = 0;

  while (nodes.length != 1) {
    let layerNodes = [];

    for(let i = 0; i < nodes.length/2; i++) {
      layerNodes.push(hashTwoNodes(nodes[i*2], nodes[(i*2)+1]));
    }
    nodes = layerNodes;
    if (layer % 2 == 0) {
      proof.push(nodes[0]);
    } else {
      proof.push(nodes[1])
    }

  }

  // remove root from proof
  proof.pop();

  return {
    root: nodes[0],
    proof: proof

  }
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
    for(let i = 0; i < 8; i++) {
      console.log("Account #" + i + ": " + accounts[i])
      nodes.push(hashAddress(accounts[i]));
    }

    console.log("merkle root: ", computeMerkleRoot(nodes));
    console.log("merkle proof:");
    console.log(computeMerkleProof(nodes, 3))
  })
});
