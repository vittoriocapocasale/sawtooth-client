import { TestBed, inject } from '@angular/core/testing';

import { IntkeyService } from './intkey.service';

describe('IntkeyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntkeyService]
    });
  });

  it('should be created', inject([IntkeyService], (service: IntkeyService) => {
    expect(service).toBeTruthy();
  }));
});
