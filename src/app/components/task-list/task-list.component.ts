import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task, TaskService } from 'src/app/services/task.service';
import { TaskCreationComponent } from '../task-creation/task-creation.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filter: 'all' | 'completed' | 'pending' = 'all';
  currentDate: string = '';

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.applyFilter();
    });
    this.currentDate = this.getCurrentDate();
  }

  toggleTaskCompletion(event: MouseEvent, id: number): void {
    event.stopPropagation();
    this.taskService.toggleTaskCompletion(id);
    this.applyFilter();
  }

  setFilter(filter: 'all' | 'completed' | 'pending'): void {
    this.filter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.filter === 'completed') {
      this.filteredTasks = this.tasks.filter((task) => task.completed);
    } else if (this.filter === 'pending') {
      this.filteredTasks = this.tasks.filter((task) => !task.completed);
    } else {
      this.filteredTasks = this.tasks;
    }
  }

  getCurrentDate(): string {
    let currentDate = new Date();
    return currentDate
      .toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      .replace(/,/g, '');
  }

  deleteTask(event: MouseEvent, taskId: number | undefined): void {
    event.stopPropagation();
    if (taskId !== undefined) {
      this.taskService.deleteTask(taskId);
    } else {
      console.error('Task ID is undefined');
    }
  }

  openTaskCreationModal() {
    const dialogRef = this.dialog.open(TaskCreationComponent, {
      width: '800px',
      height: '500px',
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.taskService.getTasks().subscribe((tasks) => {
        this.tasks = tasks;
        this.applyFilter();
      });
    });
  }

  openTaskUpdateModal(event: MouseEvent, task: Task) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(TaskCreationComponent, {
      width: '800px',
      height: '500px',
      panelClass: 'custom-dialog',
      data: task,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.taskService.getTasks().subscribe((tasks) => {
        this.tasks = tasks;
        this.applyFilter();
      });
    });
  }
}
