import { Routes } from '@angular/router';
import { DetailsComponent } from './components/details/details.component';
import { ResourceFormComponent } from './components/resource-form/resource-form.component';
import { HomeComponent } from './components/home/home.component';
import { HelpDeskComponent } from './components/help-desk/help-desk.component';
import { canDeactivateGuard, editCanActivateGuard, formCanActivateGuard } from './can-deactivate.guard';
import { MiniFormComponent } from './components/mini-form/mini-form.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: "Form", component: ResourceFormComponent,canActivate: [formCanActivateGuard]},
    { path: "Edit/:empId", component: ResourceFormComponent, canDeactivate: [canDeactivateGuard],canActivate: [editCanActivateGuard]},
    { path: "Details/:empId", component: HomeComponent},
    { path: "Home", component: DetailsComponent },
    { path: "help-desk", component: HelpDeskComponent },
    { path: "bulk-edit", component: MiniFormComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
