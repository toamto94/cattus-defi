import iERC20 from 'build/polygon-contracts/iERC20.json'
import iUniswapV2Router2 from 'build/polygon-contracts/IUniswapV2Router02.json'

(async () => {
  try {
    const accounts = await web3.eth.getAccounts()

    const getContract = async (contract_deployment_address, abi) => {
        return new web3.eth.Contract(abi,
            contract_deployment_address);
    };


    const wmatic_address = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
    const uniswap_router_address = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
    const dai_address = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
    const usdc_address = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    const usdt_address = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
    const weth_address = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
    const curve_3pool_lp_address = "0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171"

    const dai = await getContract(dai_address, iERC20.abi)
    const wmatic = await getContract(wmatic_address, iERC20.abi)
    const usdc = await getContract(usdc_address, iERC20.abi)
    const usdt = await getContract(usdt_address, iERC20.abi)
    const weth = await getContract(weth_address, iERC20.abi)
    const uniswap_router = await getContract(uniswap_router_address, iUniswapV2Router2.abi)
    const init_wmatic_amount = "30000000000000000000"


    // Get WMATIC to account0
    await web3.eth.sendTransaction({to: wmatic_address, from: accounts[0], value: init_wmatic_amount})
    await web3.eth.sendTransaction({to: wmatic_address, from: accounts[1], value: init_wmatic_amount})

    // Approve contract to spend WMATIC
    await wmatic.methods.approve(uniswap_router_address, init_wmatic_amount).send({
      from: accounts[0],
      gas: 1500000,
      gasPrice: '30000000000'
    })
    await wmatic.methods.approve(uniswap_router_address, init_wmatic_amount).send({
      from: accounts[1],
      gas: 1500000,
      gasPrice: '30000000000'
    })
  
    // swap WMATIC to USDC and send back to account0
    await uniswap_router.methods.swapExactTokensForTokens("6000000000000000000", "1", [wmatic_address, usdc_address], accounts[0], "100000000000000000000000").send({
      from: accounts[0],
      gas: 15000000,
      gasPrice: '30000000000'
    })
    await uniswap_router.methods.swapExactTokensForTokens("6000000000000000000", "1", [wmatic_address, usdc_address], accounts[1], "100000000000000000000000").send({
      from: accounts[1],
      gas: 15000000,
      gasPrice: '30000000000'
    })

    // swap WMATIC to USDT and send back to account0
    await uniswap_router.methods.swapExactTokensForTokens("6000000000000000000", "1", [wmatic_address, usdt_address], accounts[0], "100000000000000000000000").send({
      from: accounts[0],
      gas: 15000000,
      gasPrice: '30000000000'
    })
    await uniswap_router.methods.swapExactTokensForTokens("6000000000000000000", "1", [wmatic_address, usdt_address], accounts[1], "100000000000000000000000").send({
      from: accounts[1],
      gas: 15000000,
      gasPrice: '30000000000'
    })

    // swap WMATIC to DAI and send back to account0
    await uniswap_router.methods.swapExactTokensForTokens("6000000000000000000", "1", [wmatic_address, dai_address], accounts[0], "100000000000000000000000").send({
      from: accounts[0],
      gas: 15000000,
      gasPrice: '30000000000'
    })
    
    await uniswap_router.methods.swapExactTokensForTokens("6000000000000000000", "1", [wmatic_address, dai_address], accounts[1], "100000000000000000000000").send({
      from: accounts[1],
      gas: 15000000,
      gasPrice: '30000000000'
    })

    // swap WMATIC to DAI and send back to account0
    await uniswap_router.methods.swapExactTokensForTokens("6000000000000000000", "1", [wmatic_address, weth_address], accounts[0], "100000000000000000000000").send({
      from: accounts[0],
      gas: 15000000,
      gasPrice: '30000000000'
    })
    
    await uniswap_router.methods.swapExactTokensForTokens("6000000000000000000", "1", [wmatic_address, weth_address], accounts[1], "100000000000000000000000").send({
      from: accounts[1],
      gas: 20000000,
      gasPrice: '30000000000'
    })


    usdt_balance = await usdt.methods.balanceOf(accounts[0]).call()
    console.log("USDT: " + usdt_balance)
    usdc_balance = await usdc.methods.balanceOf(accounts[0]).call()
    console.log("USDC: " + usdc_balance)
    dai_balance = await dai.methods.balanceOf(accounts[0]).call()
    console.log("DAI: " + dai_balance)
    weth_balance = await weth.methods.balanceOf(accounts[0]).call()
    console.log("WETH: " + weth_balance)
    wmatic_balance = await wmatic.methods.balanceOf(accounts[0]).call()
    console.log("WMATIC: " + wmatic_balance)





    
  } catch (e) {
    console.log(e.message)
  }
})()


//["0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270","0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619","-73860","70980","6000000000000000000","3802284630079067","1","1","0xCE7B0478782E620Ae1024C92BEEB0eAF31f62A0b","10000000000"]
//["0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174","0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619","201780","204660","35375792","7193338812338644","32375792","7103338812338644","0xCE7B0478782E620Ae1024C92BEEB0eAF31f62A0b","10000000000"]