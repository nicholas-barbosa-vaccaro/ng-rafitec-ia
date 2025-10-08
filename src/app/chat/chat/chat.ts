import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../service/ai-service';
import { InputTextModule } from 'primeng/inputtext';
import { MarkdownComponent, MarkdownService } from "ngx-markdown";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-chat',
  imports: [FormsModule, InputTextModule, MarkdownComponent,ProgressSpinnerModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {
  query = signal("")
  markdown = signal("")
  processing = signal(false)
  constructor(private aiSerivce: AiService, private markdownService: MarkdownService) { }

  sendQuery(): void {
    if (!this.processing()) {
      this.processing.set(true)
      this.markdown.set("")
      let eventSource = new EventSource(`http://localhost:8080/assistant/stream?prompt=${this.query()}`)
      eventSource.onmessage = (event) => {
        let text = JSON.parse(event.data).text
        this.markdown.update(v => v + text)
      }
      eventSource.addEventListener("onComplete", event => {
        this.processing.set(false)
        this.query.set("")
        eventSource.close()
      })
      eventSource.onerror = (event) => {
        this.processing.set(false)
        console.log(event)
      }
      eventSource.onopen = (event) => {
        console.log('open ' + event)
      }
    }
  }
}