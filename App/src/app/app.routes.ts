import { Routes } from '@angular/router';
import { WatermarkComponent } from './watermark/watermark';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
    {
        path: '',
        component: WatermarkComponent,
        title: 'Watermarker'
    },
    {
        path: 'toolbox/watermarker',
        component: WatermarkComponent,
        title: 'Watermarker'
    },
    {
        path: '**',
        component: NotFound,
    }
];
