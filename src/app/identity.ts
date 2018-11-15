

export class Identity
{

    constructor (private signer, private role:string){}

    getSigner()
    {
        return this.signer;
    }
    getRole():string
    {
        return this.role;
    }
    setRole(role:string)
    {
        this.role=role;
    }
}