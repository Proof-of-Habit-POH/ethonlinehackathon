// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract HabitContract {

    // Pledge variables
    struct Pledge {
        address ownerAddress;
        uint endDate;
        uint betAmount;
        uint sponsorAmount;
        uint16 totalDays;
        uint16 successDays;
        bool isRedeemed;
    }

    Pledge[] public pledgeList;

    // Sponsor variables
    struct Sponsor {
        address sponsorAddress;
        uint sponsorAmount;
        uint pledgeId;
    }

    Sponsor[] public sponsorList;

    // mapping total amount of money with pledgeId
    mapping(uint => uint) public pledgeAmount;


    // setup initial deployer address
    address public deployerAddress;
    constructor() {
        deployerAddress = msg.sender;
    }

    // event for pledge creation
    event PledgeCreated(uint indexed id);
    event SponsorCreated(uint indexed id);
    event PledgeRedeemed(uint indexed id, uint returnAmount);


    // register new contract function
    function createNewPledge(uint16 totalDays) external payable {
        require(totalDays > 0, "Total days must be greater than 0");
        require(msg.value > 0, "Bet amount must be greater than 0");
        
        Pledge memory newPledge = Pledge({
            ownerAddress: msg.sender,
            endDate: block.timestamp + totalDays * 1 days,
            betAmount: msg.value,
            sponsorAmount: 0, // This will be set when the sponsor contributes
            totalDays: totalDays,
            successDays: 0, // This will be updated when the redeem the pledge
            isRedeemed: false
        });
        pledgeList.push(newPledge);
        pledgeAmount[pledgeList.length - 1] = msg.value;
        emit PledgeCreated(pledgeList.length - 1);
    }

    function sponsorPledge(uint pledgeId) external payable {
        require(msg.value > 0, "Sponsor amount must be greater than 0");
        require(pledgeId < pledgeList.length, "Invalid pledge ID");
        require(!pledgeList[pledgeId].isRedeemed, "Pledge has already been redeemed");

        Sponsor memory newSponsor = Sponsor({
            sponsorAddress: msg.sender,
            sponsorAmount: msg.value,
            pledgeId: pledgeId
        });
        sponsorList.push(newSponsor);
        pledgeAmount[pledgeId] += msg.value;

        // add to pledge sponsor amount
        Pledge storage pledge = pledgeList[pledgeId];
        pledge.sponsorAmount += msg.value;

        // emit event
        emit SponsorCreated(sponsorList.length - 1);
    }

    function redeemPledge(uint pledgeId, uint16 successDays) external {
        require(pledgeList[pledgeId].ownerAddress == msg.sender, "You are not the owner of this pledge");
        require(pledgeList[pledgeId].isRedeemed == false, "Pledge has already been redeemed");
        require(pledgeList[pledgeId].endDate < block.timestamp, "Pledge is ongoing");
        require(successDays <= pledgeList[pledgeId].totalDays, "Success days must be less than or equal to total days");

        // mark the pledge as redeemed
        pledgeList[pledgeId].isRedeemed = true;

        // if they success every single day, transfer the total amount to the owner + sponsor amount
        if (successDays == pledgeList[pledgeId].totalDays) {
            (bool success, ) = (msg.sender).call{value: pledgeAmount[pledgeId]}("");
            require(success, "Transfer failed");

            // emit event
            emit PledgeRedeemed(pledgeId, pledgeAmount[pledgeId]);
            

        // if not totally success, return all the money in this pledgeId to the sponsors and return some amount to the owner address and take some amount to the deployer
        } else {
            // return all the sponsored money in this pledgeId to the sponsors
            for (uint i = 0; i < sponsorList.length; i++) {
                if (sponsorList[i].pledgeId == pledgeId) {
                    (bool success, ) = (sponsorList[i].sponsorAddress).call{value: sponsorList[i].sponsorAmount}("");
                    require(success, "Transfer to sponsor failed");
                }
            }
            // return some amount to the owner address
            uint returnAmount = (pledgeList[pledgeId].betAmount * successDays) / pledgeList[pledgeId].totalDays;
            (bool success1, ) = (msg.sender).call{value: returnAmount}("");
            require(success1, "Transfer to owner failed");

            // to donate to charity (in the future)
            uint donateCharityAmount = pledgeList[pledgeId].betAmount - returnAmount;
            (bool success2, ) = (deployerAddress).call{value: donateCharityAmount}("");
            require(success2, "Transfer to deployer failed");

            // emit event
            emit PledgeRedeemed(pledgeId, returnAmount);
        }
        
    }

}
