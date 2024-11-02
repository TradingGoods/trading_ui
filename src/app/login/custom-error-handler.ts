import { Injectable } from "@angular/core";

@Injectable()
export class CustomErrorsHandler {
    constructor(){}
    handleError(error: any){
        console.log(error);
    }
}