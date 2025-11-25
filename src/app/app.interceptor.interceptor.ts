import { Injectable } from "@angular/core";
import{ HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

 @Injectable()
 export class AuthInterceptor implements HttpInterceptor {
    
    intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        
        const tokenAutorizacion = localStorage.getItem('token');

        if(tokenAutorizacion){

            const clonedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${tokenAutorizacion}`
                }
            });

            return next.handle(clonedReq);
        }

        return next.handle(req);
    }
 }
