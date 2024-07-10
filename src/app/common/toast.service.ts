import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) {
  }

  showSuccess(message: string) {
    this.toastr.success(message, '', {timeOut: 3000, extendedTimeOut: 3000, progressBar: false, enableHtml: true});
  }

  showError(message: string) {
    this.toastr.error(message, '', {timeOut: 3000, extendedTimeOut: 3000, progressBar: false, enableHtml: true});
  }
}
