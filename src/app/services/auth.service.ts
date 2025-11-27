import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class AuthService{
    
    constructor(){}

    estaAutenticado(): boolean {
        // Implementar la lógica de autenticación aquí
        return true;
    }

    login(token: string) : void {
        localStorage.setItem('auth_token', token);
    }

    logout() : void {
        localStorage.removeItem('auth_token');
    }
}