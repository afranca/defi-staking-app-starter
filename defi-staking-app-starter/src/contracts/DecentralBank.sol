pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    address public owner;
    string public name = 'Decentral Bank';
    RWD public rwd;
    Tether public tether;

    address[] public stakers;

    //Map(K,V) Key=Address, Value=No of Tokens in staking
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    constructor(RWD _rwd, Tether _tether) public {
        //owner = msg.sender;
        rwd = _rwd;
        tether = _tether;
    }

    //Staking function
    function depositTokens(uint _amount) public {
        // Staking musht be greater than zero
        require(_amount > 0, 'Amount should be greater than ZERO');

        // Xfer tokens to this cmtract address for staking
        tether.transferFrom(msg.sender,address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if (!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // Update staking balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

}