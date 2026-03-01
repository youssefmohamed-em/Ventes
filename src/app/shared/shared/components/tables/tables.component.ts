import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-tables',
  imports: [CommonModule, TableModule , TranslateModule  ,CommonModule],
  templateUrl: './tables.component.html',
})
export class TablesComponent {
@Input() statusColorMap: Record<string, string> = {};

@Input() dotColorMap: Record<string, string> = {};
  @Input() data: any[] = [];
  @Input() columns: { field: string; header: string }[] = [];
  @Input() totalRecords: number = 0;
  @Input() selectionMode: 'single' | 'multiple' | null = null;
@Input() rows: number = 10;
  @Output() pageChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();

  selectedRows: any[] = [];

  onPage(event: any) {
    this.pageChange.emit(event);
  }

  onSelectionChange() {
    this.selectionChange.emit(this.selectedRows);
  }

  getValue(row: any, field: string): any {
    return field.split('.').reduce((acc, part) => acc?.[part], row);
  }



}