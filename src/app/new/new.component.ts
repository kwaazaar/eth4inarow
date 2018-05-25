import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../util/web3.service';

declare let require: any;
const contract_artifacts = require('../../../build/contracts/FourInARow.json');

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  accounts: string[];
  contract: any;

  constructor(private web3Service: Web3Service) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit() {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.watchAccount();
    this.web3Service.artifactsToContract(contract_artifacts)
      .then((contractAbstraction) => {
        this.contract = contractAbstraction;
      });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      //this.model.account = accounts[0];
      //this.refreshBalance();
    });
  }

  startNew(): string {
    return '';
  }

}
