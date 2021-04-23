import React from 'react';
import { useEffect } from 'react';
import { getItems } from '../common/api';
import { useRecoilState } from 'recoil';
import { itemsState } from '../atoms';

import {
  List,
  ListItem,
  Navbar,
  Searchbar,
  Subnavbar,
  Page,
  theme,
} from 'framework7-react';

const SearchPage = () => {
  const [items, setItems] = useRecoilState(itemsState);

  useEffect(async () => {
    const allItems = await getItems();
    await setItems(allItems.data);
  }, []);

  return (
    <Page noToolbar>
      {/* Top Navbar */}
      <Navbar backLink="Back" title="상품검색">
        <Subnavbar inner={false}>
          <Searchbar
            searchContainer=".search-list"
            searchIn=".item-title, .item-text"
            disableButton={!theme.aurora}
            placeholder={'ex) 에스쇼콜라 or 초콜릿'}
          />
        </Subnavbar>
      </Navbar>

      {/* Page Contents */}
      <List className="searchbar-not-found">
        <ListItem title="Nothing found" />
      </List>
      <List className="search-list searchbar-found" mediaList>
        {items.map((item, index) => {
          return (
            <ListItem
              link={`/detail/${item.id}`}
              key={index}
              indexKey={item.id}
              title={<div className="pt-1">{item.name}</div>}
              subtitle={item.category}
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
export default SearchPage;
