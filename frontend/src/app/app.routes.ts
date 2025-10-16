import { Routes } from '@angular/router';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { ViewInventoryComponent } from './view-inventory/view-inventory.component';
import { DeleteInventoryComponent } from './delete-inventory/delete-inventory.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';
import { DeleteRecipeComponent } from './delete-recipe/delete-recipe.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Error404Component } from './error-404/error-404.component';

export const routes: Routes = [
    {
        path: '34375783',
        children: [
            {path: "add-inventory", component: AddInventoryComponent},
            { path: 'view-inventory', component: ViewInventoryComponent },
            { path: 'delete-inventory', component: DeleteInventoryComponent },
            { path: 'add-recipe', component: AddRecipeComponent },
            { path: 'view-recipe', component: ViewRecipeComponent },
            { path: 'delete-recipe', component: DeleteRecipeComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ]
    },
    { path: '**', component: Error404Component }

];
