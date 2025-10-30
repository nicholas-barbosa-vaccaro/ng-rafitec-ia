import { Component, ElementRef, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../service/ai-service';
import { InputTextModule } from 'primeng/inputtext';
import { MarkdownComponent, MarkdownService } from "ngx-markdown";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-chat',
  imports: [FormsModule, InputTextModule, MarkdownComponent, ProgressSpinnerModule, CommonModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {
  query = signal("")
  markdown = signal("")
  processing = signal(false)
  negocio: string | null = null;
  conversationId = '';
  messages: WritableSignal<ChatMessage[]> = signal([])
  @ViewChild('markdownContainer') markdownContainer!: ElementRef<HTMLElement>;

  constructor(private aiSerivce: AiService, private viewportScroller: ViewportScroller, private route: ActivatedRoute) { }

  ngOnInit() {
    this.negocio = this.route.snapshot.paramMap.get('negocio');
    this.aiSerivce.getConversationId().subscribe(r => {
      this.conversationId = r.id
    })
  }

  sendQuery(): void {
    if (!this.processing()) {
      this.messages.update(arr => [...arr, {
        content: this.query(),
        type: "user"
      }])
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
        this.messages.update(arr => [...arr, {
          content: this.markdown(),
          type: "assistant"
        }])
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