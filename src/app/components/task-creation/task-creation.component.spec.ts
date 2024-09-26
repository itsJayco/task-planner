import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCreationComponent } from './task-creation.component';

describe('TaskCreationComponent', () => {
  let component: TaskCreationComponent;
  let fixture: ComponentFixture<TaskCreationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskCreationComponent]
    });
    fixture = TestBed.createComponent(TaskCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
