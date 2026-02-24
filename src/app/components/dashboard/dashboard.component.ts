import { Component } from '@angular/core';
import { CardsComponent } from "../../shared/shared/components/cards/cards.component";
import { TablesComponent } from "../../shared/shared/components/tables/tables.component";
import { ChartsComponent } from "../../shared/shared/components/charts/charts.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  imports: [CardsComponent,  ChartsComponent, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  columns = [
  { header: 'Name', field: 'name' },
  { header: 'Sales', field: 'sales' },
  { header: 'Products', field: 'products' },
  { header: 'Premium', field: 'premium' },
  { header: 'Tier', field: 'tier' }
];

data = [
  { name: "Danielle Campbell", sales: "$213k", products: 210, premium: 21, tier: "Gold" },
  { name: "John Mayer", sales: "$150k", products: 150, premium: 18, tier: "Silver" },
  
];
}
