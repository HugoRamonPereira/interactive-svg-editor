// core/services/canvas-store.service.ts
import { Injectable, signal, ElementRef } from '@angular/core';
import type { CanvasShape } from '../../../../components/canvas/canvas.component';
// I had to use Subject from rxjs to avoid Circular Dependency
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CanvasStoreService {
  // This is from rxjs
  shapeUpdated$ = new Subject<void>();

  canvasElement = signal<ElementRef<HTMLCanvasElement> | null>(null);
  ctx = signal<CanvasRenderingContext2D | null>(null);

  activeToolSignal = signal<string>('');
  selectedShape = signal<CanvasShape | null>(null);
  selectedShapeId = signal<string | null>(null);

  showConfigPanel = signal(false);
  configType = signal<'rectangle' | 'star' | null>(null);
  configPanelPosition = signal({ top: '0px', left: '0px' });

  isDragging = signal(false);
  dragOffset = signal({ x: 0, y: 0 });
  isDrawingNow = signal(false);
  startX = signal(0);
  startY = signal(0);
  shapes = signal<CanvasShape[]>([]);

  findShapeAtPosition(x: number, y: number): CanvasShape | undefined {
    const shapes = this.shapes();
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (this.isPointInShape(x, y, shape)) {
        return shape;
      }
    }
    return undefined;
  }

  isPointInShape(x: number, y: number, shape: CanvasShape): boolean {
    if (shape.type === 'rectangle') {
      return (
        x >= Math.min(shape.x1, shape.x2) &&
        x <= Math.max(shape.x1, shape.x2) &&
        y >= Math.min(shape.y1, shape.y2) &&
        y <= Math.max(shape.y1, shape.y2)
      );
    } else if (shape.type === 'star') {
      const centerX = (shape.x1 + shape.x2) / 2;
      const centerY = (shape.y1 + shape.y2) / 2;
      const radius = Math.min(Math.abs(shape.x2 - shape.x1), Math.abs(shape.y2 - shape.y1)) / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      return Math.sqrt(dx * dx + dy * dy) <= radius;
    }

    return false;
  }

  updateConfigPanelPosition(shape: CanvasShape) {
    const canvas = this.canvasElement()?.nativeElement;
    if (!canvas) return;

    const shapeCenterY = (shape.y1 + shape.y2) / 2;
    const shapeRightEdge = Math.max(shape.x1, shape.x2);

    const panelWidth = 250;
    const panelHeight = 200;

    const leftPosition = Math.min(shapeRightEdge + 20, canvas.width - panelWidth - 10);

    const topPosition = Math.max(
      10,
      Math.min(shapeCenterY - panelHeight / 2, canvas.height - panelHeight - 10),
    );

    this.configPanelPosition.set({
      top: `${topPosition}px`,
      left: `${leftPosition}px`,
    });
  }

  updateShapeConfig<T extends keyof CanvasShape>(value: CanvasShape[T], property: T) {
    const current = this.selectedShape();
    if (!current) return;

    const updated = { ...current, [property]: value };
    this.selectedShape.set(updated);

    this.shapes.update(shapes => shapes.map(s => (s.id === updated.id ? updated : s)));

    // This was necessary to avoid infinite loop
    this.shapeUpdated$.next();
  }

  closeConfigPanel() {
    this.showConfigPanel.set(false);
    this.selectedShape.set(null);
    this.shapes.update(shapes => shapes.map(shape => ({ ...shape, isSelected: false })));
  }
}
