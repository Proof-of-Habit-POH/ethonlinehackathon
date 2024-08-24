// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/Habit.sol";

contract HabitTest is Test {
    HabitContract habit;
    address owner;
    address sponsor;
    address deployer;

    function setUp() public {
        deployer = address(this);
        owner = address(0x1);
        sponsor = address(0x2);
        vm.prank(deployer);
        habit = new HabitContract();
    }

    function testCreateNewPledge() public {
        vm.prank(owner);
        vm.deal(owner, 1 ether);
        uint16 totalDays = 30;
        habit.createNewPledge{value: 1 ether}(totalDays);

        (address pledgeOwner, , uint betAmount, , uint16 pledgeTotalDays, uint16 successDays, bool isRedeemed) = habit.pledgeList(0);
        
        assertEq(pledgeOwner, owner);
        assertEq(betAmount, 1 ether);
        assertEq(pledgeTotalDays, totalDays);
        assertEq(successDays, 0);
        assertEq(isRedeemed, false);
    }

    function testSponsorPledge() public {
        vm.prank(owner);
        vm.deal(owner, 1 ether);
        habit.createNewPledge{value: 1 ether}(30);

        vm.prank(sponsor);
        vm.deal(sponsor, 0.5 ether);
        habit.sponsorPledge{value: 0.5 ether}(0);

        (address sponsorAddress, uint sponsorAmount, uint pledgeId) = habit.sponsorList(0);
        assertEq(sponsorAddress, sponsor);
        assertEq(sponsorAmount, 0.5 ether);
        assertEq(pledgeId, 0);
    }

    function testRedeemPledgeFullSuccess() public {
        vm.prank(owner);
        vm.deal(owner, 1 ether);
        habit.createNewPledge{value: 1 ether}(30);

        vm.prank(sponsor);
        vm.deal(sponsor, 0.5 ether);
        habit.sponsorPledge{value: 0.5 ether}(0);

        vm.warp(block.timestamp + 31 days);

        vm.prank(owner);
        habit.redeemPledge(0, 30);

        (, , , , , , bool isRedeemed) = habit.pledgeList(0);

        assertEq(isRedeemed, true);
        assertEq(address(habit).balance, 0);
        assertEq(owner.balance, 1.5 ether);
    }

    function testRedeemPledgePartialSuccess() public {
        // Set up the deployer address
        deployer = address(0x3);
        vm.prank(deployer);
        habit = new HabitContract();
        
        vm.prank(owner);
        vm.deal(owner, 1 ether);
        habit.createNewPledge{value: 1 ether}(30);

        vm.prank(sponsor);
        vm.deal(sponsor, 0.5 ether);
        habit.sponsorPledge{value: 0.5 ether}(0);

        vm.warp(block.timestamp + 31 days);

        vm.prank(owner);
        habit.redeemPledge(0, 15);

        (, , , , , , bool isRedeemed) = habit.pledgeList(0);
        
        assertEq(isRedeemed, true);
        assertEq(owner.balance, 0.5 ether);
        assertEq(sponsor.balance, 0.5 ether);
        assertEq(deployer.balance, 0.5 ether);
    }

    function testRedeemPledgeWithNoSuccess() public {
          // Set up the deployer address
        deployer = address(0x4);
        vm.prank(deployer);
        habit = new HabitContract();
        
        vm.prank(owner);
        vm.deal(owner, 1 ether);
        habit.createNewPledge{value: 1 ether}(30);

        vm.prank(sponsor);
        vm.deal(sponsor, 0.5 ether);
        habit.sponsorPledge{value: 0.5 ether}(0);

        vm.warp(block.timestamp + 31 days);

        vm.prank(owner);
        habit.redeemPledge(0, 0);

        (, , , , , , bool isRedeemed) = habit.pledgeList(0);
        
        assertEq(isRedeemed, true);
        assertEq(owner.balance, 0 ether);
        assertEq(sponsor.balance, 0.5 ether);
        assertEq(deployer.balance, 1 ether);
    }
}
