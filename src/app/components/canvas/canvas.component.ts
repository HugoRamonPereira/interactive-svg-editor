import { Component, ElementRef, viewChild, signal, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css',
})
export class CanvasComponent {
  svgCanvas = viewChild<ElementRef<SVGSVGElement>>('svgCanvas');

  width = signal(1200);
  height = signal(800);
  background = signal('white');

  constructor() {
    afterNextRender(() => {
      console.log('Canvas initialized', this.svgCanvas()?.nativeElement);
    });
  }
}
