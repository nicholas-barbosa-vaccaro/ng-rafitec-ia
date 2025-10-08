import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SseClient } from 'ngx-sse-client';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  constructor(private httpClient: HttpClient, private sseClient: SseClient) { }

  sendQuery(query: string) {
    return this.sseClient.stream('http://localhost:8080/assistant/stream', { keepAlive: true, reconnectionDelay: 1_000, responseType: 'event' }, { params: { prompt: query } }, 'GET')
  //  return this.httpClient.get<AiResponse>('http://localhost:8080/assistant', { params: { prompt: query }, })
  }
}
