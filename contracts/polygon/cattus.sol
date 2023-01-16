// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import "./quickswapV3.sol";




contract cattus is ERC20  {

  address constant USDC = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
  address constant DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
  address constant axlUSDC = 0x750e4C4984a9e0f12978eA6742Bc1c5D248f40ed;
  address constant BOB = 0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B;
  address constant QUICKSWAP_ROUTER = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
  //address constant WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
  //address constant WBTC = 0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6;
  //address constant WETH = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;
  address constant NF_POSITION_MANAGER = 0x8eF88E4c7CfbbaC1C163f7eddd4B578792201de6;
  address constant QUICKSWAP_V3_SWAPPER = 0xf5b509bB0909a69B1c207E495f687a596C168E12;
  //address constant Pool_USDC_WETH = 0x55CAaBB0d2b704FD0eF8192A7E35D8837e678207;

  address public admin_address;

  uint24 public constant poolFee = 3000;

  bool public initialized;

  
    constructor() ERC20("Gold", "GLD") {
      admin_address = msg.sender;
      initialized = false;
    }

    function initialize(uint256 _initialAmount) external {
      require(msg.sender == admin_address, "Must be called by contract admin");
      require(initialized == false, "Contract has already been initialized");
      initialized = true;
      TransferHelper.safeTransferFrom(USDC, msg.sender, address(this), _initialAmount);
      TransferHelper.safeApprove(USDC, QUICKSWAP_V3_SWAPPER, _initialAmount);
      uint256 fraction = _initialAmount/3;

      iQuickswapSwapper.ExactInputSingleParams memory params;
      params = iQuickswapSwapper.ExactInputSingleParams({
                tokenIn: USDC,
                tokenOut: DAI,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: fraction/2,
                amountOutMinimum: 1,
                limitSqrtPrice: 0
          });
      uint256 amount_dai = iQuickswapSwapper(QUICKSWAP_V3_SWAPPER).exactInputSingle(params);
      params.tokenOut = axlUSDC;
      uint256 amount_axlUsdc = iQuickswapSwapper(QUICKSWAP_V3_SWAPPER).exactInputSingle(params);
      params.tokenOut = BOB;
      uint256 amount_bob = iQuickswapSwapper(QUICKSWAP_V3_SWAPPER).exactInputSingle(params);

      TransferHelper.safeApprove(USDC, NF_POSITION_MANAGER, fraction);
      TransferHelper.safeApprove(DAI, NF_POSITION_MANAGER, amount_dai);

      iNFTPositionManager.MintParams memory mint_params;
      mint_params = iNFTPositionManager.MintParams({
              token0: DAI,
              token1: USDC,
              tickLower: 266322,
              tickUpper: 286322,
              amount0Desired: amount_dai,
              amount1Desired: fraction/2,
              amount0Min: 1,
              amount1Min: 1,
              recipient: 	address(this),
              deadline: block.timestamp
          });
      iNFTPositionManager(NF_POSITION_MANAGER).mint(mint_params);


    }



/*     function mint(uint256 _amount, uint deadline) external returns(uint256, uint256, uint256, uint256) {
        ERC20(USDC).transferFrom(msg.sender, address(this), _amount);
        address[] memory path = new address[](2);
        path[0] = USDC;
        path[1] = WETH;
        ERC20(USDC).approve(QUICKSWAP_ROUTER, _amount);
        ISwapRouter(QUICKSWAP_ROUTER).swapExactTokensForTokens(_amount/3, 1, path, address(this), deadline);
        path[1] = DAI;
        ISwapRouter(QUICKSWAP_ROUTER).swapExactTokensForTokens(_amount/6, 1, path, address(this), deadline);
        path[1] = WBTC;
        ISwapRouter (QUICKSWAP_ROUTER).swapExactTokensForTokens(_amount/6, 1, path, address(this), deadline);
        uint256 _amount_usdc = ERC20(USDC).balanceOf(address(this));
        uint256 _amount_weth = ERC20(WETH).balanceOf(address(this));
        uint256 _amount_dai = ERC20(DAI).balanceOf(address(this));
        uint256 _amount_wbtc = ERC20(WBTC).balanceOf(address(this));

        uint256 tokenId;
        uint128 liquidity;
        uint256 amount0;
        uint256 amount1;

        // Approve the position manager
        ERC20(USDC).approve(NFTPositionManager, _amount_usdc);
        ERC20(DAI).approve(NFTPositionManager, _amount_dai); */

/*         MintParams memory params = MintParams({
                token0: DAI,
                token1: USDC,
                tickLower: TickMath.MIN_TICK,
                tickUpper: TickMath.MAX_TICK,
                amount0Desired: 256323,
                amount1Desired: 296323,
                amount0Min: 1,
                amount1Min: 1,
                recipient: 	address(this),
                deadline: block.timestamp
            }); */


        //iNFTPositionManager(NFTPositionManager).mint(params);

    //}
}
