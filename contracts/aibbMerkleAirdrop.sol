pragma solidity ^0.5.0;

contract aibbMerkleAirdrop {

  address public owner;
  bytes32 public root;
  mapping(address => bool) public claimedUser;

  constructor (bytes32 _root) public {
      owner = msg.sender;
      root = _root;
  }

  function claimToken ( bytes32[] memory _proof, uint256 index, address recipient) view public {
      require(claimedUser[(recipient)] == false);
      bytes32 node;

      if (index % 2 == 0) {
          node = keccak256(abi.encodePacked(recipient, _proof[0]));
      } else {
          node = keccak256(abi.encodePacked(_proof[0], recipient));
      }


      for (uint16 i = 1; i < _proof.length; i++) {
      if (i % 2 == 0) {
          node = keccak256(abi.encodePacked(_proof[i], node));
      }
          node = keccak256(abi.encodePacked(node, _proof[i]));
      }

      if(node == root) {
        claimedUser[recipient] = true;
       return true;
      } else {
        return false;
      }
  }
}
