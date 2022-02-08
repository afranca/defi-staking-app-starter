pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;
    mapping (address => uint) public stakingBalance;
    mapping (address => bool) public hasStaked;
    mapping (address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    // Staking function
    function depositTokens(uint _amount) public {
        // Staking musht be greater than zero
        require(_amount > 0, 'Amount should be greater than ZERO');

        // Transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if (!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // Update staking balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Unstaking function
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        // UnStaking musht be greater than zero
        require(balance > 0, 'Usstaking balance cannot be less than zero');

        // transfer the tokens to specific contract address, from our bank
        tether.transfer(msg.sender, balance);

       // Update staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking balance
        isStaking[msg.sender] = false;
   }

    function issueTokens() public {
        require(msg.sender == owner, 'Must be owner to issue tokens');

        for(uint i=0; i<stakers.length; i++){
            address recepient = stakers[i];
            uint balance = stakingBalance[recepient]/9; // divide per 9
            if (balance > 0){
                rwd.transfer(recepient, balance);
            }
        }
    }

}