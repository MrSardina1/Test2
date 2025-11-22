import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCrud } from './site-crud';

describe('SiteCrud', () => {
  let component: SiteCrud;
  let fixture: ComponentFixture<SiteCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
