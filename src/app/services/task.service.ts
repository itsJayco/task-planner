import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

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
  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(
    []
  );

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  private loadTasks(): void {
    this.http
      .get<Task[]>('http://localhost:3000/tasks')
      .pipe(
        tap((tasks) => this.tasksSubject.next(tasks)),
        catchError((error) => {
          console.error('Error loading tasks from API', error);
          return [];
        })
      )
      .subscribe();
  }

  addTask(task: Omit<Task, 'id' | 'completed'>): void {
    const newTask = { ...task, completed: false } as Task;
    this.http
      .post<Task>('http://localhost:3000/tasks', newTask)
      .subscribe((createdTask) => {
        this.tasksSubject.next([...this.tasksSubject.value, createdTask]);
      });
  }

  updateTask(updatedTask: Task): void {
    this.http
      .put<Task>(`http://localhost:3000/tasks/${updatedTask.id}`, updatedTask)
      .subscribe(() => {
        const index = this.tasksSubject.value.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (index !== -1) {
          this.tasksSubject.value[index] = updatedTask;
          this.tasksSubject.next([...this.tasksSubject.value]);
        }
      });
  }

  deleteTask(id: number): void {
    this.http.delete(`http://localhost:3000/tasks/${id}`).subscribe(() => {
      this.tasksSubject.next(
        this.tasksSubject.value.filter((task) => task.id !== id)
      );
    });
  }

  toggleTaskCompletion(id: number): void {
    const task = this.tasksSubject.value.find((t) => t.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      this.updateTask(updatedTask);
    }
  }
}
