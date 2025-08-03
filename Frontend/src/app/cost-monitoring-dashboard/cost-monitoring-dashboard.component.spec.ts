import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostMonitoringDashboardComponent } from './cost-monitoring-dashboard.component';

describe('CostMonitoringDashboardComponent', () => {
  let component: CostMonitoringDashboardComponent;
  let fixture: ComponentFixture<CostMonitoringDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostMonitoringDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostMonitoringDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
