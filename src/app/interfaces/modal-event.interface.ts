import { Task } from './task.interface';
import { ModalType } from './modal.interface';

export interface ShowModalEvent {
  type: ModalType;
  task: Task | null;
}