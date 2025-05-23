import { TestBed } from '@angular/core/testing';

import { CanvasStoreService } from './canvas-store.service';

describe('CanvasStoreService', () => {
  let service: CanvasStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
