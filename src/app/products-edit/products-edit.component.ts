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
selector: 'app-products-edit',
templateUrl: './products-edit.component.html',
styleUrls: ['./products-edit.component.css']
})
export class ProductsEditComponent implements OnInit, AfterViewInit, OnDestroy {

@ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

pageTitle = 'Product Edit';
errorMessage: string;
productForm: FormGroup;

product: IProduct;
private sub: Subscription;

// Use with the generic validation message class
displayMessage: { [key: string]: string } = {};
private validationMessages: { [key: string]: { [key: string]: string } };
private genericValidator: GenericValidator;

get tags(): FormArray {
return this.productForm.get('tags') as FormArray;
}

constructor(private fb: FormBuilder,
            private route: ActivatedRoute,
            private router: Router,
            private productService: ProductsService) {
                // console.log(this.pageTitle);

// Defines all of the validation messages for the form.
// These could instead be retrieved from a file or database.
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

// Define an instance of the validator for use with this form,
// passing in this form's set of validation messages.
this.genericValidator = new GenericValidator(this.validationMessages);
}

ngOnInit(): void {
    console.log('INNNN');
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

ngAfterViewInit(): void {
// Watch for the blur event from any input element on the form.
// This is required because the valueChanges does not provide notification on blur
const controlBlurs: Observable<any>[] = this.formInputElements
.map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

// Merge the blur event observable with the valueChanges observable
// so we only need to subscribe once.
merge(this.productForm.valueChanges, ...controlBlurs).pipe(
debounceTime(800)
).subscribe(value => {
this.displayMessage = this.genericValidator.processMessages(this.productForm);
});
}

addTag(): void {
this.tags.push(new FormControl());
}

deleteTag(index: number): void {
this.tags.removeAt(index);
this.tags.markAsDirty();
}

getProduct(id: number): void {
this.productService.getProduct(id)
.subscribe({
next: (product: IProduct) => this.displayProduct(product),
error: err => this.errorMessage = err
});
}

displayProduct(product: IProduct): void {
    console.log(product);
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

deleteProduct(): void {
if (this.product.productId === 0) {
// Don't delete, it was never saved.
this.onSaveComplete();
} else {
if (confirm(`Really delete the product: ${this.product.productName}?`)) {
this.productService.deleteProduct(this.product.productId)
.subscribe({
next: () => this.onSaveComplete(),
error: err => this.errorMessage = err
});
}
}
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
