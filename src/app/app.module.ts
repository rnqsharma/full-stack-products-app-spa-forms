import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsDetailComponent } from './products-detail/products-detail.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProductsEditComponent } from './products-edit/products-edit.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { CallbackComponent } from './callback/callback.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsDetailComponent,
    ProductsListComponent,
    StarRatingComponent,
    WelcomeComponent,
    ProductsEditComponent,
    ProductCreateComponent,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
