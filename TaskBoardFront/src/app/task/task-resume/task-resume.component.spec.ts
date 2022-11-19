import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskResumeComponent } from './task-resume.component';

describe('TaskResumeComponent', () => {
  let component: TaskResumeComponent;
  let fixture: ComponentFixture<TaskResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskResumeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
