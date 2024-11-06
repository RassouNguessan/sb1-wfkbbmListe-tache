import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="task-form">
      <h2>Nouvelle Tâche</h2>
      <div class="form-group">
        <label for="title">Titre:</label>
        <input 
          type="text" 
          id="title" 
          [(ngModel)]="title" 
          class="form-control"
          required
        >
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea 
          id="description" 
          [(ngModel)]="description" 
          class="form-control"
          rows="3"
        ></textarea>
      </div>
      <button (click)="addTask()" class="btn btn-primary">
        Ajouter la tâche
      </button>
    </div>
  `,
  styles: [`
    .task-form {
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class TaskFormComponent {
  title = '';
  description = '';

  constructor(private taskService: TaskService) {}

  addTask(): void {
    if (this.title.trim()) {
      this.taskService.addTask(this.title, this.description);
      this.title = '';
      this.description = '';
    }
  }
}