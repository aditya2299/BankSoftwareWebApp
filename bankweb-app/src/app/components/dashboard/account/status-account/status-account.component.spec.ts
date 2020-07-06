import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusAccountComponent } from './status-account.component';

describe('StatusAccountComponent', () => {
  let component: StatusAccountComponent;
  let fixture: ComponentFixture<StatusAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
