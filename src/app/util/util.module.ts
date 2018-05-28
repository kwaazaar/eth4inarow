import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Web3Service} from './web3.service';
import {GameService} from './game.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    Web3Service,
    GameService
  ],
  declarations: []
})
export class UtilModule {
}
