import React, { useEffect, useState } from 'react';
import { getAllReviews } from '../common/api';
import StarRatingComponent from 'react-star-rating-component';

import {
  List,
  Block,
  ListItem,
  Input,
  Navbar,
  AccordionContent,
  Page,
} from 'framework7-react';

const ItemReviewPage = props => {
  const [reviews, setReviews] = useState([]);
  const [order, setOrder] = useState('별점높은 순');

  useEffect(async () => {
    const reviewData = await getAllReviews(props.id);

    let orderedData;
    if (order === '별점높은 순') {
      orderedData = reviewData.data.sort((a, b) => {
        return b.rating - a.rating;
      });
    }
    if (order === '별점낮은 순') {
      orderedData = reviewData.data.sort((a, b) => {
        return a.rating - b.rating;
      });
    }
    await setReviews(orderedData);
  }, [order]);

  return (
    <Page name="review" noToolbar>
      {/* Top Navbar */}
      <Navbar title={'리뷰보기'} backLink="Back"></Navbar>

      {/* Page Content */}
      {reviews.length === 0 ? (
        <div className="text-center mt-60">
          <i className="f7-icons text-8xl text-gray-400">square_pencil</i>
          <div className="text-xl text-gray-400 mt-4 tracking-wide">
            작성된 리뷰가 없습니다.
          </div>
        </div>
      ) : (
        <List accordionList>
          <div className="flex justify-end">
            <Input
              type="select"
              defaultValue="별점높은 순"
              className="w-28 mx-3 px-1"
              onChange={e => setOrder(e.target.value)}
            >
              <option value="별점높은 순">별점높은 순</option>
              <option value="별점낮은 순">별점낮은 순</option>
            </Input>
          </div>
          {reviews.map((review, index) => {
            return (
              <ListItem
                key={index}
                accordionItem
                title={
                  <div className="font-bold text-lg truncate">
                    {review.title}
                  </div>
                }
                footer={<div className="text-sm">{review.User.name}</div>}
                after={
                  <div>
                    <StarRatingComponent
                      name="rating"
                      editing={false}
                      starCount={5}
                      value={review.rating}
                      starColor="#FF3A30"
                      emptyStarColor="#AAAAAA"
                      className="text-xl"
                    />
                    <div className="-mt-2 text-right text-sm">
                      {review.createdAt.split('T')[0]}
                    </div>
                  </div>
                }
              >
                <AccordionContent>
                  <Block className="py-2 mx-4 text-base text-gray-700">
                    {review.content}
                  </Block>
                </AccordionContent>
              </ListItem>
            );
          })}
        </List>
      )}
    </Page>
  );
};

export default ItemReviewPage;
