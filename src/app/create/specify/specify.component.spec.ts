import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecifyComponent } from './specify.component';

describe('SpecifyComponent', () => {
  let component: SpecifyComponent;
  let fixture: ComponentFixture<SpecifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
