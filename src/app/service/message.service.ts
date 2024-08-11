import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IMessage } from "../model/Message.interface";
import { HttpClient } from "@angular/common/http";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private stompClient: any
  private messageSubject: BehaviorSubject<IMessage[]> = new BehaviorSubject<IMessage[]>([]);
  constructor(private httpClient: HttpClient) {
    this.initConnenctionSocket();
  }
  initConnenctionSocket() {
    const url = '//localhost:8080/ws';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket)
  }

  subscribeMessages() {
    this.stompClient.connect({}, ()=>{
      this.stompClient.subscribe(`/topic/messages`, (messages: any) => {
        console.log(messages);
        const messageContent = JSON.parse(messages.body);
        const currentMessage = this.messageSubject.getValue();
        currentMessage.push(messageContent);
        this.messageSubject.next(currentMessage);
      });
    });
  }
  sendMessage(chatMessage: IMessage) {
    this.stompClient.send(`/app/messages`, {}, JSON.stringify(chatMessage))
  }
  getMessageSubject(){
    return this.messageSubject.asObservable();
  }
}