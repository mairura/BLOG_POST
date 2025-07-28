import { UserEntity } from '../user/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  slug: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column({ default: '' })
  title: string;

  @Column('simple-array')
  tagList: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: 0 })
  favoritedCount: number;

  @Column()
  authorId: number;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @BeforeUpdate()
  updateTimestamps() {
    this.updatedAt = new Date();
  }
}
