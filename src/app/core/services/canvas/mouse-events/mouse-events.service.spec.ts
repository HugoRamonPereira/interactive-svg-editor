import { TestBed } from '@angular/core/testing';

import { MouseEventsService } from './mouse-events.service';

describe('MouseEventsService', () => {
  let service: MouseEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouseEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
