import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaces para representar habilidades, personas y tareas
export interface Skill {
  name: string;
}

export interface Person {
  fullName: string;
  age: number;
  skills: Skill[];
}

export interface Task {
  id: number;
  name: string;
  deadline: Date;
  completed: boolean;
  persons: Person[];
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(
    []
  );

  constructor() {}

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Omit<Task, 'id' | 'completed'>): void {
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      completed: false,
    };
    this.tasks.push(newTask);
    this.tasksSubject.next([...this.tasks]);
  }

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.tasksSubject.next([...this.tasks]);
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.tasksSubject.next([...this.tasks]);
  }

  toggleTaskCompletion(id: number): void {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.tasksSubject.next([...this.tasks]);
    }
  }
  private generateId(): number {
    return this.tasks.length > 0
      ? Math.max(...this.tasks.map((t) => t.id)) + 1
      : 1;
  }
}
