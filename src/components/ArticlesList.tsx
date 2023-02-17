import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { ReactNode, useState } from 'react';
import {
  DragDropContext, Draggable, Droppable,
} from 'react-beautiful-dnd';
import Image from 'next/dist/client/image';
import { Stack } from '@mui/material';
import { useRouter } from 'next/dist/client/router';
import ArticleList from '@/styles/ArticleList.module.css';
import { Store, useStore } from '@/store/store';
import { ArticleTitle } from '@/types/Article';
import { useMobile, useUser } from '@/services/AuthHooks';
import EditIcon from '../../public/edit.svg';
import DragDropIcon from '../../public/dragdrop.svg';
import { ArticleOrder } from '@/services/api/ArticlesTable';

function ArticlesList() {
  const selectedArticle = useStore((state: Store) => state.selectedArticle);
  const setSelectedArticle = useStore((state: Store) => state.setSelectedArticle);
  const [articles, setArticles] = useState<ArticleTitle[]>([]);
  const isMobile = useMobile();

  const router = useRouter();
  const user = useUser();

  const { isLoading } = useQuery('articleTitles', () => (
    axios.get<ArticleTitle[]>('/api/articles').then((res: AxiosResponse<ArticleTitle[]>) => {
      if (!selectedArticle) {
        setSelectedArticle(res.data[0].id);
      }
      setArticles(res.data);
    })
  ));

  const handleEditButton = (id: number | string) => {
    router.push(`/article/edit/${id}`);
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(articles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const sortings: ArticleOrder[] = items.map((article, index) => (
      { id: article.id, sort: index }
    ));
    axios.post('/api/article/reorder', { sortings }).then();
    setArticles(items);
  };

  const handleSelectArticle = (id: number) => {
    setSelectedArticle(id);

    if (isMobile) {
      router.push(`/article/${id}`);
    }
  };

  return (
    <div className={`${user?.admin ? ArticleList.admin : ''}`}>
      {!isLoading && articles !== undefined ? (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="articleList">
            {(providedDroppable) => (
              <div
                {...providedDroppable.droppableProps}
                ref={providedDroppable.innerRef}
                className={ArticleList.list}
              >
                { articles.map<ReactNode>((article: ArticleTitle, index: number) => (
                  <Draggable
                    key={article.id.toString()}
                    draggableId={article.id.toString()}
                    index={index}
                  >
                    {(providedDraggable) => (
                      <div
                        {...providedDraggable.draggableProps}
                        ref={providedDraggable.innerRef}
                        className={`${ArticleList.item} ${selectedArticle === article.id ? ArticleList.selected : null}`}
                      >
                        { user !== null && user.admin ? (
                          <Stack className={ArticleList.buttons} direction="row" gap={0.25}>
                            <Image height={24} src={EditIcon} onClick={() => { handleEditButton(article.id); }} alt="Edit" className={ArticleList.edit} />
                            <div {...providedDraggable.dragHandleProps}>
                              <Image height={24} src={DragDropIcon} alt="Drag&Drop" />
                            </div>
                          </Stack>
                        ) : null }

                        <div
                          role="button"
                          tabIndex={index + 1}
                          className={ArticleList.link}
                          onClick={() => { handleSelectArticle(Number(article.id)); }}
                          onKeyDown={() => { handleSelectArticle(Number(article.id)); }}
                        >
                          {article.title}

                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {providedDroppable.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : null}
    </div>
  );
}

export default ArticlesList;
