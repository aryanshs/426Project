// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
 
contract DriveToPayContract {
    
    //this struct will help us specify if the user is a business(eg: McDonals) or customer, or in some cases both.
    struct User {
        bool business; //if the user is a business
        bool customer; // if the user is a customer
    }

    //this will map the address of the user's account to their info
    mapping(address => User) public users;

    User NewBusiness; //struct for new businesses
    User NewUser;     //struct for new users
    User NewUserandBusiness; // struct for new users and businesses


    //registering users
    function RegisterUser(bool business, bool customer) public returns(string memory Confirmation) {
        
        //registering just as a business
        if (business == true && customer == false){

            NewBusiness = User(true, false);
            users[msg.sender] = NewBusiness;
            return("Congratulations, you are now registered as a Business entity!");

        //registering just as a customer
        }else if(business == false && customer == true){

            NewUser = User(false, true);
            users[msg.sender] = NewUser;
            return("Congratulations, you are now registered as a User!");
        }

        //registering as neither
        else if(business == false && customer == false){
            return("Oops, please try again");
        }
        //registering as both
        else{
            
            NewUserandBusiness = User(true, true);
            users[msg.sender] = NewUserandBusiness;
            return("Congratulations, you are now registered as a User and a Business entity!");
        }
 
    }

    //Unregistering as a user and a business
    function UnRegister() public OnlyUsers {
        users[msg.sender].business = false;
        users[msg.sender].customer = false;
        delete users[msg.sender];
    }

    //user paying money for services
    function payment() public payable {
 
    }
 
    //finding the price of the service requested
    function findPrice() private {
 
    }
 
   
    function withdraw() public OnlyEntity{ 
 
    }

    //Modifiers
    modifier OnlyUsers {
        require(users[msg.sender].business == true || users[msg.sender].customer == true, "Only users can call this function");
        _;
    }

    modifier OnlyEntity {
        require(users[msg.sender].business == true, "You are not authorized to call this function");
        _;
    }
}
