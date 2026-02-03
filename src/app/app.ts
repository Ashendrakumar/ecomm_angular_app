import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { Navbar } from './shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinnerComponent, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App { }
