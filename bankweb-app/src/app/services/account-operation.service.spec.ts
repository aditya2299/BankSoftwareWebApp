/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccountOperationService } from './account-operation.service';

describe('Service: AccountOperation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountOperationService]
    });
  });

  it('should ...', inject([AccountOperationService], (service: AccountOperationService) => {
    expect(service).toBeTruthy();
  }));
});
