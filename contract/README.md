# Proof of Habit Contract
The smart contracts are written in Solidity and tested using Foundry. 
The contracts are deployed on Morph Holesky Testnet.

### Run Test

```bash
forge test
```

### Deploy

1. create .env file with your MORPH_HOLESKY_RPC_URL and PRIVATE_KEY

```
MORPH_HOLESKY_RPC_URL=<your_rpc_url>
PRIVATE_KEY=<your_private_key>
```

2. deploy the contract

```bash
source .env
forge create --rpc-url $MORPH_HOLESKY_RPC_URL --private-key $PRIVATE_KEY --legacy src/Habit.sol:HabitContract
```


### Deployed Contract Address
Morphl Holeskey Testnet
[0xCbdE51Ba4307742DF70afF96186801cA61f73b20](https://explorer-holesky.morphl2.io/address/0xCbdE51Ba4307742DF70afF96186801cA61f73b20)
