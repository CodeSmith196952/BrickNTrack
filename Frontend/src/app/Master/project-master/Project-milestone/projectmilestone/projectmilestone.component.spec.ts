import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectmilestoneComponent } from './projectmilestone.component';

describe('ProjectmilestoneComponent', () => {
  let component: ProjectmilestoneComponent;
  let fixture: ComponentFixture<ProjectmilestoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectmilestoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectmilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
