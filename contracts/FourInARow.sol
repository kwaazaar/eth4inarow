pragma solidity ^0.4.16;

contract FourInARow {
	struct Game {
		address[2] Players;
		bytes32[2] Moves;
		uint256[2] NextMoveIndexes;
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

		bytes32[2] memory moves;
		games[gameid].Moves = moves;

		uint256[2] memory nextMoveIndexes;
		nextMoveIndexes[0] = 0;
		nextMoveIndexes[1] = 0;
		games[gameid].NextMoveIndexes = nextMoveIndexes;

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

	event Moved(uint8 indexed _gameId, int8 _playerIndex, uint256 _colNr);

	function makeMove(uint8 gameid, uint256 col) public returns(bool isWinner) {
		require(gameid >= 0);
		require(gameid < (gameCount - 1));
		require(col <= 7);

		uint8 playerIndex = getPlayerIndex(gameid);
		uint256 nextMoveIndex = games[gameid].NextMoveIndexes[playerIndex];
		games[gameid].NextMoveIndexes[playerIndex]++;
		bytes32 moves = games[gameid].Moves[playerIndex];
		byte[] memory move = new byte[](1);
		move[0] = col;
		//moves[nextMoveIndex] = move;
		return false;
	}
}
