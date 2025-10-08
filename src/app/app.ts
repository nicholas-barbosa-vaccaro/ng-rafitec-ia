import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Chat } from "./chat/chat/chat";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, Chat],
  templateUrl: './app.html',
  styleUrl: './app.css',
  
})
export class App {
  protected title = 'rafitec-comercial-ai';
}
