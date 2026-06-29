

export class ApiError extends Error{
    public statusCode:number;
    
    public success:boolean;
    public errors:any[]
    constructor(statusCode:number,errors=[],
        message="Something went wrong",
    stack="") {
        super(message)
        this.statusCode=statusCode
        this.success=statusCode<400
        this.errors=errors
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }

}