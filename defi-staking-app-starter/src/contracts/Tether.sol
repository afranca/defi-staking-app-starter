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
    mapping(address => mapping(address => uint256)) public allowance;

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

    function transferFrom(address _from,address _to, uint256 _value) public returns (bool success) {
        // require that the value is greater or equal for transfer
        require(_value <= balanceOf[_from], "Value is greater than Balance");
        require(_value <= allowance[_from][msg.sender], "Value is greater than Allowance");
        // add the balance to target account
        balanceOf[_to] += _value;
        // transfer the amount and subtract the balance from origin account
        balanceOf[_from] -= _value;
        // I dont fully understand this
        allowance[msg.sender][_from] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}