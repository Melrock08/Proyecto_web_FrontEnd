import { Usuario } from "./Usuario";

export interface AuthResponse {
  usuario: Usuario;
  token: string;
}
