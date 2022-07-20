import { PostResponse, ModalCloseEvent } from 'types/interfaces';
import { MutableRefObject, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { nanoid } from 'nanoid';

import * as SC from './style';
import ImageCarousel from './components/ImageCarousel';
import RoutineList from './components/RoutineList';
import MealList from './components/MealList';
import useComment from './hooks/useComment';

interface ArticleProps {
  post: PostResponse | undefined;
  modalState: React.Dispatch<React.SetStateAction<boolean>>;
  articleId?: string;
  getArticle?: (id: string | undefined) => Promise<void>;
}

const ArticleModal = ({
  post,
  modalState,
  articleId,
  getArticle,
}: ArticleProps) => {
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>;
  const { addComment, result } = useComment();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<{ content: string }>();

  const handleClose = (e: ModalCloseEvent) => {
    if (
      e.currentTarget.closest('.close-area') ||
      wrapperRef.current === e.target
    ) {
      modalState(false);
    }
  };

  const onSubmit: SubmitHandler<any> = (data) => {
    const postData = {
      postId: articleId,
      content: data.content,
    };
    addComment(postData);
  };

  useEffect(() => {
    if (result?.status === 201 && getArticle) {
      getArticle(articleId);
      resetField('content');
    }
  }, [result]);

  return (
    <SC.Wrapper onClick={handleClose} ref={wrapperRef}>
      {!post ? (
        <SC.Modal>게시글이 존재하지 않습니다!</SC.Modal>
      ) : (
        <SC.Modal>
          <SC.CloseIcon className="close-area" onClick={handleClose} />
          {post.post_image.length !== 0 ? (
            <SC.CarouselContainer>
              <ImageCarousel imgUrl={post.post_image} />
            </SC.CarouselContainer>
          ) : (
            ''
          )}
          <SC.Article>
            <SC.ArticleContent>{post.contents}</SC.ArticleContent>
            <SC.TagContainer>
              {post.tag_list.map((tagObject) => (
                <SC.Tag key={nanoid()}>{`#${tagObject.tag}`}</SC.Tag>
              ))}
            </SC.TagContainer>
            <SC.DivideLine />
            {post.meal_info.length !== 0 && (
              <>
                <MealList mealList={post.meal_info} />
                <SC.DivideLine />
              </>
            )}
            {post.routine_info.length !== 0 && (
              <RoutineList routineList={post.routine_info} />
            )}
            <SC.CommentContainer>
              <SC.CommentInputWrapper onSubmit={handleSubmit(onSubmit)}>
                <SC.CommentInput
                  placeholder="댓글을 입력하세요."
                  type="text"
                  {...register('content', { required: true, maxLength: 400 })}
                />
                <SC.SubmitButton type="submit">입력</SC.SubmitButton>
              </SC.CommentInputWrapper>
              <SC.CommentWrapper>
                {post.comments.map((comment) => (
                  <li key={comment._id}>
                    <SC.CommentEleWrapper>
                      <SC.CommentAuthorWrapper>
                        {comment.author}
                      </SC.CommentAuthorWrapper>
                      <SC.CommentContent>{comment.content}</SC.CommentContent>
                    </SC.CommentEleWrapper>
                  </li>
                ))}
              </SC.CommentWrapper>
            </SC.CommentContainer>
          </SC.Article>
        </SC.Modal>
      )}
    </SC.Wrapper>
  );
};

export default ArticleModal;
