import React, { useState, useEffect } from 'react';
import { getOrder } from '../common/api';
import { Page, Navbar, Button, List, ListItem } from 'framework7-react';

const orderListPage = () => {
  const [orders, setOrders] = useState([
    {
      Lineitems: [
        {
          Option: {
            Item: {
              category: 'Blended',
              description: '밀크 초콜렛, 크림, 카카오',
              id: 1,
              image:
                'https://user-images.githubusercontent.com/74134503/113382366-3ce97680-93bc-11eb-900a-7db40f849c88.jpg',
              name: '엑스쇼콜라',
              price: 12000,
            },
            grams: '200',
            id: 1,
            item_id: 1,
            price: 12000,
          },
          id: 4,
          option_id: 1,
          order_id: 8,
          price: 12000,
          quantity: 1,
          total_price: 12000,
          user_id: 2,
          weight: 200,
        },
      ],
      createdAt: '2021-04-14T04:30:28.000Z',
      destination: '서울 은평구 진관4로 87 622동 210호',
      email: 'monocrom1018@gmail.com',
      final_price: 14500,
      id: 8,
      method: '신용카드',
      phone_number: '010-0000-0000',
      purchaser: '이승배',
      state: '결제완료',
      updatedAt: '2021-04-14T04:30:28.000Z',
      user_id: 2,
    },
  ]);

  useEffect(async () => {
    const orderData = await getOrder();
    await setOrders(orderData.data);
  }, []);

  return (
    <Page>
      {/* Top Navbar */}
      <Navbar title="주문내역"></Navbar>

      {/* Page content */}
      {orders.length === 0 ? (
        <div className="text-center mt-60">
          <i className="las la-edit text-8xl text-gray-400" />
          <div className="text-xl text-gray-400 mt-4 tracking-wide">
            주문리스트가 존재하지 않아요 :)
          </div>
        </div>
      ) : (
        <div>
          {orders.map(order => {
            return (
              <List mediaList key={order.id}>
                <div className="flex flex-row justify-between">
                  <div className="mx-4 font-bold -mt-5">
                    order_No. {order.id}
                  </div>
                  <div className="mx-4 font-bold -mt-5">
                    date : {order.createdAt.split('T')[0]}
                  </div>
                </div>
                {order.Lineitems.map(lineitem => {
                  return (
                    <ListItem key={lineitem.id}>
                      <div className="flex flex-row justify-between mt-1">
                        <div>
                          <div className="font-bold">
                            {lineitem.Option.Item.name}
                          </div>
                          <div className="text-gray-500 pt-3">
                            {lineitem.weight}g
                          </div>
                        </div>

                        <div className="flex flex-col justify-between">
                          <div>
                            {lineitem.total_price.toLocaleString()}₩ ({' '}
                            {lineitem.quantity}개 )
                          </div>
                          {lineitem.reviewed === '1' ? (
                            <Button
                              className="w-18 ml-12"
                              href={`/review/update/${lineitem.item_id}`}
                              fill
                              outline
                              round
                            >
                              리뷰확인
                            </Button>
                          ) : (
                            <Button
                              className="w-18 ml-12"
                              href={`/review/${lineitem.item_id}`}
                              outline
                              round
                            >
                              리뷰작성
                            </Button>
                          )}
                        </div>
                      </div>
                      <img
                        slot="media"
                        src={lineitem.Option.Item.image}
                        width="60"
                      />
                    </ListItem>
                  );
                })}
                <div className="mx-4 font-bold pb-10 text-right mt-1">
                  total : {order.final_price.toLocaleString()}₩
                </div>
                <div className="border-dashed border-t-4 h-7"></div>
              </List>
            );
          })}
        </div>
      )}
    </Page>
  );
};

export default orderListPage;
