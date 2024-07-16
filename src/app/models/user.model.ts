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
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  roleId: string;
  createDate: string;
  modifyDate: string;
}
