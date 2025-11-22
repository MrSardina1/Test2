import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsModeration } from './comments-moderation';

describe('CommentsModeration', () => {
  let component: CommentsModeration;
  let fixture: ComponentFixture<CommentsModeration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsModeration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsModeration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
