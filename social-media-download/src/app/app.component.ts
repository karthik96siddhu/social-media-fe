import { Component, OnInit } from '@angular/core';
import { DownloadService } from './service/download.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  url: string = '';
  progress: number = 0;
  youtubeURL = ''

  constructor(private downloadService: DownloadService) { }

  downloadVideo() {
    this.downloadService.downloadVideo(this.url).subscribe({
      next: (event: any) => {
        if (typeof event === 'object' && 'progress' in event) {
          this.progress = event.progress;
        } else if (event instanceof Blob) {
          const now = new Date();
          const pad = (num:any) => String(num).padStart(2, '0');
          const fileName = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
          this.downloadService.saveVideo(event, `${fileName}.mp4`)
          alert('Video downloaded successfully')
        }
        
      },
      error: (error: any) => {
        console.log(error);
        // alert('Dowload failed')
      }
    })
  }

  downloadYtmp3() {
    this.downloadService.convertYoutubeTomp3(this.youtubeURL).subscribe({
      next: (blob: Blob) => {
        this.downloadService.saveVideo(blob, 'youtube_audio.mp3')
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

}
