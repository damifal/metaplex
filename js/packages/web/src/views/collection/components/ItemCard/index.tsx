import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { Card, CardProps, Button, Badge } from 'antd';
import { Item } from '../../types'; 
import { MetaAvatar } from '../../../../components/MetaAvatar';
import { ArtContent } from '../../../../components/ArtContent';
import { INftCollection } from '../../../../actions/nftCollection';
import styled from 'styled-components';
import { CachedImageContent } from '../../../../components/ArtContent';

const ART_CARD_SIZE = 250;
const { Meta } = Card;

const ItemCard = ({ item }: { item: INftCollection }): ReactElement => {
    
  const ArtContentWrapper = styled.div`
    display: flex;
    alignItems: center;
    justifyContent: center;
    height: 100%;
    `;
console.log(item);
  return (
    <Link to={`/collections/${item.UrlHandle}`}>
      <Card
      hoverable={true}
    >
        
      <div className="art-content__wrapper"> 
        <ArtContent
          pubkey={item.OwnerAddress}
          uri={item.ImageUrl} 
          preview={true}
          height={400}
          width={400}
          artView={false}
        />
        
      </div>
      <Meta
        title={`${item.Name}`}
        description={
          <>
            {/* {art.type === ArtType.Master && (
              <>
                <br />
                {!endAuctionAt && (
                  <span style={{ padding: '24px' }}>
                    {(art.maxSupply || 0) - (art.supply || 0)}/
                    {art.maxSupply || 0} prints remaining
                  </span>
                )}
              </>
            )} */}

            {item.Total && (
              <div className="edition-badge">Selected count: {item.Total}</div>
            )}
          </>
        }
      />
    </Card>
    </Link>
  );
};
 

export default ItemCard;
