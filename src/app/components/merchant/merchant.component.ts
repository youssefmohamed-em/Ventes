import { Component, inject, OnInit } from '@angular/core';
import { MerchantService } from '../../services/merchant.service';
import { Merchant, MerchantResponse } from '../../interfaces/merchant';
import { TablesComponent } from '../../shared/shared/components/tables/tables.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { MerchantfilterService } from '../../services/merchantfilter.service';
import { TranslateService , TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-merchant',
  imports: [TablesComponent, FormsModule , TranslateModule,],
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css']
})
export class MerchantComponent implements OnInit {
constructor(public translate: TranslateService){
   this.initColumns();
}
  totalRecords = 0;
  merchants: (Merchant & { currencyName: string; countryName: string })[] = [];
  searchTerm = '';
private merchantFilterService = inject(MerchantfilterService);
  private merchantService = inject(MerchantService);
  private searchSubject = new Subject<string>();
 initColumns(){

  this.columns = [
      { field: 'id',           header: this.translate.instant('ORDERS.ID') },
      { field: 'name',         header: this.translate.instant('ORDERS.NAME') },
      { field: 'status',       header: this.translate.instant('ORDERS.STATUS') },
      { field: 'currencyName', header: this.translate.instant('ORDERS.CURRENCY') },
      { field: 'countryName',  header: this.translate.instant('ORDERS.COUNTRY') },
    ];
 }
  columns = [
    { field: 'id',           header: 'ID' },
    { field: 'name',         header: 'Name' },
    { field: 'status',       header: 'Status' },
    { field: 'currencyName', header: 'Currency' },
    { field: 'countryName',  header: 'Country' },
  ];

  ngOnInit() {
    this.loadMerchants(0, 10, '');

    // debounce عشان متبعتش request لكل حرف
    this.searchSubject.pipe(debounceTime(400)).subscribe(term => {
      this.loadMerchants(0, 10, term);
    });
  }

  loadMerchants(page: number, size: number, search: string = '') {
    this.merchantService.getMerchants(page, size, search).subscribe({
      next: (res) => {
        this.merchants = res.content.map(m => ({
          ...m,
          currencyName: m.defaultCurrency?.name,
          countryName: m.country?.name
        }));
        this.totalRecords = res.totalElements;
      },
      error: (err) => console.error(err),
    });
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  onPageChange(event: any) {
    const page = event.first / event.rows;
    this.loadMerchants(page, event.rows, this.searchTerm);
  }


onSelectionChange(selected: any[]) {
  const ids = selected.map(m => m.id);
  this.merchantFilterService.setSelectedMerchants(ids);
}
  
}