pragma solidity ^0.5.7;

contract aibbMerkleAirdrop {

  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
  _;}

}
