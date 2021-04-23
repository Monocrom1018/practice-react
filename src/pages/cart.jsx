import React, { useEffect } from 'react';
import { cartsState } from '../atoms';
import { getCart, deleteCart, patchQuantity } from '../common/api';
import { useRecoilState } from 'recoil';
import { getToken } from '../common/auth';

import {
  List,
  ListItem,
  Navbar,
  NavTitle,
  Button,
  Stepper,
  Page,
} from 'framework7-react';

const CartPage = () => {
  const [carts, setCarts] = useRecoilState(cartsState);

  const getTotalPrice = () => {
    return carts.reduce((acc, cur) => acc + cur.total_price, 0) + 2500;
  };

  const getTotalQuantity = () => {
    return carts.reduce((acc, cur) => acc + cur.quantity, 0);
  };

  const handleQuantity = async (quantity, optionId, price) => {
    await patchQuantity({
      quantity: quantity,
      id: optionId,
      totalPrice: quantity * price,
    });
    const data = await getCart();
    setCarts(data.data);
  };

  const handleDelete = async id => {
    await deleteCart(id);
    const data = await getCart();
    setCarts(data.data);
  };

  useEffect(async () => {
    let loggedIn = !!getToken().token;
    if (loggedIn) {
      const data = await getCart();
      setCarts(data.data);
    }
  }, []);

  return (
    <Page name="cart">
      {/* Top Navbar */}
      <Navbar sliding={false}>
        <NavTitle className="tracking-wide">장바구니</NavTitle>
      </Navbar>

      {/* Page content */}
      {carts.length === 0 ? (
        <div className="text-center mt-60">
          <i className="f7-icons text-8xl text-gray-400">cart</i>
          <div className="text-xl text-gray-400 mt-4 tracking-wide">
            장바구니가 비어있어요 :)
          </div>
        </div>
      ) : (
        <div>
          <List mediaList>
            {carts.map((ele, index) => (
              <ListItem key={index}>
                <div className="flex flex-row justify-between">
                  <div>
                    <div className="font-bold">{ele.Option.Item.name}</div>
                    <div className="text-gray-500">{ele.weight}g</div>
                    <div>
                      {ele.total_price.toLocaleString()}₩ ( {ele.quantity}개 )
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div
                      onClick={() => handleDelete(ele.id)}
                      className="f7-icons text-xl text-gray-500 outline-none w-8 h-8 ml-12"
                    >
                      trash
                    </div>

                    <Stepper
                      buttonsOnly={true}
                      value={ele.quantity}
                      min={1}
                      max={10}
                      small
                      raised
                      onStepperChange={value =>
                        handleQuantity(value, ele.Option.id, ele.Option.price)
                      }
                    />
                  </div>
                </div>
                <img slot="media" src={ele.Option.Item.image} width="60" />
              </ListItem>
            ))}
            <ListItem>
              <div className="flex flex-row justify-between text-sm mx-3">
                <div>배송비</div>
                <div>2,500₩</div>
              </div>
            </ListItem>
          </List>

          <div className="flex flex-row justify-between text-lg font-semibold tracking-wider mx-4">
            <div>주문 총액(수량)</div>
            <div>
              <div>
                {getTotalPrice().toLocaleString()}₩ ({getTotalQuantity()}
                개)
              </div>
            </div>
          </div>

          <Button
            fill
            outline
            strong
            href={`/payment`}
            className="mt-1 mx-3 py-5 font-extrabold"
          >
            주문하기
          </Button>
        </div>
      )}
    </Page>
  );
};

export default CartPage;
