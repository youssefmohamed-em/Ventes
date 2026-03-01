import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MerchantfilterService {
  private selectedMerchantSubject = new Subject<string>();
  selectedMerchant$ = this.selectedMerchantSubject.asObservable();

  setSelectedMerchant(code: string) {
    this.selectedMerchantSubject.next(code);
  }
}
