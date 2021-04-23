import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { cartsState, likeState } from '../atoms';
import { getToken } from '../common/auth';
import { showToastCenter } from '../js/utils';
import {
  getCart,
  createCart,
  toggleLike,
  getLike,
  getDetails,
  createRecentView,
} from '../common/api';
import {
  Page,
  Navbar,
  Block,
  Button,
  Stepper,
  List,
  ListInput,
  BlockHeader,
  BlockFooter,
} from 'framework7-react';

const DetailPage = props => {
  const [carts, setCarts] = useRecoilState(cartsState);
  const [like, setLike] = useRecoilState(likeState);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState('200');
  const [details, setDetails] = useState({ price: 1 });

  const handleLike = async id => {
    let loggedIn = !!getToken().token;
    if (!loggedIn) {
      return showToastCenter('로그인 후 이용 가능합니다.');
    }
    const likeData = await toggleLike({ id: id });
    setLike(likeData.data);
  };

  const handleCartIn = async () => {
    let loggedIn = !!getToken().token;
    if (!loggedIn) {
      return showToastCenter('로그인 후 이용 가능합니다.');
    }

    const cartCheck = carts.filter(item => {
      return (
        item.weight === Number(weight) && item.Option.item_id === details.id
      );
    });

    if (cartCheck.length >= 1) {
      return showToastCenter('이미 담겨있습니다 :)');
    }

    const props = {
      itemId: details.id,
      weight: weight,
      price: details.price,
      quantity: quantity,
      total_price: details.price * quantity,
    };

    await createCart(props);
    const data = await getCart();
    setCarts(data.data);

    return showToastCenter('장바구니에 담았습니다.');
  };

  const handleWeight = e => {
    setWeight(e.target.value);

    if (e.target.value === '500')
      setDetails({ ...details, price: details.Options[1].price });
    if (e.target.value === '200')
      setDetails({ ...details, price: details.Options[0].price });
  };

  useEffect(async () => {
    const DetailsData = await getDetails(props.id);
    setDetails(DetailsData.data);

    let loggedIn = !!getToken().token;
    if (loggedIn) {
      const likeData = await getLike(props.id);
      setLike(likeData.data);
      await createRecentView({ id: props.id });
    }
  }, []);

  return (
    <Page noToolbar>
      {/* Top Navbar */}
      <Navbar title={details.name} backLink="Back"></Navbar>

      {/* Page Content */}

      <img src={details.image} alt="logo" />
      <Block className="ml-4 mt-2 flex flex-row justify-between">
        <div>
          <BlockHeader className="text-xl font-bold text-gray-900">
            {details.name}
          </BlockHeader>
          <p className="mt-1 text-gray-500">{details.description}</p>
          <BlockFooter className="mt-1">
            {details.price.toLocaleString()}₩ ({weight}g)
          </BlockFooter>
        </div>
        <div className="flex flex-col justify-between">
          <div className="w-10 ml-10">
            {like.length === 0 ? (
              <Button
                href={!!getToken().token ? null : `/users/sign_in`}
                onClick={() => handleLike(details.id)}
                className="f7-icons text-red-500 w-10"
              >
                heart
              </Button>
            ) : (
              <Button
                onClick={() => handleLike(details.id)}
                className="f7-icons text-red-500 w-10"
              >
                heart_fill
              </Button>
            )}
          </div>
          <Button
            className="mx-3"
            outline
            href={`/review/collection/${props.id}`}
          >
            리뷰보기
          </Button>
        </div>
      </Block>
      <List noHairlinesMd className="my-3">
        <ListInput
          label="중량"
          type="select"
          defaultValue="200"
          onChange={handleWeight}
        >
          <option value="200">200g</option>
          <option value="500">500g</option>
        </ListInput>
      </List>
      <Block className="flex flex-row justify-between items-center my-4 ml-4 mr-3">
        <div className="text-lg font-semibold tracking-wider mt-1 text-gray-900">
          {' '}
          합계 : {(details.price * quantity).toLocaleString()}₩
        </div>
        <Stepper
          value={quantity}
          min={1}
          max={10}
          raised
          onStepperChange={setQuantity}
        />
      </Block>
      <Button
        fill
        outline
        className="mt-10 py-5 mx-3 font-extrabold"
        href={!!getToken().token ? null : `/users/sign_in`}
        onClick={handleCartIn}
      >
        장바구니 담기
      </Button>
    </Page>
  );
};

export default DetailPage;
