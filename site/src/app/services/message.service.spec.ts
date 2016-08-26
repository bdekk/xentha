/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { MessageService } from './message.service';

describe('Service: Message', () => {
  beforeEach(() => {
    addProviders([MessageService]);
  });

  it('should ...',
    inject([MessageService],
      (service: MessageService) => {
        expect(service).toBeTruthy();
      }));
});
