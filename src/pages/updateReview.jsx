import React, { useEffect, useState } from 'react';
import { showToastCenter } from '../js/utils';
import { getDetails, getTarget, updateReview } from '../common/api';
import StarRatingComponent from 'react-star-rating-component';

import {
  List,
  ListInput,
  ListItem,
  Navbar,
  Button,
  Page,
} from 'framework7-react';

const updateReviewPage = props => {
  const [details, setDetails] = useState({ name: 'text', image: 'text' });
  const [rating, setRating] = useState(1);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleReviewButton = async () => {
    showToastCenter('리뷰가 수정되었습니다');
    const params = {
      id: props.id,
      rating: rating,
      title: title,
      content: content,
    };

    await updateReview(params);
    location.replace(`/`);
  };

  const handleStar = value => {
    setRating(value);
  };

  useEffect(async () => {
    const DetailsData = await getDetails(props.id);
    setDetails(DetailsData.data);

    const reviewData = await getTarget(props.id);
    setRating(reviewData.data.rating);
    setTitle(reviewData.data.title);
    setContent(reviewData.data.content);
  }, []);

  return (
    <Page name="review" noToolbar>
      {/* Top Navbar */}
      <Navbar title={'리뷰수정'} backLink="Back"></Navbar>

      {/* Page Contents */}
      <List mediaList>
        <div className="mx-4 font-bold text-lg -mt-5">✓ 상품정보</div>
        <ListItem>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="font-bold text-xl">{details.name}</div>
              <div className="mx-3 text-gray-500">{details.category}</div>
            </div>
            <StarRatingComponent
              name="rating"
              starCount={5}
              value={rating}
              onStarClick={handleStar}
              starColor="#FF3A30"
              emptyStarColor="#AAAAAA"
              className="mt-2 text-xl mx-2"
            />
          </div>
          <img slot="media" src={details.image} width="60" />
        </ListItem>
        <ListInput
          label="제목"
          floatingLabel
          type="text"
          value={title}
          placeholder="제목을 입력해주세요"
          onChange={e => setTitle(e.target.value)}
          clearButton
        ></ListInput>

        <ListInput
          label="내용"
          floatingLabel
          type="textarea"
          value={content}
          resizable
          placeholder="내용을 입력해주세요"
          onChange={e => setContent(e.target.value)}
        ></ListInput>
      </List>
      <Button className="font-normal text-base" onClick={handleReviewButton}>
        리뷰수정
      </Button>
    </Page>
  );
};

export default updateReviewPage;
