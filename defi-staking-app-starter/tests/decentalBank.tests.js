const _deploy_contract = require('../migrations/2_deploy_contract');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('decentralBank', accounts =>{
    //Test code goes in here
})    