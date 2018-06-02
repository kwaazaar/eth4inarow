import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  public privateKey: string;
  private currentAccount: string;
  // private currentBalance: BigNumber;

  constructor(private web3Service: Web3Service) {
    this.watchAccount();
    this.privateKey = 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';
   }

  ngOnInit() {
  }

  async unlockAccount() {
    await this.web3Service.unlockAccount(this.privateKey);
  }

  watchAccount(): void {
    this.web3Service.currentAccountObservable.subscribe((accountAddress) => {
      this.currentAccount = accountAddress;
      console.log('New wallet account active:', this.currentAccount);
    });
  }
}
