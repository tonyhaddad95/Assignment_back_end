import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment(userId: number, postId: number, comment: string): Promise<Comment> {
    const newComment = new Comment();
    newComment.userId = userId;
    newComment.postId = postId;
    newComment.comment = comment;
   
    const newCommentSave = await newComment.save();
    return newCommentSave;
  }

  async deleteComment(commentId: any): Promise<void> {
    await this.commentRepository.delete(commentId);
  }

  async getCount(): Promise<number> {
    return this.commentRepository.count();
  }

  async getCommentById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id }});
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }
}
