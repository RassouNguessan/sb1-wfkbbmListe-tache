import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe(
      tasks => this.tasksSubject.next(tasks.map(task => ({ ...task, selected: false })))
    );
  }

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  addTask(title: string, description: string): void {
    const task = {
      title,
      description,
      disabled: false
    };

    this.http.post<Task>(this.apiUrl, task).subscribe(
      newTask => {
        const tasks = [...this.tasksSubject.value, { ...newTask, selected: false }];
        this.tasksSubject.next(tasks);
      }
    );
  }

  updateTask(task: Task): void {
    this.http.put<Task>(`${this.apiUrl}/${task.id}`, task).subscribe(
      updatedTask => {
        const tasks = this.tasksSubject.value.map(t => 
          t.id === updatedTask.id ? { ...updatedTask, selected: false } : t
        );
        this.tasksSubject.next(tasks);
      }
    );
  }

  deleteTask(task: Task): void {
    this.http.delete(`${this.apiUrl}/${task.id}`).subscribe(
      () => {
        const tasks = this.tasksSubject.value.filter(t => t.id !== task.id);
        this.tasksSubject.next(tasks);
      }
    );
  }

  toggleTask(task: Task): void {
    this.http.patch<Task>(`${this.apiUrl}/${task.id}/toggle`, {}).subscribe(
      updatedTask => {
        const tasks = this.tasksSubject.value.map(t => 
          t.id === updatedTask.id ? { ...updatedTask, selected: false } : t
        );
        this.tasksSubject.next(tasks);
      }
    );
  }

  bulkDisable(): void {
    const selectedTasks = this.tasksSubject.value.filter(task => task.selected);
    const selectedIds = selectedTasks.map(task => task.id);
    
    if (selectedIds.length > 0) {
      this.http.patch(`${this.apiUrl}/bulk-disable`, selectedIds).subscribe(
        () => {
          const tasks = this.tasksSubject.value.map(task => 
            task.selected ? { ...task, disabled: true, selected: false } : task
          );
          this.tasksSubject.next(tasks);
        }
      );
    }
  }

  bulkDelete(): void {
    const selectedIds = this.tasksSubject.value.filter(task => task.selected).map(task => task.id);
    
    if (selectedIds.length > 0) {
      this.http.delete(`${this.apiUrl}/bulk`, { body: selectedIds }).subscribe(
        () => {
          const tasks = this.tasksSubject.value.filter(task => !task.selected);
          this.tasksSubject.next(tasks);
        }
      );
    }
  }

  getSelectedCount(): number {
    return this.tasksSubject.value.filter(task => task.selected).length;
  }

  hasSelectedTasks(): boolean {
    return this.tasksSubject.value.some(task => task.selected);
  }
}