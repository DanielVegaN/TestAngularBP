import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductService } from './product.service';
import {
  Product,
  ProductResponse,
  ProductResponseCU,
} from '../interfaces/product';

const mockProducts: ProductResponse = {
  data: [
    {
      id: '1',
      name: 'Product 1',
      logo: 'url',
      description: 'description',
      date_release: '2021-01-01',
      date_revision: '2021-01-01',
    },
    {
      id: '2',
      name: 'Product 2',
      logo: 'url',
      description: 'description',
      date_release: '2021-01-01',
      date_revision: '2021-01-01',
    },
  ],
};
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable<Product[]>', () => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts.data);
    });

    const req = httpMock.expectOne(`${service['url']}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should validate and existing id', (done) => {
    const testId = '1';
    const expectedResponse = true;

    service.verifyIdExist(testId).subscribe((result: boolean) => {
      expect(result).toBe(expectedResponse);
      done();
    });

    const req = httpMock.expectOne(
      `${service['url']}/products/verification/${testId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should add a new product', (done) => {
    const newProduct: Product = {
      id: '3',
      name: 'New Product',
      date_release: '2027-07-01',
      date_revision: '2028-08-01',
      description: 'New Product',
      logo: 'logo.png',
    };

    const mockResponse: ProductResponseCU = {
      data: newProduct,
      message: 'Product added successfully',
    };

    service.addProduct(newProduct).subscribe((result: Product) => {
      expect(result).toEqual(newProduct);
      done();
    });

    const req = httpMock.expectOne(`${service['url']}/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(mockResponse);
  });

  it('should update a product', (done) => {
    const updateProduct: Product = {
      id: '3',
      name: 'New Product',
      date_release: '2027-07-01',
      date_revision: '2028-08-01',
      description: 'New Product',
      logo: 'logo.png',
    };

    const mockResponse: ProductResponseCU = {
      data: updateProduct,
      message: 'Product updated successfully',
    };

    service
      .editProduct(updateProduct)
      .subscribe((result: Product) => {
        expect(result).toEqual(updateProduct);
        done();
      });

    const req = httpMock.expectOne(`${service['url']}/products/${updateProduct.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateProduct);
    req.flush(mockResponse);
  });

  it('should delete a product', (done) => {
    const deleteProduct: Product = {
      id: '3',
      name: 'New Product',
      date_release: '2027-07-01',
      date_revision: '2028-08-01',
      description: 'New Product',
      logo: 'logo.png',
    };

    const mockResponse: ProductResponseCU = {
      data: {} as Product,
      message: 'Product updated successfully',
    };

    service
      .deleteProduct(deleteProduct)
      .subscribe((result: string) => {
        expect(result).toEqual('Product updated successfully');
        done();
      });

    const req = httpMock.expectOne(`${service['url']}/products/${deleteProduct.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  })
});
