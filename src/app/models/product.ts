// import { ProductImage } from "./product.image";
export interface Product {
  image: string,
  file_id: string[],
  product_code:string ,
  bar_code: number,
  attribute_id:string[],
  product_name: string,
  description_short: string,
  description_long: string,
  price: number,
  promotional_price: number,
  quantity: number,
  category_id:string[],
}

  
  