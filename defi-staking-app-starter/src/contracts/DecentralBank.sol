pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    address public owner;
    string public name = 'Decentral Bank';
    RWD public rwd;
    Tether public tether;
    //Map(K,V) Key=Address, Value=No of Tokens in staking
    mapping(address => uint) public stakingBalance;
    
    constructor(RWD _rwd, Tether _tether) public {
        //owner = msg.sender;
        rwd = _rwd;
        tether = _tether;
    }

    //Staking function
    function depositTokens(uint _amount) public {
        // Xfer tokens to this cmtract address for staking
        tether.transferFrom(msg.sender,address(this), _amount);

        stakingBalance[msg.sender] += _amount;
    }

}