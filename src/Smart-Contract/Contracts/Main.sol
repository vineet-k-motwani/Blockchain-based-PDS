// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import './CentralGov.sol';
import './StateGov.sol';
import './Stakeholder.sol';
import './Product.sol';

contract Main{
  CentralGov public centralGov;
  StateGov public stateGov;
  Stakeholder public stakeholder;

  constructor(CentralGov _centralGov, StateGov _stateGov, Stakeholder _stakeholder) {
    centralGov = _centralGov;
    stateGov = _stateGov;
    stakeholder = _stakeholder;
  }

  function getRole(address _id) public view returns(string memory){
    if(keccak256(abi.encodePacked((centralGov.getRole(_id)))) != keccak256(abi.encodePacked(("")))){
      return centralGov.getRole(_id);
    }
    else if(keccak256(abi.encodePacked((stateGov.getRole(_id)))) != keccak256(abi.encodePacked(("")))){
      return stateGov.getRole(_id);
    }
    else if(keccak256(abi.encodePacked((stakeholder.getRole(_id)))) != keccak256(abi.encodePacked(("")))){
      return stakeholder.getRole(_id);
    }
    else if(stakeholder.isAdmin(_id)){
      return "admin";
    }
    else{
      return "new";
    }
  }
}