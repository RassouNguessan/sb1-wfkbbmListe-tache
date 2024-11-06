import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task.interface';
import { ShowModalEvent } from '../../interfaces/modal-event.interface';
import { ModalType } from '../../interfaces/modal.interface';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bulk-actions" *ngIf="hasSelectedTasks()">
      <button 
        (click)="onBulkAction()"
        class="btn btn-warning"
      >
        Actions sur {{ getSelectedCount() }} tâche(s)
      </button>
    </div>

    <div class="task-list">
      <h2>Liste des Tâches</h2>
      <div 
        *ngFor="let task of tasks" 
        class="task-item"
        [class.disabled]="task.disabled"
      >
        <div class="task-header">
          <input 
            type="checkbox" 
            [(ngModel)]="task.selected"
            class="task-checkbox"
          >
          <h3>{{task.title}}</h3>
        </div>
        <p>{{task.description}}</p>
        <div class="task-actions">
          <button 
            (click)="onEdit(task)"
            class="btn btn-info"
          >
            Modifier
          </button>
          <button 
            (click)="onToggle(task)" 
            class="btn"
            [class.btn-primary]="task.disabled"
            [class.btn-danger]="!task.disabled"
          >
            {{task.disabled ? 'Activer' : 'Désactiver'}}
          </button>
          <button 
            (click)="onDelete(task)" 
            class="btn btn-danger"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-list {
      margin-top: 20px;
    }
    .task-item {
      padding: 15px;
      border: 1px solid #ddd;
      margin-bottom: 10px;
      border-radius: 4px;
    }
    .task-item.disabled {
      opacity: 0.6;
      background-color: #f8f9fa;
    }
    .task-actions {
      margin-top: 10px;
      display: flex;
      gap: 8px;
    }
    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-info { background-color: #17a2b8; color: white; }
    .btn-primary { background-color: #007bff; color: white; }
    .btn-danger { background-color: #dc3545; color: white; }
    .btn-warning { background-color: #ffc107; color: black; }
  `]
})
export class TaskListComponent {
  @Output() showModal = new EventEmitter<ShowModalEvent>();

  constructor(private taskService: TaskService) {}

  get tasks(): Task[] {
    return this.taskService.getTasks();
  }

  hasSelectedTasks(): boolean {
    return this.taskService.hasSelectedTasks();
  }

  getSelectedCount(): number {
    return this.taskService.getSelectedCount();
  }

  onEdit(task: Task): void {
    this.showModal.emit({ type: 'edit', task });
  }

  onToggle(task: Task): void {
    this.showModal.emit({ type: 'disable', task });
  }

  onDelete(task: Task): void {
    this.showModal.emit({ type: 'delete', task });
  }

  onBulkAction(): void {
    this.showModal.emit({ type: 'bulk', task: null });
  }
}