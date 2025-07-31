import { ArticleEntity } from '@/article/article.entity';
import { CreateArticleDto } from '@/article/dto/createArticle.dto';
import { UpdateArticleDto } from '@/article/dto/updateArticle.dto';
import { IArticleResponse } from '@/article/types/articleResponse.interface';
import { IArticlesResponse } from '@/article/types/articlesResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Define service methods here
  async findAll(query: any): Promise<IArticlesResponse> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');

    if (query.tag) {
      queryBuilder.andWhere('article.tagList LIKE :tag', { tag: `%${query.tag}%` });
    }

    let author = null;

    if (query.author) {
      author = await this.userRepository.findOne({
        where: { username: query.author },
      });

      if (!author) {
        return { articles: [], articlesCount: 0 };
      }

      queryBuilder.andWhere('article.authorId = :authorId', { authorId: author.id });
    }

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    queryBuilder.orderBy('article.createdAt', 'DESC');

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

  async createArticle(
    user: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.generateSlug(article.title);

    article.author = user;

    return await this.articleRepository.save(article);
  }

  async getSingleArticle(slug: string): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    return article;
  }

  async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You do not have permission to delete this article',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    currentUserId: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You do not have permission to update this article',
        HttpStatus.FORBIDDEN,
      );
    }

    if (updateArticleDto.title) {
      article.slug = this.generateSlug(updateArticleDto.title);
    }

    Object.assign(article, updateArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async addFavoriteArticle(currentUserId: number, slug: string): Promise<ArticleEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      relations: ['favorites'],
    });

    if (!user) {
      throw new HttpException(`User with ID ${currentUserId} not found`, HttpStatus.NOT_FOUND);
    }

    const currentArticle = await this.findBySlug(slug);

    const isNotFavorite = !user.favorites.find((article) => article.slug === currentArticle.slug);

    if (isNotFavorite) {
      currentArticle.favoritedCount++;
      user?.favorites.push(currentArticle);
      await this.articleRepository.save(currentArticle);
      await this.userRepository.save(user);
    }

    return currentArticle;
  }

  async removeArticleFromFavorites(currentUserId: number, slug: string): Promise<ArticleEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      relations: ['favorites'],
    });

    if (!user) {
      throw new HttpException(`User with ID ${currentUserId} not found`, HttpStatus.NOT_FOUND);
    }

    const currentArticle = await this.findBySlug(slug);

    const articleIndex = user.favorites.findIndex(
      (article) => article.slug === currentArticle.slug,
    );

    if (articleIndex >= 0) {
      currentArticle.favoritedCount--;
      user.favorites.splice(articleIndex, 1);
      await this.articleRepository.save(currentArticle);
      await this.userRepository.save(user);
    }
    return currentArticle;
  }

  generateSlug(title: string): string {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    return `${slugify(title, { lower: true })}-${id}`;
  }

  generateArticleResponse(article: ArticleEntity): IArticleResponse {
    return { article };
  }
}
