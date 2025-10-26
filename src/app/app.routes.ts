import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ListarProcesosComponent } from './pages/procesos/listar-procesos/listar-procesos.component'; 
import { DragAndDropComponent } from './pages/dragAndDrop/dragAndDrop.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'procesos', component: ListarProcesosComponent } ,
  { path: 'dragAndDrop', component: DragAndDropComponent}
];

