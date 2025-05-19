import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { CanvasComponent } from "../../components/canvas/canvas.component";

@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent, FooterComponent, CanvasComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
