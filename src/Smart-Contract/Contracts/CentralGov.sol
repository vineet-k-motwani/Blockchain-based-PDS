// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import './Stakeholder.sol';
contract CentralGov is Stakeholder {
  mapping(address => string[]) public _centralGovRawProducts;
  mapping(string => address[]) public _rawProductCentralGovs;

  constructor() Stakeholder() {}

  function registerCentralGov(
    string memory _name, 
    string memory _location, 
    string memory _role,
    string[] memory _rawProducts
  ) public returns (bool) {
    require (_stakeholders[msg.sender].id ==  address(0), "CentralGov::registerCentralGov: CentralGov already registered");
    _stakeholders[msg.sender] = stakeholder(msg.sender, _name, _location, _role, false);
    _centralGovRawProducts[msg.sender] = _rawProducts;
    for (uint i = 0; i < _rawProducts.length; i++) {
      _rawProductCentralGovs[_rawProducts[i]].push(msg.sender);
    }
    _stakeholderAddresses.push(msg.sender);
    return true;
  }

  function addRawProduct(string memory _rawProduct) public returns (bool) {
    bool productAlreadyAdded = false;
    for (uint i = 0; i < _centralGovRawProducts[msg.sender].length; i++) {
      if (keccak256(abi.encodePacked((_centralGovRawProducts[msg.sender][i]))) == keccak256(abi.encodePacked((_rawProduct)))) {
        productAlreadyAdded = true;
      }
    }
    require(!productAlreadyAdded, "CentralGov::addRawProduct: Raw product already added");
    _centralGovRawProducts[msg.sender].push(_rawProduct);
    _rawProductCentralGovs[_rawProduct].push(msg.sender);
    return true;
  }

  function getCentralGov(address _id) public view onlyStakeholder(_id) returns(
    stakeholder memory centralGov,
    string[] memory rawProducts
  ){
    centralGov = super.get(_id);
    rawProducts = _centralGovRawProducts[_id];
  }

  function getRawProductCentralGovs(string memory _rawProduct) public view returns (address[] memory) {
    return _rawProductCentralGovs[_rawProduct];
  }

}