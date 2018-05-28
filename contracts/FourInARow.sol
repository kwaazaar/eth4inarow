pragma solidity ^0.4.16;

contract FourInARow {
	struct Game {
		address[2] Players;
		uint8[][2] Moves;
	}
	
	mapping (uint8=>Game) games;
	uint8 gameCount;

	function FourInARow() public {
		gameCount = 0;
	}

	function createGame() public returns (uint8 gameid) {
		// todo: take msg.value as stake (including require(msg.value > 0))

		gameCount++;
		gameid = gameCount - 1;

		address[2] memory players;
		players[0] = msg.sender; // p1
		players[1] = address(0); // p2 (joins later)
		games[gameid].Players = players;

		// Todo: check if moves-array really has to be initialized (think not)
		games[gameid].Moves[0] = new uint8[](0);
		games[gameid].Moves[1] = new uint8[](0);

		return gameid;
	}

	function joinGame(uint8 gameid) public {
		require(gameid >= 0);
		require(gameid < (gameCount - 1));
		require(games[gameid].Players[1] != address(0));

		games[gameid].Players[1] = msg.sender;
		// todo: process msg.value as matching stake
	}

	function getPlayerIndex(uint8 gameid) public view returns (uint8 playerIndex) {
		require(gameid >= 0);
		require(gameid < (gameCount - 1));

		if (games[gameid].Players[0] == msg.sender) {
			return 0;
		} else if (games[gameid].Players[1] == msg.sender) {
			return 1;
		}
		revert(); // throw (not a player in this game)
	}

	event Moved(uint8 indexed _gameId, uint8 _playerIndex, uint8 _colNr);

	function makeMove(uint8 gameid, uint8 col) public returns(bool isWinner) {
		require(gameid >= 0);
		require(gameid < (gameCount - 1));
		require(col <= 7);

		uint8 playerIndex = getPlayerIndex(gameid);
		games[gameid].Moves[playerIndex].push(col);
		Moved(gameid, playerIndex, col);
		
		// todo: return if winner
		return (col == 2);
	}
}
