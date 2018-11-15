import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../identity.service';
import { IntkeyService } from '../intkey.service';
import { Identity } from '../identity';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private intkeyService: IntkeyService, private identityService:IdentityService) { }
  ngOnInit(){}

  startIncrementSequence()
  {
    let identity:Identity=this.identityService.getIdentity();
    this.intkeyService.startIncrementSequence(identity);
  }

  stopIncrementSequence()
  {
    this.intkeyService.stopIncrementSequence();
  }

  setToZero()
  {
    let identity:Identity=this.identityService.getIdentity();
    this.intkeyService.setToZero(identity);
  }


}
