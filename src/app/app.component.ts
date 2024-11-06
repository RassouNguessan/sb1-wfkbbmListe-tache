import { Component } from '@angular/core';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { ModalComponent } from './components/modal/modal.component';
import { Modal } from './interfaces/modal.interface';
import { ShowModalEvent } from './interfaces/modal-event.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskFormComponent, TaskListComponent, ModalComponent],
  template: `
    <div class="container">
      <h1>Gestionnaire de Tâches</h1>
      <app-task-form></app-task-form>
      <app-task-list
        (showModal)="openModal($event)"
      ></app-task-list>
      <app-modal
        [show]="modal.show"
        [type]="modal.type"
        [task]="modal.task"
        (close)="closeModal()"
      ></app-modal>
    </div>
  `,
})
export class AppComponent {
  modal: Modal = {
    show: false,
    type: 'disable',
    task: null
  };

  openModal(event: ShowModalEvent): void {
    this.modal = {
      show: true,
      type: event.type,
      task: event.task ? {...event.task} : null
    };
  }

  closeModal(): void {
    this.modal = {
      show: false,
      type: 'disable',
      task: null
    };
  }
}