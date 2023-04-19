import { Controller, Post, Body, Get, Query, Delete, Param, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { Post as PostEntity } from './post.entity';
import { PaginatedPosts, PostService } from './post.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('posts')
export class PostController {
  postRepository: any;
  constructor(private readonly postService: PostService) { }

  @Post()
  async createPost(@Body() postData: Partial<PostEntity>) {
    const post = await this.postService.createPost(postData);
    return post;
  }

  @Get()
  async getAllPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 1
  ): Promise<PaginatedPosts> {
    const paginatedPosts = await this.postService.getAllPosts(page, limit);
    return paginatedPosts;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePost(@Param('id') id: number, @Request() req): Promise<void> {
    const post = await this.postService.getPostById(id);
    if (!post) {
      // handle not found error
      throw new ForbiddenException('Post doesn`t exist');
    } else if (post.userId !== req.user.sub) {
      // handle if user is deleting someone else's post
      throw new ForbiddenException('You are not authorized to delete this post');
    } else {
      await this.postService.deletePost(id);
    }
  }

  @Get('count')
  async getCount(): Promise<{ count: number }> {
    const count = await this.postService.getCount();
    return { count };
  }

  @Get('all')
  async getAllPostsWithComments(): Promise<PostEntity[]> {
    return this.postService.getAllPostsWithComments();
  }
}