import iERC20 from 'build/polygon-contracts/iERC20.json'
import iUniswapV2Router2 from 'build/polygon-contracts/IUniswapV2Router02.json'

(async () => {
  try {
    const accounts = await web3.eth.getAccounts()
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', 'build/polygon-contracts/cattus.json'))

    const getContract = async (contract_deployment_address, abi) => {
        return new web3.eth.Contract(abi,
            contract_deployment_address);
    };


    const usdc_address = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    const dai_address = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
    const axlusdc_address = "0x750e4C4984a9e0f12978eA6742Bc1c5D248f40ed"
    const bob_address = "0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B"


    const usdc = await getContract(usdc_address, iERC20.abi)
    const dai = await getContract(dai_address, iERC20.abi)
    const axlusdc = await getContract(axlusdc_address, iERC20.abi)
    const bob = await getContract(bob_address, iERC20.abi)
    let contract = new web3.eth.Contract(metadata.abi)

    contract = contract.deploy({
      data: metadata.bytecode
      //arguments: ["0xE592427A0AEce92De3Edee1F18E0157C05861564"]
    })

    newContractInstance = await contract.send({
      from: accounts[0],
      gas: 15000000,
      gasPrice: '60000000000'
    })

    usdc_balance = await usdc.methods.balanceOf(accounts[0]).call()
    console.log("USDC: " + usdc_balance)

    await usdc.methods.approve(newContractInstance.options.address, usdc_balance).send({
      from: accounts[0],
      gas: 1500000,
      gasPrice: '60000000000'
    })

    await newContractInstance.methods.initialize(usdc_balance).send({
      from: accounts[0],
      gas: 20000000,
      gasPrice: '60000000000'
    })

    usdc_contract_balance = await usdc.methods.balanceOf(newContractInstance.options.address).call()
    console.log("USDC CONTRACT: " + usdc_contract_balance)
    dai_contract_balance = await dai.methods.balanceOf(newContractInstance.options.address).call()
    console.log("DAI CONTRACT: " + dai_contract_balance)
    axlusdc_contract_balance = await axlusdc.methods.balanceOf(newContractInstance.options.address).call()
    console.log("axlUSDC CONTRACT: " + axlusdc_contract_balance)
    bob_contract_balance = await bob.methods.balanceOf(newContractInstance.options.address).call()
    console.log("BOB CONTRACT: " + bob_contract_balance)






    
  } catch (e) {
    console.log(e.message)
  }
})()