import { ArticleComment } from "./articleComment.entity";

export const articleCommentProviders = [
  {
    provide: 'ARTICLECOMMENT_REPOSITORY',
    useValue: ArticleComment,
  },
];
