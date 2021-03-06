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
        it('contract has tokens', async () => {
            const balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(tokens('1000000'), balance)
        })          
    })    

    describe('Yield Farming', async ()=>{
        it('Reward tokens for staking', async ()=>{
            let result
            result = await tether.balanceOf(customer)
            assert.equal(tokens('100'), result.toString(),'Investor initial balance')
        })
        it('Deposit tokens for staking', async ()=>{
            let result
            result = await tether.balanceOf(customer)
            assert.equal(tokens('100'), result.toString(),'Investor initial balance')

            await tether.approve(decentralBank.address, tokens('100'), {from: customer})
            await decentralBank.depositTokens(tokens('100'), {from: customer})

            // Check updated balance of customer
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(),tokens('0'),'Customer balance after staking' )

            // Check updated balance of Decental Bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(),tokens('100'),'Decentral Bank balance after staking' )   
            
            // Check if Customer is Staking  
            let isStaking = await decentralBank.isStaking(customer)
            assert.isTrue(isStaking,'Customer is Staking') 
            
            //Issue Rewards to stake holders
            await decentralBank.issueTokens({from: owner})
            //result = await rwd.balanceOf(customer)
            //assert.equal(result.toString(),tokens('11'),'Reward balance from staking' )            

            // Ensure only owner can Issue tokens
            await decentralBank.issueTokens({from: customer}).should.be.rejected; 

            //Unstake tokens test
            await decentralBank.unstakeTokens({from: customer})
            //Checking Balance of Decentral Bank
            result = await decentralBank.stakingBalance(customer)
            assert.equal(result.toString(),tokens('0'),'ZERO tokens in staking' )             
            // Staking Update
            result = await decentralBank.isStaking(customer)
            assert.isFalse(result,'Not currently staking' )               
            // Check updated balance of customer
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(),tokens('100'),'Customer balance after unstaking 100' )
        })        
    })
})    