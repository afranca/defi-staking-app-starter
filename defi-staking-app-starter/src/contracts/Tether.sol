pragma solidity ^0.5.0;

contract Tether {
    string public name = 'Mock Tether Token';
    string public symbol = 'mUSDT';
    uint256 public totalSupply = 1000000000000000000000000; //supposed to be 1 million
    uint8 public decimals = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    // Holds balances of all accounts
    mapping(address => uint256) public balanceOf;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        // require that the value is greater or equal for transfer
        require(balanceOf[msg.sender] >= _value,"required balance out of bounds");
        // transfer the amount and subtract the balance from origin account
        balanceOf[msg.sender] -= _value;
        // add the balance to target account
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}