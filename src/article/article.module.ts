import { ArticleController } from '@/article/article.controller';
import { ArticleEntity } from '@/article/article.entity';
import { ArticleService } from '@/article/article.service';
import { UserEntity } from '@/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity])],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [],
})
export class ArticleModule {}
