import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../modules/shared.module';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductService } from '../../../services/product.service';
import { UserService } from '../../../services/user.service';
import { UserResponse } from '../../../models/user.model';
import { OrderService } from '../../../services/order.service';
@Component({
  selector: 'app-order-product',
  templateUrl: './order-product.component.html',
  styleUrls: ['./order-product.component.scss'],
  standalone: true,
  imports: [SharedModule, CommonModule, MatInputModule, MatAutocompleteModule,
    MatFormFieldModule, MatIconModule, MatCheckboxModule]
})
export class OrderProductComponent implements OnInit {
  productForm: FormGroup;
  filteredOptions: Observable<any[]>[] = [];
  filteredCustomers: Observable<any[]> = of([]);
  dataProducts: any = [];
  dataOrders: any = [];
  dataOrderDetail: any = [];
  public listUser: UserResponse[] = [];
  totalPrice = 0;
  cusInfo = {
    email: '',
    phone_number: '',
    shop_name: ''
  }
  objectSearchOrder = {
    user_id: '2dcae83bbe834f2684883289f7ff111f',
    page_number: '1',
    page_size: '10',
    sort_by: '',
    sort_direction: ''
  }

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
  ) {
    this.getListUser();
    this.productForm = this.fb.group({
      customer_id: ['', Validators.required],
      customer_name: ['', Validators.required],
      order_id:[''],
      products: this.fb.array([this.createProduct()]),
      total_price: '',
      total_quantity:[0]
    });

  }

  ngOnInit() {
    this.getAllProducts();
    this.getOrdersPage();
  }

  getListUser() {
    this.userService.getListAllUser().subscribe({
      next: (response: any) => {
        this.listUser = response.data?.list_user;
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  // Create a new product form group
  createProduct(): FormGroup {
    return this.fb.group({
      order_detail_id: [''],
      product_id: ['', Validators.required],
      product_name: ['', Validators.required],  // Autocomplete input
      quantity: ['', [Validators.required, Validators.min(1)]],
      price_of_product: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  // Get products form array
  get products(): FormArray {
    return this.productForm.get('products') as FormArray;
  }
  get customer(): FormControl {
    return this.productForm.get('customer_name') as FormControl;
  }

  // Add new product row
  addProduct(): void {
    this.products.push(this.createProduct());
    this.initFilteredOptions();  // Reinitialize filtered options
  }

  // Remove product row
  removeProduct(index: number): void {
    this.products.removeAt(index);
    this.filteredOptions.splice(index, 1);  // Remove the filtered option for that row
    this.totalPrice = 0;
    this.setTotalPrice();
  }
  getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        this.dataProducts = response.data;
        this.initFilteredOptions();
      },
      error: (err) => {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
      },
      complete: () => {
        console.log('Hoàn tất việc lấy dữ liệu sản phẩm');
      }
    });
  }

  // Initialize filtered options for each row
  initFilteredOptions(): void {
    this.filteredCustomers = this.customer.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomer(value || '')),
    );


    this.filteredOptions = this.products.controls.map(row => {
      const control = row.get('product_name') as FormControl;
      return control.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value?.name || '')),
        map(name => name ? this._filter(name) : this.dataProducts.slice())
      );
    });
  }

  // Filter function for autocomplete, filtering by the `name` field
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.dataProducts.filter((option: any) => option.product_name.toLowerCase().includes(filterValue));
  }

  private _filterCustomer(name: string): any[] {
    const filterValue = name ? name.toLowerCase() : '';
    return this.listUser.filter((option: any) => (option.full_name).toLowerCase().includes(filterValue));
  }

  // Display the name in the input field
  displayFn(option?: any): string {
    if (!option) {
      return '';
    }
    return option ? option : '';
  }
  displayFnCus(option?: any): any {

    if (!option) {
      return '';
    }

    return option;
  }
  onOptionSelectedCus(e: any) {
    if (e.option.value) {
      this.productForm.get('order_id')?.setValue(e.option.value.user_id);
      this.productForm.get('customer_id')?.setValue(e.option.value.user_id);
      this.productForm.get('customer_name')?.setValue(e.option.value.full_name);
      this.cusInfo.email = e.option.value.email;
      this.cusInfo.phone_number = e.option.value.phone_number;
      this.cusInfo.shop_name = e.option.value.shop_name;
    }

  }

  onOptionSelected(event: any, row: any) {
    let qty = row.get('quantity').value ? row.get('quantity').value : 0;
    if (event.option) {
      row.patchValue({ order_detail_id: event.option.value.order_detail_id });
      row.patchValue({ product_id: event.option.value.product_id });
      row.patchValue({ product_name: event.option.value.product_name });
      row.patchValue({ price_of_product: event.option.value.price });
      let price = event.option.value.price ? event.option.value.price : 0;
      let rowTotalPrice = price * qty;
      row.get('price').setValue(rowTotalPrice)
    } else {
      let price = row.value.price ? row.value.price : 0;
      let rowTotalPrice = price * qty;
      row.patchValue({ price: rowTotalPrice });
    }
    this.setTotalPrice();
  }

  changeQty(event: any, row: any) {
    let price = this.dataProducts.find((x: any) => x.product_id == row.value.product_id).price;
    row.value.price = price ? price : 0
    this.onOptionSelected(event, row);
  }

  setTotalPrice() {
    let totalQuantity =0;
    this.totalPrice = 0;
    this.productForm.value.products.forEach((p: any) => {
      this.totalPrice += p.price;
      totalQuantity +=p.quantity;

    });
    this.productForm.get('total_price')?.setValue(this.totalPrice);
    this.productForm.get('total_quantity')?.setValue(totalQuantity);
  }


  // Handle form submission
  onSubmit(): void {
    console.log(this.productForm.value.products);

    this.productService.createdOrders(this.productForm.value).subscribe({
      next: (response: any) => {
        this.dataProducts = response.data;
        // Thực hiện tiếp tục các hành động sau khi dữ liệu đã được nhận
        this.initFilteredOptions();
      },
      error: (err) => {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
      },
      complete: () => {
        console.log('Hoàn tất việc lấy dữ liệu sản phẩm');
      }
    });

    //   const transformedProducts = (this.productForm.value.products).map((item:any) => ({
    //     product: item.product.id, // Chỉ lấy id của sản phẩm
    //     quantity: item.quantity,
    //     price: item.price
    // }));
    // console.log(transformedProducts);
    //   if (this.productForm.valid) {
    //     console.log(this.productForm.value);
    //   }
  }
  getOrdersPage() {
    this.orderService.getListPageOrder(this.objectSearchOrder).subscribe({
      next: (response: any) => {
        this.dataOrders = (response.data.list_order || []).map((item: any) => {
          const customer = this.listUser.find(u => u.user_id === item.user_id);
          const createBy = this.listUser.find(u => u.user_id === item.create_by);
          const updateBy = this.listUser.find(u => u.user_id === item.update_by);
          return {
            ...item,
            customer_name: customer ? customer.full_name : '',
            user_create_by: createBy ? createBy.full_name : '',
            user_update_by: updateBy ? updateBy.full_name : ''
          };
        });
        console.log(this.dataOrders);
      },
      error: (err) => {
        console.error('Lỗi khi lấy dữ liệu đơn hàng:', err);
      }
    });
  }
  onEditOrder(data:any) {
    if (data.order_id) {
      this.orderService.getListOrderDetail(data.order_id).subscribe({
        next: (response: any) => {
          this.dataOrderDetail = (response.data || []).map((item: any) => {
            const product = this.dataProducts.find((p: any) => p.product_id === item.product_id);
            return {
              ...item,
              product_name: product ? product.product_name : '',
            };
          });
          this.setDataForm(this.dataOrderDetail,data);

        },
        error: (err) => {
          console.error('Lỗi khi lấy dữ liệu order Detail:', err);
        }
      });
    }

  }
  setDataForm(data: any,dataCus:any) {
    const firstOrder = data[0] || {};
        this.productForm = this.fb.group({
          order_id: [firstOrder.order_id || '', Validators.required],
          customer_id: [dataCus.user_id || '', Validators.required],
          customer_name: [dataCus.customer_name || '', Validators.required],
          products: this.fb.array([]), // Xóa danh sách cũ và thêm mới
          total_price: [0]
        });
      let findUser = this.listUser.find(x => x.user_id === dataCus.user_id) ;
      if(findUser){
        this.cusInfo.email = findUser.email;
        this.cusInfo.phone_number = findUser.phone_number;
        this.cusInfo.shop_name = findUser.shop_name;
      }
    const productsArray = this.productForm.get('products') as FormArray;
    data.forEach((item: any) => {
      productsArray.push(this.fb.group({
        order_detail_id: [item.order_detail_id],
        product_id: [item.product_id, Validators.required],
        product_name: [item.product_name, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        price_of_product: [item.price, [Validators.required, Validators.min(0)]],
        price: [item.price, [Validators.required, Validators.min(0)]],
      }));
    });
    this.setTotalPrice();
  }
  onDeleteOrder(orderId: string) {
    if (orderId) {

    }
  }
}