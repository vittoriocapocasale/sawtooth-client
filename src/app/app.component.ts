import { Component } from '@angular/core';
import {IntkeyService} from './intkey.service';


@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {

  constructor(private intkeyService: IntkeyService) { }

  title = 'Sawtooth-client';
}
