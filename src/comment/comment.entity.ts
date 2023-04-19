import { Post } from 'src/post/post.entity';
import { User } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, BeforeRemove, JoinColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: "userId" })
    user: User;
  
    @Column()
    postId: number;
  
    @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "postId" })
    post: Post;

    async save(): Promise<this> {
        return super.save() as Promise<this>;
    }

    @BeforeRemove()
    async deleteComments() {
      // delete related comments before removing the post
      await Comment.delete({ postId: this.id });
    }
}