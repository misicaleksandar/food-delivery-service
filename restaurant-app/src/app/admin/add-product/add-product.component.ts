import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/shared/models/product.model';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styles: [
  ]
})
export class AddProductComponent implements OnInit {

  price: number = 0.01;

  newProduct: Product = new Product();

  addProductForm = this.fb.group({
    Name : ['', Validators.required],
    Ingredients : ['', Validators.required],
    Price : ['', Validators.required]
  });

  constructor(private service: UserService, private fb: UntypedFormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.newProduct.name = this.addProductForm.value.Name
    this.newProduct.price = this.price
    this.newProduct.ingredients = this.addProductForm.value.Ingredients

    this.service.addProduct(this.newProduct).subscribe({
      next: (data : Object) => { 
        this.toastr.success('You have successfully added a product');
        this.addProductForm.reset();
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    });
  }
  

}
