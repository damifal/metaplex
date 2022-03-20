import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Divider,
  Layout,
  Tag,
  Tabs,
  Button,
  Skeleton,
  List,
  Card,
} from 'antd';
import { useMeta } from '../../contexts';
import { CardLoader } from '../../components/MyLoader';
import { useHistory, useParams } from 'react-router-dom';

import { ArtworkViewState } from './types';
import { useItems } from './hooks/useItems';
import ItemCard from './components/ItemCard';
import { useUserAccounts } from '@oyster/common';
import { DownOutlined } from '@ant-design/icons';
import { isMetadata, isPack } from './utils';
import { INftCollection } from '../../actions/nftCollection';
import { ArtContent } from '../../components/ArtContent';
import { ViewOn } from '../../components/ViewOn';
import { MetaAvatar } from '../../components/MetaAvatar';

const { TabPane } = Tabs;
const { Content } = Layout;

export const CollectionView = () => {
  const { urlcode } = useParams<{ urlcode: string }>();
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

  const history = useHistory();
const [data, setData] = useState<INftCollection|undefined>(undefined)
//const [isLoading, setLoading] = useState(false)
//const [publicKey, setPublicKey] = useState("")


  useEffect(() => { 
    if (publicKey) {
      console.log('yass');
      //setLoading(true)
      fetch('https://www.spendow.com/solapi/collectionbyurlcode/?urlCode='+urlcode)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setData(data)
          //setLoading(false)
        })
    }
    
  }, [urlcode])

if (isLoading) return <p>Loading...</p>
if (!data) return <p>No collection. <a href="/#/art/create/collection/0">Create a collection</a></p>

  const collectionGrid = (
    <div className="artwork-grid">
      {isLoading && [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
      
      {data && <ItemCard item={data} key={data.UrlHandle} />}
    </div>
  );

   console.log(collectionGrid);

  /*return (
    <Layout style={{ margin: 0, marginTop: 30 }}>
      <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
        <h2 className="call-to-action">{data && data.Name}</h2>
        <Col style={{ width: '100%', marginTop: 10 }}> 
          <Row>
            {collectionGrid}
          </Row>
        </Col>
      </Content>
    </Layout>
  );*/

return data && (
    <Content>
      <Col>
        <Row>
          <Col
            xs={{ span: 24 }}
            md={{ span: 12 }}
            style={{ paddingRight: '30px' }}
          >
            <ArtContent
              style={{ width: '100%', height: 'auto', margin: '0 auto' }}
              height={300}
              width={300}
              className="artwork-image"
              pubkey={data.ImageUrl}
              active={true}
              allowMeshRender={true}
              artView={true}
              uri={data.ImageUrl}
            />
          </Col>
          {/* <Divider /> */}
          <Col
            xs={{ span: 24 }}
            md={{ span: 12 }}
            style={{ textAlign: 'left', fontSize: '1.4rem' }}
          >
            <Row>
              <div style={{ fontWeight: 700, fontSize: '4rem' }}>
                {data.Name || <Skeleton paragraph={{ rows: 0 }} />}
              </div>
            </Row>
            <Row>
              <Col span={6}>
                <h6>Royalties</h6>
                <div className="royalties">
                  {((data.SellerFeeBasisPoints || 0) / 100).toFixed(2)}%
                </div>
              </Col>
              <Col span={12}>
                <ViewOn id={data.UrlHandle} />
              </Col>
            </Row>
            <Row>
              <Col>
                <h6 style={{ marginTop: 5 }}>Created By</h6>
                <div className="creators">
                  {(data.Creators || []).map((creator, idx) => {
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: 5,
                        }}
                      >
                        
                        <div>
                          <span className="creator-name">
                            {creator.address}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <h6 style={{ marginTop: 5 }}>Description</h6>
                <div className="art-edition">{data.Description}</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <h6 style={{ marginTop: 5 }}>Total pieces proposed</h6>
                <div className="art-edition">{data.Total}</div>
              </Col>
            </Row> 

            <Row>
              <Button
                type="primary"
                size="middle" 
                style={{ marginTop: 5 }}
                className="action-btn"
                onClick={_ => history.push(`/collection/addseed/${data.UrlHandle}`)}
              >
                Generate NFT Art
              </Button>
            </Row>
            {/* TODO: Add conversion of MasterEditionV1 to MasterEditionV2 */}
             
          </Col>
          <Col span="12">
            <Divider />
             
            <br />
            <div className="info-header">ABOUT THE COLLECTION</div>
            <div className="info-content">{data.Description}</div>
            <br />
            {/*
              TODO: add info about artist
            <div className="info-header">ABOUT THE CREATOR</div>
            <div className="info-content">{art.about}</div> */}
          </Col>
          <Col span="12">
            {data.Attributes && (
              <>
                <Divider />
                <br />
                <div className="info-header">Attributes</div>
                <List size="large" grid={{ column: 4 }}>
                  {data.Attributes.map(attribute => (
                    <List.Item key={attribute.trait_type}>
                      <Card title={attribute.trait_type}>
                        {attribute.value}
                      </Card>
                    </List.Item>
                  ))}
                </List>
              </>
            )}
          </Col>
        </Row>
      </Col>
    </Content>
  );
};
