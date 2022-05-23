const { assert } = require('chai');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
    .use(require('chai-as-promised'))
    .should()

// contract('DecentralBank', (accounts) => {
contract('DecentralBank', ([owner, customer]) => {
   let tether, rwd, decentralBank

   function tokens(number) {
    return web3.utils.toWei(number,'ether')
}   

    before(async ()=>{
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        // Transfer all tokens to DecentalBrank (1 million)
        await rwd.transfer(decentralBank.address, tokens('1000000'))   
        
        // Transfer 100 mock tethers to Investor
        await tether.transfer(customer, tokens('100'), {from: owner})        
    })


    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name()
            assert.equal('Mock Tether Token', name)
        })
        it('matches symbol successfully', async () => {
            const symbol = await tether.symbol()
            assert.equal('mUSDT', symbol)
        })        
    })

    describe('Reward Token', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name,'Reward Token' )
        })
    }) 

    describe('DecentralBank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name()
            assert.equal('Decentral Bank', name)
        })
        it('matches inital Rewards successfully', async () => {
            const balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(tokens('1000000'), balance)
        })    
         
    })    
})    