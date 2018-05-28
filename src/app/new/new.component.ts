import { Component, OnInit } from '@angular/core';
import { GameService } from '../util/game.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  accounts: string[];
  contract: any;

  constructor(private gameService: GameService) {
    console.log('Constructor: ', gameService);
  }

  ngOnInit() {
    console.log('OnInit: ', this.gameService);
    console.log('IsRunning: ', this.gameService.isRunning());
  }

  startNew(): string {
    return '';
  }

}
