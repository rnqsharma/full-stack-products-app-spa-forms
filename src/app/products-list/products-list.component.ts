import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products-service.service';
import { IProduct } from '../model/product';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  showImage = false;
  pageTitle = 'Product List';
  imageWidth = 50;
  imageMargin = 2;
  showImageName = 'Show';
  // tslint:disable-next-line: variable-name
  _filterText: string;
  // tslint:disable-next-line: variable-name
  products: IProduct[];
  filteredList: IProduct[];


  // tslint:disable-next-line: variable-name
  constructor(private _productService: ProductsService) { }

  ngOnInit() {
    this._productService.getProducts().subscribe((products: IProduct[]) => {
      this.products = products;
      this.filteredList = products;
    });
  }

  get filterText() {
    return this._filterText;
  }

  set filterText(newValue: string) {
    this._filterText = newValue;
    this.filteredList = this._filterText ? this.recordVal(this._filterText) : this.products;
  }

    showOrHideImage(): void {
      this.showImage = !this.showImage;
      if (!this.showImage) {
        this.showImageName = 'Show';
      } else {
        this.showImageName = 'Hide';
      }
    }
    recordVal(name: string) {
        return this.products.filter((product) =>
        product.productName.indexOf(name) !== -1);
    }

    onRatingClicked(message: string): void {
      this.pageTitle = 'Product List: ' + message;
    }

}
