/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { ProfileService } from './profile.service';

describe('Service: PrProfile', () => {
  beforeEach(() => {
    addProviders([ProfileService]);
  });

  it('should ...',
    inject([ProfileService],
      (service: ProfileService) => {
        expect(service).toBeTruthy();
      }));
});
