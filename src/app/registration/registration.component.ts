import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../identity.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  private privateKey:string
  constructor(private identityService:IdentityService) {this.privateKey=''}

  ngOnInit() {
  }

  signUp()
  {

  }
  generateIdentity()
  {
    let signer=this.identityService.generateIdentity().getSigner();
    let privateKeyBuffer=signer._privateKey.privateKeyBytes;
    this.privateKey=Buffer.from(privateKeyBuffer).toString('hex');
  }
}
