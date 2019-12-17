import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products-service.service';
import { IProduct } from '../model/product';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.css']
})
export class ProductsDetailComponent implements OnInit {

  product: IProduct;
  // tslint:disable-next-line: variable-name
  constructor(private _productService: ProductsService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    const id = +this._route.snapshot.paramMap.get('id');
    this._productService.getProduct(id).subscribe(product => this.product = product);
  }

  onBack() {
    this._router.navigate(['/products']);
  }

}
