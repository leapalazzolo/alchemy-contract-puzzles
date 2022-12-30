const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const signer = ethers.provider.getSigner(0);

    return { game, signer };
  }
  it('should be a winner', async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);

    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";
    
    let wallet = await ethers.Wallet.createRandom();
    while (wallet.address.slice(0, 20) >= threshold.slice(0, 20)){
      wallet = ethers.Wallet.createRandom();
    }

    wallet = wallet.connect(ethers.provider)
    

    await signer.sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther('1')
    })

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
