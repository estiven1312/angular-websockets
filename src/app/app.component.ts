import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './service/message.service';
import { IMessage } from './model/Message.interface';
import { FormControl, FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  messageInput: string = '';
  userId: string="";
  messageList: any[] = [];
  ngOnInit(): void {
    this.chatService.subscribeMessages();
    this.listenerMessage();
  }
  constructor(private chatService: MessageService) {
  }
  title = 'angular-websockets';
  sendMessage() {
    const chatMessage = {
      text: this.messageInput,
      from: this.userId
    } as IMessage
    this.chatService.sendMessage(chatMessage);
    this.messageInput = '';
  }

  listenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {
      console.log(messages);
      this.messageList = messages.map((item: any)=> ({
        ...item,
        message_side: item.user === this.userId ? 'sender': 'receiver'
      }))
    });
  }
}
