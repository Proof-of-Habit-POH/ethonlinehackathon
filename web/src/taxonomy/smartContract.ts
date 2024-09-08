export const habitContractAddress =
"0xCbdE51Ba4307742DF70afF96186801cA61f73b20"

export const habitContractABI = [
  { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
  {
    "type": "function",
    "name": "createNewPledge",
    "inputs": [
      { "name": "totalDays", "type": "uint16", "internalType": "uint16" },
      { "name": "pledgeId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "deployerAddress",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pledgeList",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [
      {
        "name": "ownerAddress",
        "type": "address",
        "internalType": "address"
      },
      { "name": "endDate", "type": "uint256", "internalType": "uint256" },
      { "name": "betAmount", "type": "uint256", "internalType": "uint256" },
      {
        "name": "sponsorAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      { "name": "totalDays", "type": "uint16", "internalType": "uint16" },
      { "name": "successDays", "type": "uint16", "internalType": "uint16" },
      { "name": "isRedeemed", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "redeemPledge",
    "inputs": [
      { "name": "pledgeId", "type": "uint256", "internalType": "uint256" },
      { "name": "successDays", "type": "uint16", "internalType": "uint16" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "sponsorList",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [
      {
        "name": "sponsorAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "sponsorAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      { "name": "pledgeId", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "sponsorPledge",
    "inputs": [
      { "name": "pledgeId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "event",
    "name": "PledgeCreated",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PledgeRedeemed",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "returnAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SponsorCreated",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
]