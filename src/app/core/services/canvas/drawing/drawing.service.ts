import { Injectable } from '@angular/core';
import { CanvasStoreService } from '../canvas-store/canvas-store.service';

@Injectable({ providedIn: 'root' })
export class DrawingService {
  constructor(private store: CanvasStoreService) {}

  drawRectangle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.stroke();
  }

  drawStar(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    points: number = 5,
  ) {
    ctx.beginPath();
    const outerRadius = radius;
    const innerRadius = radius * 0.4;

    for (let i = 0; i < points; i++) {
      const outerAngle = (i * 2 * Math.PI) / points - Math.PI / 2;
      const outerX = centerX + outerRadius * Math.cos(outerAngle);
      const outerY = centerY + outerRadius * Math.sin(outerAngle);

      if (i === 0) {
        ctx.moveTo(outerX, outerY);
      } else {
        ctx.lineTo(outerX, outerY);
      }

      const innerAngle = outerAngle + Math.PI / points;
      const innerX = centerX + innerRadius * Math.cos(innerAngle);
      const innerY = centerY + innerRadius * Math.sin(innerAngle);
      ctx.lineTo(innerX, innerY);
    }

    ctx.closePath();
    ctx.stroke();
  }

  redrawCanvas() {
    const ctx = this.store.ctx();
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.store.shapes().forEach(shape => {
      if (shape.isSelected) {
        ctx.strokeStyle = '#4285F4';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 3]);
      } else {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
      }

      if (shape.type === 'rectangle') {
        const x = shape.x1;
        const y = shape.y1;
        const width = shape.x2 - shape.x1;
        const height = shape.y2 - shape.y1;
        const radius = shape.borderRadius || 0;
        this.drawRectangle(ctx, x, y, width, height, radius);
      } else if (shape.type === 'star') {
        const centerX = (shape.x1 + shape.x2) / 2;
        const centerY = (shape.y1 + shape.y2) / 2;
        const radius = Math.min(Math.abs(shape.x2 - shape.x1), Math.abs(shape.y2 - shape.y1)) / 2;
        this.drawStar(ctx, centerX, centerY, radius, shape.points || 5);
      }
    });
  }
}
