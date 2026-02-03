import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  imports: [],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss',
})
export class SkeletonLoaderComponent {
  @Input() skeletonCount: number = 4;
  get skeletonItems(): number[] {
    return Array.from({ length: this.skeletonCount });
  }
}
