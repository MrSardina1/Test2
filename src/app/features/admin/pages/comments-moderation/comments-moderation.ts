import { Component } from '@angular/core';

@Component({
  selector: 'app-comments-moderation',
  templateUrl: './comments-moderation.html',
  styleUrls: ['./comments-moderation.css']
})
export class CommentsModerationComponent {
  comments = [
    { text: 'Amazing place!', approved: false },
    { text: 'Needs improvement', approved: false },
    { text: 'Spam message', approved: false }
  ];

  approve(comment: any) {
    comment.approved = true;
  }

  remove(i: number) {
    this.comments.splice(i, 1);
  }
}
