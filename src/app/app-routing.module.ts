import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsDetailComponent } from './products-detail/products-detail.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProductEditGuard } from './guard/producteditguard.service';
import { ProductsEditComponent } from './products-edit/products-edit.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { AuthGuard } from './guard/auth-gaurd';
import { CallbackComponent } from './callback/callback.component';


const routes: Routes = [
  {
    path: 'callback',
    component: CallbackComponent
  },
  {path: 'products', canActivate: [AuthGuard], component: ProductsListComponent},
{path: 'products/:id', component: ProductsDetailComponent},

{path: 'welcome', component: WelcomeComponent},
{
  path: 'products/:id/edit',
  canDeactivate: [ProductEditGuard],
  component: ProductsEditComponent
  },

{path: 'newproduct', component: ProductCreateComponent},
{path: '**', redirectTo: 'welcome', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
