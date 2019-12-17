import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IProduct } from '../model/product';
import { NumberValidators } from '../validator/number.validator';
import { GenericValidator } from '../validator/generic-validator';
import { ProductsService } from '../services/products-service.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit, OnDestroy {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Create Product';
  errorMessage: string;
  product: IProduct;
  private sub: Subscription;
  productForm: FormGroup;
  displayMessage: { [key: string]: string } = {};
private validationMessages: { [key: string]: { [key: string]: string } };
private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private productService: ProductsService) {

                this.validationMessages = {
                  productName: {
                  required: 'Product name is required.',
                  minlength: 'Product name must be at least three characters.',
                  maxlength: 'Product name cannot exceed 50 characters.'
                  },
                  productCode: {
                  required: 'Product code is required.'
                  },
                  starRating: {
                  range: 'Rate the product between 1 (lowest) and 5 (highest).'
                  }
                  };
              }

  ngOnInit() {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]],
      productCode: ['', Validators.required],
      starRating: ['', NumberValidators.range(1, 5)],
      tags: this.fb.array([]),
      description: ''
      });
      // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
      const id = +params.get('id');
      this.getProduct(id);
      }
      );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    }

    getProduct(id: number): void {
      this.productService.getProduct(id)
      .subscribe({
      next: (product: IProduct) => this.displayProduct(product),
      error: err => this.errorMessage = err
      });
      }
      
      displayProduct(product: IProduct): void {
      if (this.productForm) {
      this.productForm.reset();
      }
      this.product = product;
      
      if (this.product.productId === 0) {
      this.pageTitle = 'Add Product';
      } else {
      this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
      
      // Update the data on the form
      this.productForm.patchValue({
      productName: this.product.productName,
      productCode: this.product.productCode,
      starRating: this.product.starRating,
      description: this.product.description
      });
      }

  saveProduct(): void {
    if (this.productForm.valid) {
    if (this.productForm.dirty) {
    const p = { ...this.product, ...this.productForm.value };
    
    if (p.id === 0) {
    this.productService.createProduct(p)
    .subscribe({
    next: () => this.onSaveComplete(),
    error: err => this.errorMessage = err
    });
    } else {
    this.productService.updateProduct(p)
    .subscribe({
    next: () => this.onSaveComplete(),
    error: err => this.errorMessage = err
    });
    }
    } else {
    this.onSaveComplete();
    }
    } else {
    this.errorMessage = 'Please correct the validation errors.';
    }
    }


    onSaveComplete(): void {
      // Reset the form to clear the flags
      this.productForm.reset();
      this.router.navigate(['/products']);
      }

}
