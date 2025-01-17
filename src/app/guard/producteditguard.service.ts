import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductsEditComponent } from '../products-edit/products-edit.component';

@Injectable({
providedIn: 'root'
})
export class ProductEditGuard implements CanDeactivate<ProductsEditComponent> {

  canDeactivate(component: ProductsEditComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.productForm.dirty) {
    const productName = component.productForm.get('productName').value || 'New Product';
    return confirm(`Navigate away and lose all changes to ${productName}?`);
    }
    return true;
  }
}
