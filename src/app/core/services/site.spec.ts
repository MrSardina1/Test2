import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Site } from './site';

describe('Site', () => {
  let service: Site;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Site]
    });
    service = TestBed.inject(Site);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
