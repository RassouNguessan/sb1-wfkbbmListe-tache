import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal, ModalType } from '../../interfaces/modal.interface';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal" *ngIf="show">
      <div class="modal-content">
        <h2>
          {{ 
            type === 'edit' ? 'Modifier la tâche' :
            type === 'bulk' ? 'Actions groupées' :
            'Confirmation'
          }}
        </h2>

        <div *ngIf="type === 'edit' && task">
          <div class="form-group">
            <label for="editTitle">Titre:</label>
            <input 
              type="text" 
              id="editTitle" 
              [(ngModel)]="task.title" 
              class="form-control"
              required
            >
          </div>
          <div class="form-group">
            <label for="editDescription">Description:</label>
            <textarea 
              id="editDescription" 
              [(ngModel)]="task.description" 
              class="form-control"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div *ngIf="type === 'disable' || type === 'delete'">
          <p *ngIf="type === 'disable'">
            Voulez-vous {{ task?.disabled ? 'activer' : 'désactiver' }} la tâche "{{ task?.title }}" ?
          </p>
          <p *ngIf="type === 'delete'">
            Voulez-vous supprimer la tâche "{{ task?.title }}" ?
          </p>
          <p class="task-details">{{ task?.description }}</p>
        </div>

        <div *ngIf="type === 'bulk'">
          <p>Sélectionnez l'action à appliquer sur {{ selectedCount }} tâche(s) :</p>
          <div class="bulk-modal-actions">
            <button 
              (click)="onBulkDisable()"
              class="btn btn-warning"
            >
              Désactiver
            </button>
            <button 
              (click)="onBulkDelete()"
              class="btn btn-danger"
            >
              Supprimer
            </button>
          </div>
        </div>

        <div class="modal-buttons">
          <button 
            *ngIf="type !== 'bulk'"
            (click)="onConfirm()" 
            class="btn btn-primary"
          >
            {{ type === 'edit' ? 'Enregistrer' : 'Oui' }}
          </button>
          <button 
            (click)="onClose()" 
            class="btn btn-secondary"
          >
            {{ type === 'edit' ? 'Annuler' : 'Non' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
    }
    .modal-buttons {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary { background-color: #007bff; color: white; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-warning { background-color: #ffc107; color: black; }
    .btn-danger { background-color: #dc3545; color: white; }
  `]
})
export class ModalComponent {
  @Input() show = false;
  @Input() type: ModalType = 'disable';
  @Input() task: Task | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(private taskService: TaskService) {}

  get selectedCount(): number {
    return this.taskService.getSelectedCount();
  }

  onConfirm(): void {
    if (this.task) {
      switch (this.type) {
        case 'disable':
          this.taskService.toggleTask(this.task);
          break;
        case 'delete':
          this.taskService.deleteTask(this.task);
          break;
        case 'edit':
          this.taskService.updateTask(this.task);
          break;
      }
    }
    this.onClose();
  }

  onBulkDisable(): void {
    this.taskService.bulkDisable();
    this.onClose();
  }

  onBulkDelete(): void {
    this.taskService.bulkDelete();
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }
}