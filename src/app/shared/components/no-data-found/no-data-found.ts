import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-data-found',
  imports: [RouterLink, CommonModule],
  templateUrl: './no-data-found.html',
  styleUrl: './no-data-found.scss',
})
export class NoDataFound {
  @Input() title: string = 'info-circle';
  @Input() message: string = 'No data found';
  @Input() actionName: string = 'Browse Products';
  @Input() isHandleClick: boolean = false;
  @Output() actionEvent: EventEmitter<void> = new EventEmitter<void>();

  onClickAction() {
    this.actionEvent.emit();
  }
}
