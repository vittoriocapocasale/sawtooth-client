import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as sawtoothSigning from 'sawtooth-sdk/signing';
import * as cbor from 'cbor';
import * as crypto from 'crypto'
import * as sawtoothProtobuf from 'sawtooth-sdk/protobuf';
import { IdentityService } from './identity.service';
import { IntkeyPayload } from './IntkeyPayload';
import { Identity } from './identity';
import { SawtoothQueryEntry } from './SawtoothQueryEntry';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class IntkeyService implements OnInit {
  
  public state;
  constructor( private http: HttpClient,private identityService:IdentityService) {this.state=-1;}

  ngOnInit() {

  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/octet-stream' })
  };
  
  public setToZero(identity:Identity):void
  {
    this.state=-1;
    let payload:IntkeyPayload=new IntkeyPayload('set','foo',0);
    this.submitIntkeySequence(payload, identity);
  }
  public startIncrementSequence(identity:Identity):void
  {
    this.state=0;
    let payload:IntkeyPayload=new IntkeyPayload('inc','foo',1);
    this.submitIntkeySequence(payload, identity);
  }
  public startIncrementSingle(identity:Identity):void
  {
    this.state=-1;
    let payload:IntkeyPayload=new IntkeyPayload('inc','foo',1);
    this.submitIntkeySequence(payload, identity);
  }
  public startDecrementSingle(identity:Identity):void
  {
    this.state=-1;
    let payload:IntkeyPayload=new IntkeyPayload('dec','foo',1);
    this.submitIntkeySequence(payload, identity);
  }
  public stopIncrementSequence():void
  {
    this.state=-1;
  }
  public submitIntkeySequence(payload:IntkeyPayload, identity:Identity)
  {
        let signer;
        if(identity)
        {
          signer=identity.getSigner();
        }
        else
        {
          let context=sawtoothSigning.createContext('secp256k1')
          let privateKey = context.newRandomPrivateKey();
          signer = new sawtoothSigning.CryptoFactory(context).newSigner(privateKey) //added "new"
        }
        const payloadBytes = cbor.encode(payload)
        const transactionHeaderBytes = sawtoothProtobuf.TransactionHeader.encode({
          familyName: 'intkey',
          familyVersion: '1.0',
          inputs: ['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
          outputs: ['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
          nonce:  crypto.randomBytes(512).toString('hex'),
          signerPublicKey: signer.getPublicKey().asHex(),
          batcherPublicKey: signer.getPublicKey().asHex(),
          dependencies: [],
          payloadSha512: crypto.createHash('sha512').update(payloadBytes).digest('hex')
        }).finish()
      
        const signature = signer.sign(transactionHeaderBytes)
        
        const transaction = sawtoothProtobuf.Transaction.create({
            header: transactionHeaderBytes,
            headerSignature: signature,
            payload: payloadBytes
        });
        
        const transactions = [transaction]
        const batchHeaderBytes = sawtoothProtobuf.BatchHeader.encode({
            signerPublicKey: signer.getPublicKey().asHex(),
            transactionIds: transactions.map((txn) => txn.headerSignature),
        }).finish()

        const bsignature = signer.sign(batchHeaderBytes)
        const batch = sawtoothProtobuf.Batch.create({
            header: batchHeaderBytes,
            headerSignature: bsignature,
            transactions: transactions
        })

        let batchListBytes:Uint8Array = sawtoothProtobuf.BatchList.encode({
          batches: [batch]
        }).finish()
        batchListBytes=batchListBytes.slice(0,batchListBytes.length); //cutted array to true length
        this.http.post(environment.sawtoothApiBaseAddress+'/batches',batchListBytes.buffer,this.httpOptions).subscribe(function(){console.log('')});
        console.log(Buffer.from(signer._privateKey.privateKeyBytes).toString('hex'))

        if(this.state>=0)
        {
          setTimeout(function (service, payload, identity){console.log(service.state);
                                                          service.submitIntkeySequence(payload,identity);},environment.IntkeySequenceInterval,this, payload,identity);
          this.state=this.state+1;
        }
        
        /*
        */
  }
  queryState():Observable<SawtoothQueryEntry>
  {
    return this.http.get<SawtoothQueryEntry>(environment.sawtoothApiBaseAddress+'/state/1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7')
    //.subscribe(response=>{console.log (cbor.decodeFirstSync(Buffer.from(response.data, 'base64')))})
  }
}
