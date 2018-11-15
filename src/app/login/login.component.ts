import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdentityService} from '../identity.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  privateKey:string="";
  wrongCredentials:boolean=false;
  subscription:Subscription
  constructor(private identityService:IdentityService, private router: Router) { }

  ngOnInit()
  {
  }

  ngOnDestroy()
  {
    if(this.subscription!=null)
    {
      this.subscription.unsubscribe();
    }
  }

  login()
  {
    this.wrongCredentials=false;
    this.subscription=
    this.identityService.login(this.privateKey).subscribe(e=>{this.wrongCredentials=!this.identityService.isUserLogged()
                                                                          },e=>this.wrongCredentials=true);
  }
}
