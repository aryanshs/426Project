// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
 
contract DriveToPayContract {
    
    //this struct will help us specify if the user is a business(eg: McDonals) or customer, or in some cases both.
    struct User {
        bool business; //if the user is a business
        bool customer; // if the user is a customer
    }

    mapping (address=>Business) businessesMap; 

    //Business struct containing the services
    struct Business{
        mapping(string => uint256)  Services; //stores the service offered by businesses and their prices
        string  Name; //name of the business
        uint256 Balance; //amount owed to the business/amount they have raised/earned
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
            //createBuisness();
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
    function payment(address BusinessAddress, string memory NameOfService) external payable OnlyCustomers{
        
        //checks if the amount send is the right amount for the service requested
        require(msg.value == businessesMap[BusinessAddress].Services[NameOfService], "Please send the right amount");

        //adds the payment to the business's balance, which the business can withdraw whenever they want- until then the amount will be stored in the contract
        businessesMap[BusinessAddress].Balance += msg.value;

    }
 
    //finding the price of the service requested
    function findPrice(address BusinessAddress, string memory NameOfService) public view returns (uint256){

        //returns the price of the service
        return businessesMap[BusinessAddress].Services[NameOfService];

    }   
 
    //function only available to business to withdraw their funds
    function withdraw(uint256 amountRequested) public payable OnlyEntity{ 
        
        //check if the amount to be withdrawn is less than or equal to the balance that the business has
        require(amountRequested <= businessesMap[msg.sender].Balance);

        //send the amount to the business's address
        payable(msg.sender).transfer(msg.value);

        //decrements the amount they can withdraw in the future
        businessesMap[msg.sender].Balance -= msg.value;
    }

    //specifying the business
    function createBusiness(string memory NameOfB, string memory NameOFservice, uint256 price) public OnlyEntity{
        //creates business's name
        businessesMap[msg.sender].Name = NameOfB;

        //creates the business's services
        businessesMap[msg.sender].Services[NameOFservice] = price;

        //sets their balance to 0 starting out
        businessesMap[msg.sender].Balance = 0; 
    }

    //Adding services to the business catalog
    function AddService(string memory NameOfService, uint256 price) public OnlyEntity{
        businessesMap[msg.sender].Services[NameOfService] = price;
    }

    //Modifiers

    //modifier that checks that the user is both a business and customer
    modifier OnlyUsers {
        require(users[msg.sender].business == true || users[msg.sender].customer == true, "Only users can call this function");
        _;
    }

    //modifier that checks that the user is business
    modifier OnlyEntity {
        require(users[msg.sender].business == true, "You are not authorized to call this function");
        _;
    }

    //modifier that checks that the user is a customer
    modifier OnlyCustomers {
        require(users[msg.sender].business == false && users[msg.sender].customer == true, "You are not authorized to call this function");
    _;
    }
}
