import { useEffect, useState } from 'react';
import { getItems } from '../common/api';
import { useRecoilState } from 'recoil';
import { itemsState } from '../atoms';
import {
  Link,
  List,
  ListItem,
  Navbar,
  NavRight,
  NavTitle,
  Subnavbar,
  Segmented,
  Button,
  Page,
  theme,
} from 'framework7-react';
import React from 'react';

const HomePage = () => {
  const [items, setItems] = useRecoilState(itemsState);
  const [activeStrongButton, setActiveStrongButton] = useState(0);

  const handleCategory = async e => {
    const categoryValue = e.target.innerText;

    if (categoryValue === 'All') {
      const allItems = await getItems();
      await setItems(allItems.data);
      setActiveStrongButton(0);
      return;
    }

    if (categoryValue === 'Single') setActiveStrongButton(1);
    if (categoryValue === 'Blended') setActiveStrongButton(2);

    const allItems = await getItems();
    const filteredItems = await allItems.data.filter(item => {
      return item.category === categoryValue;
    });

    await setItems(filteredItems);
  };

  useEffect(async () => {
    const allItems = await getItems();
    await setItems(allItems.data);
  }, []);

  return (
    <Page name="home" hideNavbarOnScroll hideToolbarOnScroll>
      {/* Top Navbar */}
      <Navbar sliding={false}>
        <NavTitle className="tracking-wide font-serif">
          Insomenia Coffee
        </NavTitle>
        <NavRight>
          <Link
            href="/search"
            iconIos="f7:search"
            iconMd="material:search"
            iconAurora="f7:search"
            disableButton={!theme.aurora}
          />
        </NavRight>
        <Subnavbar>
          <Segmented strong round>
            <Button
              active={activeStrongButton === 0}
              onClick={e => handleCategory(e)}
            >
              All
            </Button>
            <Button
              active={activeStrongButton === 1}
              onClick={e => handleCategory(e)}
            >
              Single
            </Button>
            <Button
              active={activeStrongButton === 2}
              onClick={e => handleCategory(e)}
            >
              Blended
            </Button>
          </Segmented>
        </Subnavbar>
      </Navbar>

      {/* Page content */}
      <div className="p-3">
        <img
          src="https://user-images.githubusercontent.com/74134503/115399807-8989da00-a223-11eb-90f7-d0ed2b6050b7.png"
          alt="logo"
        />
      </div>

      <div className="text-center font-bold text-xl px-4 -mb-7 font-serif tracking-widest">
        Items
      </div>
      <List mediaList>
        {items.map((item, index) => {
          return (
            <ListItem
              link={`/detail/${item.id}`}
              key={index}
              indexKey={item.id}
              title={<div className="pt-1 text-gray-900">{item.name}</div>}
              subtitle={<div className="text-gray-800">{item.category}</div>}
              text={item.description}
              chevronCenter="true"
            >
              <img slot="media" src={item.image} width="75" />
            </ListItem>
          );
        })}
      </List>
    </Page>
  );
};
export default HomePage;
