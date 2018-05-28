export class Game {
    moves: Array<[number, number]> = [];

    constructor (private accountAddress: string, private gameId: string, private stake: number, private playerNr: number) {
        console.log('Game-ctor');
        console.log(this);
    }

    addMove(column: number) {
        this.moves.push([this.playerNr, column]);
    }
}
