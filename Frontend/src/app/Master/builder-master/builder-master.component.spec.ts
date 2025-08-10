import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderMasterComponent } from './builder-master.component';

describe('BuilderMasterComponent', () => {
  let component: BuilderMasterComponent;
  let fixture: ComponentFixture<BuilderMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuilderMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
