import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {
  generateId(prefix= ''): string {
    return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
  }
}
