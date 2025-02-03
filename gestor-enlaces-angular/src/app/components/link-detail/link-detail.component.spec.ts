import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkDetailComponent } from './link-detail.component';

describe('LinkDetailComponent', () => {
  let component: LinkDetailComponent;
  let fixture: ComponentFixture<LinkDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
