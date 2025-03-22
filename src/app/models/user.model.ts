export class UserModel{
    userId: string ='';
    firstName: string ='';
    lastName: string ='';
    email: string ='';
    phoneNumber: string ='';
    address: string ='';
    city: string ='';
    state: string ='';
    zipCode: string ='';
    roleId: string ='';
    createDate: string ='';
    modifyDate: string ='';
}

export interface UserResponse {
  user_id: string;
  user_name : string;
  first_name: string;
  last_name: string;
  full_name:string
  email: string;
  phone_number: string;
  date_of_birth: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  role_id: number;
  shop_name:string;
  active: boolean;
  create_date: string;
  modify_date: string;
}
export class Register {
  fullname: string ='';
  email:string ='';
  phone_number: string ='';
  address: string ='';
  password: string ='';
  retype_password: string ='';
  date_of_birth: string ='';
  facebook_account_id:number =0;
  google_account_id:number =0;
  role_id: number =0
}