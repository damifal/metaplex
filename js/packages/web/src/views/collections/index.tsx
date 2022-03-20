import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Tabs, Dropdown, Menu } from 'antd';
import { useMeta } from '../../contexts';
import { CardLoader } from '../../components/MyLoader';

import { ArtworkViewState } from './types';
import { useItems } from './hooks/useItems';
import ItemCard from './components/ItemCard';
import { useUserAccounts } from '@oyster/common';
import { DownOutlined } from '@ant-design/icons';
import { isMetadata, isPack } from './utils';
import { INftCollection } from '../../actions/nftCollection';

const { TabPane } = Tabs;
const { Content } = Layout;

export const CollectionsView = () => {
  const { publicKey, connected } = useWallet();
  const {
    isLoading,
    pullAllMetadata,
    storeIndexer,
    pullItemsPage,
    isFetching,
  } = useMeta();
  const { userAccounts } = useUserAccounts();

 /* const [activeKey, setActiveKey] = useState(ArtworkViewState.Metaplex);

  const userItems = useItems({ activeKey });
 
  useEffect(() => {
    if (!isFetching) {
      pullItemsPage(userAccounts);
      //console.log(userAccounts);
    }
  }, [isFetching]);

  useEffect(() => {
    if (connected) {
      setActiveKey(ArtworkViewState.Owned);
    } else {
      setActiveKey(ArtworkViewState.Metaplex);
    }
  }, [connected, setActiveKey]);
*/
  const isDataLoading = isLoading || isFetching;


const [data, setData] = useState<INftCollection[]|undefined>(undefined)
//const [isLoading, setLoading] = useState(false)
//const [publicKey, setPublicKey] = useState("")


  useEffect(() => {
    console.log(publicKey);
    console.log(isLoading);
    console.log(isFetching);
    console.log('ro');
    console.log(publicKey);
    if (publicKey) {
      console.log('yass');
      //setLoading(true)
      fetch('https://www.spendow.com/solapi/collections/?wallet='+publicKey)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setData(data.Collections)
          //setLoading(false)
        })
    }
    
  }, [publicKey])

if (isLoading) return <p>Loading...</p>
if (!data) return <p>No collection. <a href="/#/art/create/collection/0">Create a collection</a></p>

  const collectionGrid = (
    <div className="artwork-grid">
      {isLoading && [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
      
      {!isLoading &&
        data.map(item => {  
          return <ItemCard item={item} key={item.UrlHandle} />
        })}
    </div>
  );

   console.log(collectionGrid);

  return (
    <Layout style={{ margin: 0, marginTop: 30 }}>
      <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
        <h2 className="call-to-action">My Collections</h2>
        <Col style={{ width: '100%', marginTop: 10 }}> 
          <Row>
            {collectionGrid}
          </Row>
        </Col>
      </Content>
    </Layout>
  );
};
