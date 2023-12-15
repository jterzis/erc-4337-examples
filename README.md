![](https://i.imgur.com/Ym2VV8z.png)

# Getting started

A collection of example scripts for working with ERC-4337. **For details on how to use this repository, [check out the docs here](https://docs.stackup.sh/docs/erc-4337-examples).**

The implementation for all commands are located in the [scripts directory](./scripts/). All scripts are built with the following open source packages:

- Sample contracts: [eth-infinitism/account-abstraction](https://github.com/eth-infinitism/account-abstraction)
- ZeroDev Kernel contracts: [zerodevapp/kernel](https://github.com/zerodevapp/kernel)
- JS SDK: [userop.js](https://github.com/stackup-wallet/userop.js)

> **🚀 Looking for access to hosted infrastructure to build your Smart Accounts? Check out [stackup.sh](https://www.stackup.sh/)!**

# Local development
```
# init config.json
yarn run init
# set api key, signer, context in config.json
# run simpleAccount transfer to a wallet adddress
yarn run simpleAccount erc20Transfer --to $USEROP_ADDR --amount 0 --withPaymaster 
```


# License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

# Contact


Feel free to direct any technical related questions to the `dev-hub` channel in the [Stackup Discord](https://discord.gg/VTjJGvMNyW).
