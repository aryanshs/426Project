//import Web3 as web3 from "./index.js";
// const Web3 = require("web3");
// const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
//var BiztoAdd = {};
App = {
  web3: null,
  contracts: {},
  address: "0x485fce25a721cEE1477553b5d2B798AB62855A39",
  handler: null,
  network_id: 5777,
  url: "http://127.0.0.1:7545",
  value: 1000000000000000000,
  index: 0,
  margin: 10,
  left: 15,
  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    //Is there is an injected web3 instance?
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }

    //console.log(App.web3Provider);
    // web3 = new Web3(App.web3Provider);
    // App.web3 = web3;
    ethereum.enable();

    //App.populateAddress();
    return App.initContract();
  },

  initContract: function () {
    web3 = new Web3(new Web3.providers.HttpProvider(App.url));
    App.web3 = web3;
    App.contracts.DriveToPayContract = new App.web3.eth.Contract(
      App.abi,
      App.address,
      {}
    );
    return App.bindEvents();
  },
  bindEvents: function () {
    //go to user page
    $(document).on("click", "#userRegister", function () {
      App.populateAddress().then((r) => (App.handler = r[0]));
      //App.populateAddress().then((r) => console.log(r));
      App.handleUserRegister();
    });

    //go to business page
    $(document).on("click", "#BizRegister", function () {
      App.populateAddress().then((r) => (App.handler = r[0]));
      App.handleBizRegister();
    });

    //handle the new data of the new business created
    $(document).on("click", "#BusinessCreated", function () {
      App.populateAddress().then((r) => (App.handler = r[0]));
      App.handleBusinessCreated(
        jQuery("#NameOfB").val(),
        jQuery("#Service").val(),
        jQuery("#Price").val()
      );
    });

    //when get button presses, get balance of the business
    $(document).on("click", "#Balance", function () {
      App.populateAddress().then((r) => (App.handler = r[0]));
      App.handleGet();
    });

    //add a new service
    $(document).on("click", "#serviceCreated", function () {
      App.populateAddress().then((r) => (App.handler = r[0]));
      App.handleserviceCreated(
        jQuery("#NewService").val(),
        jQuery("#NewPrice").val()
      );
    });

    //withdraw button is pressed
    $(document).on("click", "#withdraw", function () {
      App.populateAddress().then((r) => (App.handler = r[0]));
      App.handleWithdraw();
    });

    //usercreated store the car and address
    $(document).on("click", "#userCreated", function () {
      App.populateAddress().then((r) => (App.handler = r[0]));
      App.handleuserCreated(jQuery("#car").val());
    });

    //find price of the service
    $(document).on("click", "#findPrice", function () {
      App.populateAddress().then((r) => (App.handler = r[0]));
      App.handlefindPrice(
        jQuery("#nameofBi").text(),
        jQuery("#nameservicePrice").text()
      );
    });

    //send the payment amount
    $(document).on("click", "#sendButton", function () {
      App.populateAddress().then((r) => (App.handler = r[0]));
      App.handlesendButton(
        jQuery("#nameofBi").text(),
        jQuery("#nameservicePrice").text(),
        jQuery("#amountPay").val()
      );
    });
  },

  populateAddress: async function () {
    App.handler = App.web3.givenProvider.selectedAddress;
    return await ethereum.request({ method: "eth_requestAccounts" });
  },

  //someone signed up as a user-
  handleUserRegister: function () {
    console.log("here");
    var option = { from: App.handler };
    App.contracts.DriveToPayContract.methods
      .RegisterUser(false, true)
      .send(option)
      .on("receipt", (receipt) => {
        console.log(receipt);
        toastr.success("You are now a user!");
        //navigate to business page
        setTimeout(() => {
          window.location.href = "/UserPage";
        }, 1500);
      });
  },

  //someone signed up as a business-
  handleBizRegister: function () {
    var option = { from: App.handler };
    App.contracts.DriveToPayContract.methods
      .RegisterUser(true, false)
      .send(option)
      .on("receipt", (receipt) => {
        console.log(receipt);
        toastr.success("You are now a business entity!");
        //navigate to business page
        setTimeout(() => {
          window.location.href = "/BusinessCreate";
        }, 1500);
      });
  },

  //business provided the name, service, and price-
  handleBusinessCreated: function (NameOfB, NameOfservice, Price) {
    var option = { from: App.handler };
    App.contracts.DriveToPayContract.methods
      .createBusiness(NameOfB, NameOfservice, Price)
      .send(option)
      .on("receipt", (receipt) => {
        console.log(receipt);
        if (receipt.status) {
          toastr.success(
            `Awesome! You are now a registered Business ${NameOfB}`
          );
          setTimeout(() => {
            window.location.href = "/OnlyBusinessPage";
          }, 1500);
        }
      });
  },
  handleGet: function () {
    App.contracts.DriveToPayContract.methods
      .getBalance()
      .call()
      .then((r) => {
        // setTimeout(() => {
        //   window.location.href = "/OnlyBusinessPage";
        // }, 2000);
        //console.log("this is it " + r);
        document.getElementById("balance").innerHTML = ` : ${r}`;
        // jQuery("#balance").text("hello");
      });
  },
  handleserviceCreated: function (service, price) {
    var option = { from: App.handler };
    App.contracts.DriveToPayContract.methods
      .AddService(service, price)
      .send(option)
      .on("receipt", (receipt) => {
        //console.log(receipt);
        if (receipt.status) {
          console.log(receipt);
          toastr.success(`Great! You have added ${service} to your list`);

          var serviceNode = document.createElement("li");
          serviceNode.appendChild(document.createTextNode(`${service}`));

          document.querySelector("ul").appendChild(serviceNode);
          serviceNode.classList.add("list-group-item");
        }
      });
  },
  handleuserCreated: function (car) {
    var option = { from: App.handler };
    App.contracts.DriveToPayContract.methods
      .createuserandPlate(car)
      .send(option)
      .on("receipt", (receipt) => {
        //console.log(receipt);
        if (receipt.status) {
          toastr.success(`Awesome! You are now a registered user!`);
          setTimeout(() => {
            window.location.href = "/UserLandingPage";
          }, 1500);
        }
      });
  },
  handlefindPrice: function (name, service) {
    var address;
    App.contracts.DriveToPayContract.methods
      .getAddress(name)
      .call()
      .then((r) => {
        address = r;
        App.contracts.DriveToPayContract.methods
          .findPrice(r, service)
          .call()
          .then((r) => {
            document.getElementById("priceofS").innerHTML = `: ${r}`;
          });
      });
  },
  handlesendButton: function (name, service, amount) {
    console.log(amount);
    var address;
    App.contracts.DriveToPayContract.methods
      .getAddress(name)
      .call()
      .then((r) => {
        address = r;
        var option = { from: App.handler };
        App.contracts.DriveToPayContract.methods
          .payment(r, service, amount)
          .send(option)
          .on("receipt", (receipt) => {
            //console.log(receipt);
            console.log("worked");
            window.location.href = "/sentconfirmation";
          });
      });
  },
  // handleuserCreated: function () {
  //   console.log("here");
  //   window.location.href = "/UserLandingPage";
  //   // window.location.href = "/OnlyBusinessPage";
  // },
  abi: [
    {
      inputs: [
        {
          internalType: "string",
          name: "NameOfService",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "AddService",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "NameOfB",
          type: "string",
        },
        {
          internalType: "string",
          name: "NameOFservice",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "createBusiness",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "licensePlate",
          type: "string",
        },
      ],
      name: "createuserandPlate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "BusinessAddress",
          type: "address",
        },
        {
          internalType: "string",
          name: "NameOfService",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "payment",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "business",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "customer",
          type: "bool",
        },
      ],
      name: "RegisterUser",
      outputs: [
        {
          internalType: "string",
          name: "Confirmation",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "UnRegister",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amountRequested",
          type: "uint256",
        },
      ],
      name: "withdraw",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "BusinessAddress",
          type: "address",
        },
        {
          internalType: "string",
          name: "NameOfService",
          type: "string",
        },
      ],
      name: "findPrice",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "NameofB",
          type: "string",
        },
      ],
      name: "getAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "getifuserornot",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "licensePlate",
          type: "string",
        },
      ],
      name: "getuserAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "users",
      outputs: [
        {
          internalType: "bool",
          name: "business",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "customer",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
};

$(function () {
  $(window).load(function () {
    App.init();
    toastr.options = {
      // toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: "toast-bottom-full-width",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "5000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
  });
});

function userlandinPage() {
  window.location.href = "/UserLandingPage";
}
