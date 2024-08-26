export const habitContractAddress = "0x022db003aB106baf41AE61F0C32c12c3B116C269";

export const habitContractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "PledgeCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "returnAmount",
                "type": "uint256"
            }
        ],
        "name": "PledgeRedeemed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "SponsorCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "totalDays",
                "type": "uint16"
            }
        ],
        "name": "createNewPledge",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deployerAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "pledgeAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "pledgeList",
        "outputs": [
            {
                "internalType": "address",
                "name": "ownerAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "endDate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "betAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "sponsorAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint16",
                "name": "totalDays",
                "type": "uint16"
            },
            {
                "internalType": "uint16",
                "name": "successDays",
                "type": "uint16"
            },
            {
                "internalType": "bool",
                "name": "isRedeemed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "pledgeId",
                "type": "uint256"
            },
            {
                "internalType": "uint16",
                "name": "successDays",
                "type": "uint16"
            }
        ],
        "name": "redeemPledge",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "sponsorList",
        "outputs": [
            {
                "internalType": "address",
                "name": "sponsorAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "sponsorAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "pledgeId",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "pledgeId",
                "type": "uint256"
            }
        ],
        "name": "sponsorPledge",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];