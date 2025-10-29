import { Routes } from '@angular/router';
import { Chat } from './chat/chat/chat';

export const routes: Routes = [
    {
        path: '',
        component: Chat,
        title: 'IA Chat - Rafitec'
    },
    {
        path: ':negocio',
        component: Chat,
        title: 'IA Chat - Rafitec'
    }
];
