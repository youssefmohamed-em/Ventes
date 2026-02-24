import { Component, OnInit, inject } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { TablesComponent } from '../../shared/shared/components/tables/tables.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MerchantfilterService } from '../../services/merchantfilter.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [TablesComponent, CommonModule, FormsModule ,TranslateModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrdersService);
private merchantFilterService = inject(MerchantfilterService);
constructor(public translate: TranslateService){
   this.initColumns();
}
  showFilters = false;
  list: any[] = [];
  filteredList: any[] = [];
  totalRecords: number = 0;

  filters = {
    customer_name: '',
    status: '',
    refNo: '',
    trxRefNumber: '',
    total: '',
    channel: '',
    notificationStatus: '',
    createdFrom: '',
    createdTo: '',
    sortBy: 'created',
    sortDirection: 'DESC'
  } as any ;
 initColumns() {
    this.columns = [
      { field: 'id', header: this.translate.instant('ORDERS.ID') },
      { field: 'customer_name', header: this.translate.instant('ORDERS.CUSTOMER_NAME') },
      { field: 'status', header: this.translate.instant('ORDERS.STATUS') },
      { field: 'total', header: this.translate.instant('ORDERS.TOTAL') },
      { field: 'currency', header: this.translate.instant('ORDERS.CURRENCY') },
      { field: 'created', header: this.translate.instant('ORDERS.CREATED_AT') }
    ];
  }
  columns = [
    { field: 'id', header: 'ID' },
    { field: 'customer_name', header: 'Customer Name' },
    { field: 'status', header: 'Status' },
    { field: 'total', header: 'Total' },
    { field: 'currency', header: 'Currency' },
    { field: 'created', header: 'Created At' }
  ];

  selectedRows: any[] = [];

  ngOnInit(): void {

     this.merchantFilterService.selectedMerchants$.subscribe(ids => {
    this.filters.merchantIds = ids;
    this.applyFilters();
  });

    this.loadOrders({ page: 0, rows: 10 });
  }

  loadOrders(event: any) {
    const pageIndex = event.page ?? Math.floor(event.first / event.rows) ?? 0;
    const pageSize = event.rows ?? 10;

    this.orderService.searchOrders(pageIndex, pageSize, this.filters)
      .subscribe(res => {
        this.list = res.content;
        this.totalRecords = res.totalElements;
        this.filteredList = [...this.list];
      });
  }

  applyFilters() {
    // ببساطة نعمل reload للسيرفر مع الفلاتر الحالية
    this.loadOrders({ page: 0, rows: 10 });
  }

  resetFilters() {
    this.filters = {
      customer_name: '',
      status: '',
      refNo: '',
      trxRefNumber: '',
      total: '',
      channel: '',
      notificationStatus: '',
      createdFrom: '',
      createdTo: '',
      sortBy: 'created',
      merchantId:[],
      sortDirection: 'DESC'
    };
    this.applyFilters();
  }

  selected(event: any) {
    console.log('Selected rows:', event);
    this.selectedRows = event;
  }

  activeFilterCount(): number {
    let count = 0;
    Object.keys(this.filters).forEach(key => {
      if (this.filters[key] && key !== 'sortBy' && key !== 'sortDirection') count++;
    });
    return count;
  }
}