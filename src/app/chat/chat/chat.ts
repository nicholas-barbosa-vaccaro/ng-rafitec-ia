import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../service/ai-service';
import { InputTextModule } from 'primeng/inputtext';
import { MarkdownComponent, MarkdownService } from "ngx-markdown";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-chat',
  imports: [FormsModule, InputTextModule, MarkdownComponent, ProgressSpinnerModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {
  query = signal("")
  markdown = signal("")
  processing = signal(false)
  negocio: string | null=null;
  conversationId = '';
  constructor(private aiSerivce: AiService, private markdownService: MarkdownService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.negocio = this.route.snapshot.paramMap.get('negocio');
    this.aiSerivce.getConversationId().subscribe(r=>{
      this.conversationId = r.id
    })
  }

  sendQuery(): void {
    if (!this.processing()) {
      this.processing.set(true)
      this.markdown.set("")
      let eventSource = new EventSource(`https://abfassistant.app-vaccaro.com/assistant/stream/${this.negocio}?prompt=${this.query()}&conversationId=${this.conversationId}`)
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