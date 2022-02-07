//const { assert } = require('console');

const { tokenToString } = require('typescript');
const { default: Web3 } = require('web3');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
    // Code for testing goes in here
    let tether, rwd, decentralBank
    /*
    function tokens(number) {
        return Web3.utils.toWei(number,'ether')
    }
*/
    before(async () => {
        // Load contracts
        tether = await Tether.new() 
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        // Transfer all tokens to DecentalBrank (1 million)
        await rwd.transfer(decentralBank.address, Web3.utils.toWei('1000000','ether'))

        // Transfer 100 mock tethers to Investor
        await tether.transfer(customer, Web3.utils.toWei('100','ether'), {from: owner})
    })

    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {            
            const name = await tether.name()
            assert.equal(name,'Mock Tether Token' )
        })
    })

    describe('Reward Token', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name,'Reward Token' )
        })
    })
   
})