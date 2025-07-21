import { Routes } from '@angular/router';
import { DetailsComponent } from './components/details/details.component';
import { ResourceFormComponent } from './components/resource-form/resource-form.component';
import { HomeComponent } from './components/home/home.component';
import { HelpDeskComponent } from './components/help-desk/help-desk.component';
import { canDeactivateGuard } from './can-deactivate.guard';
import { MiniFormComponent } from './components/mini-form/mini-form.component';

export const routes: Routes = [
    {path:"Form",component: ResourceFormComponent},
    {path:"Edit/:empId",component: ResourceFormComponent,canDeactivate:[canDeactivateGuard]},
    {path:"Details/:empId",component: HomeComponent},
    {path:"Home",component: DetailsComponent},
    {path:"help-desk",component:HelpDeskComponent},
    {path:"bulk-edit",component:MiniFormComponent},
    {path:"", redirectTo: "/Home", pathMatch:'full'},
    {path:"**", redirectTo: "/Home", pathMatch:'full'}
];
