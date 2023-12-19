export class ApplicationError extends Error{
    constructor(errMessage, code){
        super(errMessage);
        this.code=code;
    }
}