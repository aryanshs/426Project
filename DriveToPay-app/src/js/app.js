//import Web3 as web3 from "./index.js";
// const Web3 = require("web3");
// const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

App = {
  web3: null,
  contracts: {},
  address: "0xDdCEa7F77da3B417294773cbc74a4345C0c54fEF",
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
  },

  populateAddress: async function () {
    App.handler = App.web3.givenProvider.selectedAddress;
    return await ethereum.request({ method: "eth_requestAccounts" });
  },

  //someone signed up as a user-
  handleUserRegister: function () {
    var option = { from: App.handler };
    App.contracts.DriveToPayContract.methods
      .RegisterUser(false, true)
      .send(option)
      .on("receipt", (receipt) => {
        console.log(receipt);
        if (receipt.status) {
          toastr.success("You are now a User");

          //navigate to user page
          setTimeout(() => {
            window.location.href = "/UserPage";
          }, 1500);
        }
      })
      .on("error", (err) => {
        toastr.error("Please try that again");
      });
  },

  //someone signed up as a business-
  handleBizRegister: function () {
    var option = { from: App.handler };
    App.contracts.DriveToPayContract.methods
      .RegisterUser(true, false)
      .send(option)
      .on("receipt", (receipt) => {
        if (receipt.status) {
          toastr.success("You are now a Business entity");
          //navigate to business page
          setTimeout(() => {
            window.location.href = "/BusinessCreate";
          }, 1500);
        }
      })
      .on("error", (err) => {
        toastr.error("Please try that again");
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
      })
      .on("error", (err) => {
        alert(NameOfservice);
        toastr.error(
          "Sorry, you need to affirm that you are a business, please visit our home page"
        );
      });
  },
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
      name: "payment",
      outputs: [],
      stateMutability: "payable",
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
