import { ArticleService } from '@/article/article.service';
import { CreateArticleDto } from '@/article/dto/createArticle.dto';
import { IArticleResponse } from '@/article/types/articleResponse.interface';
import { User } from '@/user/decorators/user.decorator';
import { AuthGuard } from '@/user/guards/auth.guard';
import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createArticle(
    @User() user,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const newArticle = await this.articleService.createArticle(user, createArticleDto);
    return this.articleService.generateArticleResponse(newArticle);
  }
}
