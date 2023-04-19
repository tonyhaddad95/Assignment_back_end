import { Comment } from 'src/comment/comment.entity';
import { User } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  isPublic: boolean;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.posts, { cascade: true })
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => Comment, comment => comment.post, { cascade: true })
  comments: Comment[];
  

  async save(): Promise<this> {
    return super.save() as Promise<this>;
  }
  
}
