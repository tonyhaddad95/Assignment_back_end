import { Body, Controller, Param, Post, Delete, Get, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post()
  async createPost(@Body() commentData: Partial<Comment>) {
    const comment = await this.commentService.createComment(commentData.userId, commentData.postId, commentData.comment);
    return comment;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePost(@Param('id') id: number, @Request() req): Promise<void> {
    const comment = await this.commentService.getCommentById(id);
    if (!comment) {
      // handle not found error
      throw new ForbiddenException('comment doesn`t exist');
    } else if (comment.userId !== req.user.sub) {
      // handle if user is deleting someone else's comment
      throw new ForbiddenException('You are not authorized to delete this comment');
    } else {
      await this.commentService.deleteComment(id);
    }
  }

  @Get('count')
  async getCount(): Promise<{ count: number }> {
    const count = await this.commentService.getCount();
    return { count };
  }
}
