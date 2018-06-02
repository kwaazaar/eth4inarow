import {Injectable} from '@angular/core';
import * as contract from 'truffle-contract';
import {Subject} from 'rxjs/Rx';
import { BigNumber } from 'bignumber.js';

declare let require: any;
const Web3 = require('web3');


declare let window: any;

@Injectable()
export class Web3Service {
  private web3: any;
  private accounts: string[];
  public ready = false;
  public MetaCoin: any;
  public accountsObservable = new Subject<string[]>();
  public currentAccountObservable = new Subject<string>();

  public currentAccount: any;
  public currentBalance: BigNumber;

  constructor() {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {
    console.log('bootstrapWeb3 triggered');

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('No web3? You should consider trying MetaMask!');

      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }

    setInterval(() => this.refreshAccounts(), 1000);
    setInterval(() => this.refreshCurrentAccountBalance(), 5000);
  }

  public async unlockAccount(privateKey: string) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.unlockAccount(privateKey);
    }

    const privateKeyToCheck = privateKey.toLocaleLowerCase().startsWith('0x') ? privateKey : '0x' + privateKey;
    let account: any = null;
    account = this.web3.eth.accounts.privateKeyToAccount(privateKeyToCheck);
    console.log('Unlock result:', account);
    return this.setCurrentAccount(account);
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;
  }

  private setCurrentAccount(account: any): boolean {
    const newAddress = account.address ? account.address : account;

    let canSet = this.currentAccount == null;
    if (!canSet) {
      const currentAddress: string = this.currentAccount.address ? this.currentAccount.address : this.currentAccount;
      canSet = currentAddress !== newAddress;
    }

    if (canSet) {
      console.log('New Current-Account:', newAddress);
      this.currentBalance = new BigNumber(0); // Will be retrieved async
      this.currentAccount = account;
      this.currentAccountObservable.next(newAddress);
      return true;
    }
    return false;
  }

  private refreshCurrentAccountBalance() {

    if (this.currentAccount != null) {
      const balanceAddress = this.currentAccount.address ? this.currentAccount.address : this.currentAccount;
      this.web3.eth.getBalance(balanceAddress, (balanceError, balance) => {
        if (balanceError != null) {
          console.error('Failed to refresh ETH balance for account ', balanceAddress);
          this.currentBalance = new BigNumber(0);
        } else {
          this.currentBalance = balance;
        }
      });
    } else {
      this.currentBalance = new BigNumber(0);
    }
  }

  private refreshAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      console.log('Refreshing accounts');
      if (err != null) {
        console.warn('There was an error fetching your accounts.', err);
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length === 0) {
        console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }

      if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
        console.log('Observed new accounts');

        this.accounts = accs;
        if (accs.length > 0) {
          console.log('Attempting to set first found account:', accs[0]);
          this.setCurrentAccount(accs[0]);
        }
        this.accountsObservable.next(accs);
      }

      this.ready = true;
    });
  }

}
