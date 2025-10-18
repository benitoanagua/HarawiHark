// panorama.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PanoramaSection {
  id: string;
  title: string;
}

@Component({
  selector: 'app-panorama',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.css'],
})
export class PanoramaComponent {
  @Input() sections: PanoramaSection[] = [];
}
