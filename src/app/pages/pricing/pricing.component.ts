import { Component } from '@angular/core';
import { PricingCardComponent } from "../../components/pricing-card/pricing-card.component";

@Component({
  selector: 'app-pricing',
  imports: [ PricingCardComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {

}
