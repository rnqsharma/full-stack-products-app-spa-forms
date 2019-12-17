import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { IProduct } from '../model/product';
import { GetResponse } from '../model/getresponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient) { }

  public getProduct(id: number): Observable<IProduct> {
    return this._http.get<IProduct>(`http://localhost:9999/api/products/${id}`);
  }

  public getProducts(): Observable<IProduct[]> {
    const token = localStorage.getItem('access_token');
    return this._http.get<GetResponse>('/server/api/products/',
    {headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)})
          .pipe(
            map(response => response._embedded.products),
            tap(products => console.log(`fetchedproducts`)),
            catchError(this.handleError)
          );
  }

  public createProduct(product: IProduct): Observable<IProduct> {

    const headers = new HttpHeaders({'Content-Type': 'application/json'}); // MIME TYPE
    return this._http.post<IProduct>(`http://localhost:3000/products`, product, {headers})
    .pipe(tap (data => console.log('Create Product is Successful' + JSON.stringify(data))),
    catchError(this.handleError));
  }

  deleteProduct(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `http://localhost:3000/products/${id}`;
    return this._http.delete<IProduct>(url, { headers })
    .pipe(
    tap(data => console.log('deleteProduct: ' + id)),
    catchError(this.handleError)
    );
    }
  updateProduct(product: IProduct): Observable<IProduct> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `http://localhost:3000/products/${product.productId}`;
    return this._http.put<IProduct>(url, product, { headers })
    .pipe(
    tap(() => console.log('updateProduct: ' + product.productId)),
    // Return the product on an update
    map(() => product),
    catchError(this.handleError)
    );
    }




  private handleError(err: ErrorEvent) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    errorMessage = `An error occurred: ${err.error.message}`;
    } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    errorMessage = `Backend returned code ${err.error.status}: ${err.error.body}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
