import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/comment/comment.entity';


export interface PaginatedPosts {
    page: number;
    limit: number;
    totalCount: number;
    data: any;
    totalPages: number;
  }

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(postData: Partial<Post>) {
    const post = new Post();
    post.title = postData.title;
    post.description = postData.description;
    post.isPublic = postData.isPublic ?? true;
    post.userId = postData.userId; // Replace with authenticated user ID

    // Save the new post to the database
    const savedPost = await post.save();
    return savedPost; // add this line
  }

  async getAllPosts(page: number = 1, limit: number = 4): Promise<PaginatedPosts> {
    const [posts, totalCount] = await Post.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['user', 'comments', 'comments.user'],
    });
  
    const data = await Promise.all(posts.map(async (post) => {
      const [comments, commentCount] = await Comment.findAndCount({
        where: { postId: post.id },
        take: 200,
        skip: 0,
        relations: ['user'],
      });
  
      const commentData = comments.map(comment => ({
        id: comment.id,
        text: comment.comment,
        userId: comment.userId,
        userName: comment.user.name,
      }));
  
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        isPublic: post.isPublic,
        userId: post.userId,
        userName: post.user.name,
        comments: {
          data: commentData,
          totalCount: commentCount,
          page,
          totalPages: Math.ceil(commentCount / 200),
        },
      };
    }));
  
    const totalPages = Math.ceil(totalCount / limit);
  
    return {
      page,
      limit,
      totalCount,
      data: data,
      totalPages,
    };
  }    
  
  async deletePost(postId: any): Promise<void> {
    await this.postRepository.delete(postId);
  }

  async getCount(): Promise<number> {
    return this.postRepository.count();
  }

  async getAllPostsWithComments(): Promise<Post[]> {
    return await Post.find({ relations: ['comments'] });
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id }});
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }
  
}
