// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-pricing-card',
//   imports: [],
//   templateUrl: './pricing-card.component.html',
//   styleUrl: './pricing-card.component.css'
// })
// export class PricingCardComponent {

// }

import { Component } from '@angular/core';

@Component({
  selector: 'app-pricing-card',
  standalone: true,
  imports: [],
  templateUrl: './pricing-card.component.html',
  styleUrl: './pricing-card.component.css',
})
export class PricingCardComponent {
  plans = [
    {
      name: 'Free',
      price: '$0/mo',
      features: [
        'Basic SVG editing',
        'Limited shapes and tools',
        '1 project slot',
        'Export to SVG only',
      ],
      popular: false,
    },
    {
      name: 'Premium',
      price: '$9/mo',
      features: [
        'All shapes and tools',
        'Unlimited projects',
        'Export to PNG, JPG, and SVG',
        'Custom fonts and gradients',
        'Priority email support',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Contact us',
      features: [
        'All Premium features',
        'Team collaboration tools',
        'Admin dashboard',
        'SAML/SSO Authentication',
        'Dedicated support manager',
      ],
      popular: false,
    },
  ];
}
