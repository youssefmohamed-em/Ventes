  import { Component, OnInit, inject } from '@angular/core';
  import { OrdersService } from '../../services/orders.service';
  import { TablesComponent } from '../../shared/shared/components/tables/tables.component';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { MerchantfilterService } from '../../services/merchantfilter.service';
  import { TranslateModule, TranslateService } from '@ngx-translate/core';
  import { TableCol } from '../../interfaces/table-col';
  import { Order } from '../../interfaces/order';

  export type OrderStatus = 'IN_PROGRESS' | 'PA_REFUND' | 'DONE' | string;

  @Component({
    selector: 'app-orders',
    standalone: true,
    imports: [TablesComponent, CommonModule, FormsModule, TranslateModule],
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
  })
  export class OrdersComponent implements OnInit {

    private orderService = inject(OrdersService);
    private merchantFilterService = inject(MerchantfilterService);

    constructor(public translate: TranslateService) {}

    showFilters = false;
rows = 10
    list: any[] = [];
    filteredList: any[] = [];

    totalRecords: number = 0;

    filters: any = {
      customer_name: '',
      status: '',
      refNo: '',
      trxRefNumber: '',
      total: '',
      channel: '',
      notificationStatus: '',
      createdFrom: '',
      createdTo: '',
      merchantIds: [],
      sortBy: 'created',
      sortDirection: 'DESC'
    };

    columns: TableCol[] = [];

    ngOnInit(): void {
      this.initColumns();

      this.translate.onLangChange.subscribe(() => this.initColumns());

      // merchant ids من الفلتر الجانبي
    this.merchantFilterService.selectedMerchant$.subscribe((ids: string) => {
  this.filters.merchantIds = ids ? ids.split(',').map(Number) : [];
  this.applyFilters();
});

      this.loadOrders({ page: 0, rows: 10 });
    }

    initColumns() {
      this.columns = [
        { field: 'id',            header: this.translate.instant('ORDERS.ID') },
        { field: 'customer_name', header: this.translate.instant('ORDERS.CUSTOMER_NAME') },
        { field: 'status',        header: this.translate.instant('ORDERS.STATUS') },
        { field: 'total',         header: this.translate.instant('ORDERS.TOTAL') },
        { field: 'currency',      header: this.translate.instant('ORDERS.CURRENCY') },
        { field: 'created',       header: this.translate.instant('ORDERS.CREATED_AT') }
      ];
    }

    loadOrders(event: any) {
      const pageIndex = event.page ?? Math.floor(event.first / event.rows) ?? 0;
      const pageSize = event.rows ?? 10;

      const statusMap: any = {
        pending: 'IN_PROGRESS',
        done: 'DONE',
        refund: 'PA_REFUND'
      };

      const filtersToSend = {
        ...this.filters,
        status: statusMap[this.filters.status] ?? this.filters.status
      };

      this.orderService.searchOrders(pageIndex, pageSize, filtersToSend).subscribe(res => {
        this.list = res.content.map((order: Order) => ({
          ...order,
          statusColor: this.getStatusColor(order.status)
        }));
        this.totalRecords = res.totalElements;
        this.filteredList = [...this.list];
      });
    }

    applyFilters() {
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
        merchantIds: [],
        sortBy: 'created',
        sortDirection: 'DESC',
        merchantName:'',
      };
      this.applyFilters();
    }

    selected(event: any) {
      this.selectedRows = event;
    }

    selectedRows: any[] = [];

    activeFilterCount(): number {
      return Object.entries(this.filters).filter(([key, value]) =>
        key !== 'sortBy' &&
        key !== 'sortDirection' &&
        value !== '' &&
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0)
      ).length;
    }

    getStatusColor(status: string): string {
      switch (status.toUpperCase()) {
        case 'IN_PROGRESS': return 'IN_PROGRESS';
        case 'PENDING':     return 'pending';
        case 'DONE':
        case 'COMPLETED':   return 'DONE';
        default:            return '';
      }
    }
  }