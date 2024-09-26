import { Component, OnInit } from '@angular/core';
import { Task, TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filter: 'all' | 'completed' | 'pending' = 'all';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilter();
    });
  }

  toggleTaskCompletion(id: number): void {
    this.taskService.toggleTaskCompletion(id);
    this.applyFilter();
  }

  setFilter(filter: 'all' | 'completed' | 'pending'): void {
    this.filter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.filter === 'completed') {
      this.filteredTasks = this.tasks.filter(task => task.completed);
    } else if (this.filter === 'pending') {
      this.filteredTasks = this.tasks.filter(task => !task.completed);
    } else {
      this.filteredTasks = this.tasks; // Todas
    }
  }
}
