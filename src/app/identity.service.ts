import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Identity } from './identity';
import * as sawtoothSigning from 'sawtooth-sdk/signing';
import * as sawtoothSigningSecp from 'sawtooth-sdk/signing/secp256k1';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  private identity:Identity;
  private context;
  constructor(private http:HttpClient) {this.identity=null; this.context=sawtoothSigning.createContext('secp256k1') }

  isUserLogged():boolean
  {
      if(this.identity)
      {
        return true;
      }
      return false; 
  }
  logout()
  {
    this.identity=null;
  }
  login(privateKey:string):Observable<boolean>
  {
    let privateKeyArray=Buffer.from(this.hexStringToArray(privateKey));
    let key=new sawtoothSigningSecp.Secp256k1PrivateKey(privateKeyArray);
    let signer = new sawtoothSigning.CryptoFactory(this.context).newSigner(key); //added "new"
    if(true)
    {
      this.identity=new Identity(signer,null);
      return of(true);
    }
    //return of(false);
  }

  generateIdentity():Identity
  {
    let privateKey = this.context.newRandomPrivateKey();
    let signer = new sawtoothSigning.CryptoFactory(this.context).newSigner(privateKey) //added "new"
    return new Identity(signer,null);
  }
  getIdentity():Identity
  {
    return this.identity;
  }

  hexStringToArray(hexString:string):Array<number> {
    let buffer:Array<number>=new Array(0);
    while (hexString.length >= 2) {
      buffer.push(parseInt(hexString.substring(0, 2), 16));
      hexString = hexString.substring(2, hexString.length);
    }
    return buffer;
  }
}
