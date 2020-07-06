/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccountTransferService } from './account-transfer.service';

describe('Service: AccountTransfer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountTransferService]
    });
  });

  it('should ...', inject([AccountTransferService], (service: AccountTransferService) => {
    expect(service).toBeTruthy();
  }));
});
