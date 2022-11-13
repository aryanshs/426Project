var DriveToPay = artifacts.require("DriveToPayContract");

module.exports = function (deployer) {
  deployer.deploy(DriveToPay).then(() => console.log(DriveToPay.address));
};
