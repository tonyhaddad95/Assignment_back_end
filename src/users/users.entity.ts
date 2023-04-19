import { Comment } from 'src/comment/comment.entity';
import { Post } from 'src/post/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  static find(arg0: { relations: string[]; }): User[] | PromiseLike<User[]> {
    throw new Error('Method not implemented.');
  }
  static findOne(userId: number) {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  idusers: number;

  @Column()
  name: string;

  @Column()
  email: string;
  
  @Column()
  password: string;
  
  @Column()
  role: string;
  
  @Column()
  login_disabled: boolean;  
  
  @Column()
  is_verified: boolean;
  
  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];
}