import { Component, signal } from '@angular/core';
import { ToolbarComponent } from "../../components/toolbar/toolbar.component";
import { CanvasComponent } from "../../components/canvas/canvas.component";

@Component({
  selector: 'app-home',
  imports: [ToolbarComponent, CanvasComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  activeTool = signal('rectangle');
  onToolSelected(toolId: string) {
    this.activeTool.set(toolId);
  }
}
