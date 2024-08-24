// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {HabitContract} from "../src/Habit.sol";

contract HabitScript is Script {
    HabitContract public habit;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        habit = new HabitContract();

        vm.stopBroadcast();
    }
}