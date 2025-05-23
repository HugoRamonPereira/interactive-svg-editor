import { Injectable } from '@angular/core';
import { CanvasStoreService } from '../canvas-store/canvas-store.service';
import { DrawingService } from '../drawing/drawing.service';
import { IdGeneratorService } from '../../id-generator/id-generator.service';
import { CanvasShape } from '../../../../components/canvas/canvas.component';

@Injectable({
  providedIn: 'root',
})
export class MouseEventsService {
  constructor(
    private store: CanvasStoreService,
    private drawingService: DrawingService,
    private idGenerator: IdGeneratorService,
  ) {}

  handleMouseDown(event: MouseEvent) {
    const canvas = this.store.canvasElement()?.nativeElement;
    if (!canvas || !this.store.ctx()) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.store.activeToolSignal() === 'move') {
      const shape = this.store.findShapeAtPosition(x, y);
      if (shape) {
        this.store.selectedShapeId.set(shape.id);
        this.store.isDragging.set(true);
        this.store.dragOffset.set({
          x: x - shape.x1,
          y: y - shape.y1,
        });
        this.store.shapes.update(shapes => shapes.map(s => ({ ...s, isSelected: s.id === shape.id })));
        return;
      }
    }

    this.store.startX.set(x);
    this.store.startY.set(y);
    this.store.isDrawingNow.set(true);

    // Click on the shape you wish to make changes in order to see edit modal
    if (this.store.activeToolSignal() === 'configure') {
      const shape = this.store.findShapeAtPosition(x, y);
      if (shape) {
        this.store.selectedShape.set(shape);
        this.store.updateConfigPanelPosition(shape);
        this.store.showConfigPanel.set(true);
        this.store.configType.set(shape.type);
        this.store.shapes.update(shapes => shapes.map(s => ({ ...s, isSelected: false })));
      }
    }
  }

  handleMouseMove(event: MouseEvent) {
    const canvas = this.store.canvasElement()?.nativeElement;
    if (!canvas || !this.store.ctx()) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    // Code that allows dragging and movement of the shape into a new position
    if (this.store.isDragging()) {
      const shapeId = this.store.selectedShapeId();
      if (shapeId) {
        this.store.shapes.update(shapes =>
          shapes.map(shape => {
            if (shape.id === shapeId) {
              const width = shape.x2 - shape.x1;
              const height = shape.y2 - shape.y1;
              const newX1 = currentX - this.store.dragOffset().x;
              const newY1 = currentY - this.store.dragOffset().y;
              return {
                ...shape,
                x1: newX1,
                y1: newY1,
                x2: newX1 + width,
                y2: newY1 + height,
              };
            }
            return shape;
          }),
        );
        this.drawingService.redrawCanvas();
      }
      return;
    }

    if (!this.store.isDrawingNow()) return;

    this.drawingService.redrawCanvas();

    const ctx = this.store.ctx()!;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    if (this.store.activeToolSignal() === 'rectangle') {
      ctx.strokeRect(
        this.store.startX(),
        this.store.startY(),
        currentX - this.store.startX(),
        currentY - this.store.startY(),
      );
    } else if (this.store.activeToolSignal() === 'star') {
      const centerX = (this.store.startX() + currentX) / 2;
      const centerY = (this.store.startY() + currentY) / 2;
      const radius =
        Math.min(Math.abs(currentX - this.store.startX()), Math.abs(currentY - this.store.startY())) / 2;
      this.drawingService.drawStar(ctx, centerX, centerY, radius);
    }
  }

  // Method to store new changes made to the shapes, when you let go of the mouse
  handleMouseUp(event: MouseEvent) {
    if (this.store.isDragging()) {
      this.store.isDragging.set(false);
      this.store.shapes.update(shapes => shapes.map(s => ({ ...s, isSelected: false })));
      this.store.selectedShapeId.set(null);
      this.drawingService.redrawCanvas();
      return;
    }

    if (!this.store.isDrawingNow() || !this.store.canvasElement()) return;

    const canvas = this.store.canvasElement()!.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    if (
      Math.abs(currentX - this.store.startX()) > 5 ||
      Math.abs(currentY - this.store.startY()) > 5
    ) {
      const newShape: CanvasShape = {
        type: this.store.activeToolSignal() as 'rectangle' | 'star',
        x1: this.store.startX(),
        y1: this.store.startY(),
        x2: currentX,
        y2: currentY,
        id: this.idGenerator.generateId(),
        isSelected: false,
      };

      if (newShape.type === 'rectangle') {
        newShape.borderRadius = 0;
      } else if (newShape.type === 'star') {
        newShape.points = 5;
      }

      this.store.shapes.update(shapes => [...shapes, newShape]);
    }

    this.store.isDrawingNow.set(false);
    this.drawingService.redrawCanvas();
  }
}
