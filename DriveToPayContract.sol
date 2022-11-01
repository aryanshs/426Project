// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
 
contract DriveToPayContract {
 
    struct Users {
 
    }
    struct
    address[] Business;
    address[] Users;
    mapping(address =>)
 
    //registering users
    function RegisterUser() public {
        Users.push(msg.sender);
 
    }
 
    //regisering business
    function RegisterBusiness() public{
        Business.push(msg.sender);
    }
 
    //unregistering users
    function UnRegister() public OnlyUsers {
       
        //remove from business array
        for (uint256 i = 0; i < Business.length;i++){
            if (Business[i] == msg.sender){
                delete Business[i];
            }
        }
 
        for (uint256 i = 0; i < Users.length;i++){
            if (Users[i] == msg.sender){
                delete Users[i];
            }
        }
 
    }
 
    //user paying money for services
    function payment() public payable {
 
    }
 
    //finding the price of the service requested
    function findPrice() private {
 
    }
 
   
    function withdraw() public OnlyEntity{
 
    }
 
    //MODIFIERS
   
    modifier OnlyEntity {
        bool exists = false;
 
        for (uint256 i = 0; i < Business.length;i++){
            if (Business[i] == msg.sender){
                exists = true;
            }
        }
        require(exists == true);
        _;
    }
 
    modifier OnlyUsers {
        bool exists = false;
 
        //checking if they are a user
        for (uint256 i = 0; i < Users.length;i++){
            if (Users[i] == msg.sender){
                exists = true;
            }
        }
 
        //checking if they are a business
        for (uint256 i = 0; i < Business.length;i++){
            if (Business[i] == msg.sender){
                exists = true;
            }
        }
        require(exists == true);
        _;
 
    }
}
