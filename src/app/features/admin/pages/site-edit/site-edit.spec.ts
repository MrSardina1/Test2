import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEdit } from './site-edit';

describe('SiteEdit', () => {
  let component: SiteEdit;
  let fixture: ComponentFixture<SiteEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
