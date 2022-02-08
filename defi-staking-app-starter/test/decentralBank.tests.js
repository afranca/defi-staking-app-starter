//const assert = require('assert');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
    // Code for testing goes in here
    let tether, rwd, decentralBank
    
    function tokens(number) {
        return web3.utils.toWei(number,'ether')
    }

    before(async () => {
        // Load contracts
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
            assert.equal(name,'Mock Tether Token' )
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
            assert.equal(name,'Decentral Bank' )
        })

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance,tokens('1000000'))
        })
    }) 
   
    describe('Yield Farming', async () => {
        it('rewards tokens from staking', async () => {
            let result = await tether.balanceOf(customer)
            assert.equal(result.toString(),tokens('100'),'Customer mock wallet initial value' )
            
            // Check the tsaking for customer
            await tether.approve(decentralBank.address, tokens('100'), {from: customer})
            await decentralBank.depositTokens(tokens('100'), {from: customer})

            // Check updated balance of customer
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(),tokens('0'),'Customer balance after staking' )

            // Check updated balance of Decental Bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(),tokens('100'),'Decentral Bank balance after staking' )
            
            // Check customer isTaking
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(),'true', 'Customer staking status after staking')
            
            // Issue tokens
            await decentralBank.issueTokens({from: owner})

            // Ensure only owner can Issue tokens
            await decentralBank.issueTokens({from: customer}).should.be.rejected; 
            
            // Unstake tokens
            await decentralBank.unstakeTokens({from: customer})


            // Check updated balance of customer
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(),tokens('100'),'Customer balance after unstaking 100' )

            // Check updated balance of Decental Bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(),tokens('0'),'Decentral Bank balance after unstaking' )
            
            // Check customer isTaking
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(),'false', 'Customer is no longer staking')            
            

        })
    })    
})