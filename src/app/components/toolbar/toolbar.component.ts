import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  toolSelected = output<string>();
  activeTool = signal('rectangle');

  selectTool(tool: string) {
    this.activeTool.set(tool);
    this.toolSelected.emit(tool)
  }
}
