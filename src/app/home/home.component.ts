import { Component, OnInit } from '@angular/core';
import {IntkeyService} from '../intkey.service';
import * as cbor from 'cbor';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  private foo;
  constructor(private intkeyService: IntkeyService) { }

  ngOnInit()
  {
    this.intkeyService.queryState().subscribe(response=>{this.foo=cbor.decodeFirstSync(Buffer.from(response.data, 'base64')).foo})
  }
  startIncrementSequence()
  {
    this.intkeyService.startIncrementSequence(null);
  }

  stopIncrementSequence()
  {
    this.intkeyService.stopIncrementSequence();
  }

  setToZero()
  {
    this.intkeyService.setToZero(null);
  }

  queryState()
  {
    this.intkeyService.queryState().subscribe(response=>{this.foo=cbor.decodeFirstSync(Buffer.from(response.data, 'base64')).foo})
    
  }
  startIncrementSingle()
  {
    this.intkeyService.startIncrementSingle(null);
  }
  startDecrementSingle()
  {
    this.intkeyService.startDecrementSingle(null);
  }
}

