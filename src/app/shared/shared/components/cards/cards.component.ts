import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-cards',
  imports: [CommonModule ,TranslateModule ],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
  standalone:true
  
})
export class CardsComponent {
 @Input() title!: string;
  @Input() value!: string | number;
  @Input() icon!: string;      // pi pi-users
  @Input() percent!: string;   // +15%
  @Input() color: 'green' | 'red' = 'green';

  constructor(private translate: TranslateService) {
  }

  
}
