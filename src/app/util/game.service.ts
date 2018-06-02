import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { Game } from './game';

declare let require: any;
const contract_artifacts = require('../../../build/contracts/FourInARow.json');

@Injectable()
export class GameService {
  accounts: string[];
  contract: any;
  game: Game;

  constructor(private web3Service: Web3Service) {
    console.log('GameService-ctor', web3Service);
    this.game = null;

    this.watchAccount();
    this.web3Service.artifactsToContract(contract_artifacts)
      .then((contractAbstraction) => {
        this.contract = contractAbstraction;
      });
  }

  async startNew(stake: number) {
    if (this.game) {
      throw new Error('Game already running. Abort first');
    }

    if (stake <= 0) {
      throw new Error('Stake cannot be less than or equal to 0');
    }

    // todo
    // - Start game on contract and get its id
    const account = this.accounts[0];
    const gameId = '1';
    await this.createGame(new Game(account, gameId, stake, 1));
  }

  abortGame(): boolean {
    if (!this.game) {
      return false;
    }

    // todo
    // - Abort game on contract

    this.game = null;
    return true;
  }

  isRunning(): boolean {
    if (this.game) {
      return true;
    }

    return false;
  }


  watchAccount(): void {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      console.log('Accounts found:', accounts);
      this.accounts = accounts;
      if (accounts.length === 0) {
        console.error('No (unlocked) accounts available to interact with network');
      } else {
        this.contract.defaults({ from: this.accounts[0] }); // First account becomes used address
        // Account switched, cannot continue game!
        // this.refreshBalance();
      }
    });
  }
  /*
    async refreshBalance() {
      console.log('Refreshing balance');
  
      try {
        const deployed = await this.contract.deployed();
        console.log(deployed);
        console.log('Account', this.model.account);
        const metaCoinBalance = await deployed.getBalance.call(this.model.account);
        console.log('Found balance: ' + metaCoinBalance);
        this.model.balance = metaCoinBalance;
      } catch (e) {
        console.log(e);
        this.setStatus('Error getting balance; see log.');
      }
    }
  */

  async createGame(game: Game) {
    if (!this.contract) {
      throw new Error('Metacoin is not loaded, unable to send transaction');
    }

    if (this.game) {
      throw new Error('A game is already active. Abort it first.');
    }

    console.log('Starting new game');

    try {
      const deployedContract = await this.contract.deployed();
      const txResult = await deployedContract.createGame();
      // result is an object with the following values:
      //
      // result.tx      => transaction hash, string
      // result.logs    => array of decoded events that were triggered within this transaction
      // result.receipt => transaction receipt object, which includes gas used

      console.log('hash:', txResult.tx);
      // We can loop through result.logs to see if we triggered the Transfer event.
      for (let i = 0; i < txResult.logs.length; i++) {
        const log = txResult.logs[i];
        console.log('log:', log);
      }
      console.log('receipt:', txResult.receipt);
    } catch (e) {
      console.error(e);
    }


    /*
  const amount = this.model.amount;
  const receiver = this.model.receiver;

  console.log('Sending coins' + amount + ' to ' + receiver);

  this.setStatus('Initiating transaction... (please wait)');
  try {
    const deployedMetaCoin = await this.contract.deployed();
    const transaction = await deployedMetaCoin.sendCoin.sendTransaction(receiver, amount, { from: this.model.account });

    if (!transaction) {
      this.setStatus('Transaction failed!');
    } else {
      this.setStatus('Transaction complete!');
    }
  } catch (e) {
    console.log(e);
    this.setStatus('Error sending coin; see log.');
  }
  */
  }

}
