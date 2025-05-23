import {
  Component,
  Input,
  SimpleChanges,
  OnInit,
  OnChanges,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DrawingService } from '../../core/services/canvas/drawing/drawing.service';
import { MouseEventsService } from '../../core/services/canvas/mouse-events/mouse-events.service';
import { CanvasStoreService } from '../../core/services/canvas/canvas-store/canvas-store.service';

export type CanvasShape = {
  type: 'rectangle' | 'star';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: string;
  borderRadius?: number;
  points?: number;
  isSelected?: boolean;
};

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() activeTool!: string;

  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    public drawingService: DrawingService,
    public mouseEventsService: MouseEventsService,
    public store: CanvasStoreService,
  ) {}

  ngOnInit(): void {
    if (this.activeTool) {
      this.store.activeToolSignal.set(this.activeTool);
    }
    this.store.shapeUpdated$.subscribe(() => {
      this.drawingService.redrawCanvas();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeTool'] && this.activeTool) {
      this.store.activeToolSignal.set(this.activeTool);
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.store.canvasElement.set({ nativeElement: canvas });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.store.ctx.set(ctx);
    this.drawingService.redrawCanvas();

    // Mouse events
    canvas.addEventListener('mousedown', e => this.mouseEventsService.handleMouseDown(e));
    canvas.addEventListener('mousemove', e => {
      if (this.store.isDrawingNow() || this.store.isDragging()) {
        this.mouseEventsService.handleMouseMove(e);
      }
    });

    canvas.addEventListener('mouseup', e => this.mouseEventsService.handleMouseUp(e));
    canvas.addEventListener('mouseleave', () =>
      this.mouseEventsService.handleMouseUp(new MouseEvent('mouseup')),
    );

    this.store.activeToolSignal.set(this.activeTool);
  }
}
