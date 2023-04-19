import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { AuthModule } from './auth/auth.module';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { Post } from './post/post.entity';
import { Comment } from './comment/comment.entity';
import { PostModule } from './post/post.module';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { CommentModule } from './comment/comment.module';
import * as dotenv from 'dotenv';

dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'mysql',
          host: process.env.HOST,
          port: 3306,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities: [User, Post, Comment],
          synchronize: true,
          bigNumberStrings: false,
          logging: ['error'],
        };
      },
    }),
    UsersModule,
    PostModule,
    CommentModule,
    AuthModule, // make sure you import the UsersModule here
    TypeOrmModule.forFeature([User, Post, Comment]), CommentModule,
  ],
  providers: [PostService, CommentService],
  controllers: [PostController, CommentController],
})
export class AppModule {}
