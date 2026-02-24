import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MerchantfilterService {
  private selectedMerchantsSubject = new Subject<number[]>(); // array of IDs
  selectedMerchants$ = this.selectedMerchantsSubject.asObservable();

  setSelectedMerchants(ids: number[]) {
    this.selectedMerchantsSubject.next(ids);
  }
}
