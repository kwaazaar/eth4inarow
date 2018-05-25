pragma solidity ^0.4.16;

contract FourInARow {
	mapping (address => uint) balances;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	function FourInARow() public {
		balances[tx.origin] = 10000;
	}

	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		Transfer(msg.sender, receiver, amount);
		return true;
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}
}
