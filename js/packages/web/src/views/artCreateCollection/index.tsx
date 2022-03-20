import React, { useEffect, useState, useCallback } from 'react';
import {
  Steps,
  Row,
  Button,
  Upload,
  Col,
  Input,
  Statistic,
  Slider,
  Spin,
  InputNumber,
  Form,
  Typography,
  Space,
  Card,
} from 'antd';
import { ArtCard } from './../../components/ArtCard';
import { UserSearch, UserValue } from './../../components/spendow/UserSearch';
import { Confetti } from './../../components/Confetti';
import { mintNFT } from '../../actions';
import {
  MAX_METADATA_LEN,
  useConnection,
  IMetadataExtension,
  MetadataCategory,
  useConnectionConfig,
  Creator,
  shortenAddress,
  MetaplexModal,
  MetaplexOverlay,
  MetadataFile,
  StringPublicKey,
  WRAPPED_SOL_MINT,
  getAssetCostToStore,
  LAMPORT_MULTIPLIER,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { MintLayout } from '@solana/spl-token';
import { useHistory, useParams } from 'react-router-dom';
import { cleanName, getLast } from '../../utils/utils';
import { AmountLabel } from '../../components/AmountLabel';
import useWindowDimensions from '../../utils/layout';
import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useTokenList } from '../../contexts/tokenList';
import { LABELS } from './../../constants';
import { INftCollection } from '../../actions/nftCollection';


const { Step } = Steps;
const { Dragger } = Upload;
const { Text } = Typography;

export const ArtCreateCollectionView = () => {
  const connection = useConnection();
  const { endpoint } = useConnectionConfig();
  const {wallet, publicKey} = useWallet();
  const [alertMessage, setAlertMessage] = useState<string>();
  const { step_param }: { step_param: string } = useParams();
  const history = useHistory();
  const { width } = useWindowDimensions();
  const [nftCreateProgress, setNFTcreateProgress] = useState<number>(0);

  const [step, setStep] = useState<number>(0);
  const [stepsVisible, setStepsVisible] = useState<boolean>(true);
  const [isMinting, setMinting] = useState<boolean>(false);
  const [nft, setNft] =
    useState<{ metadataAccount: StringPublicKey } | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [attributes, setAttributes] = useState<INftCollection>({
    Name: '',
    Description: '',
    Email: '',
    Image: '', 
    ImageUrl: '',
    Attributes: undefined,
    OwnerAddress: '',
    UrlHandle: '',
    Twitter: '',
    Telegram: '',
    Discord: '',
    Website: '',
    TotalVolume: 0,
    Total: 0,
    SellerFeeBasisPoints: 0,
    Creators: null,
  });

  const gotoStep = useCallback(
    (_step: number) => {
      history.push(`/art/create/collection/${_step.toString()}`);
      if (_step === 0) setStepsVisible(true);
    },
    [history],
  );

  useEffect(() => {
    if (step_param) setStep(parseInt(step_param));
    else gotoStep(0);
  }, [step_param, gotoStep]);

  // store files
  const saveCollection = async () => {  
    setStepsVisible(false);
    setMinting(true);
    attributes.OwnerAddress = publicKey? publicKey.toString() : '';
    //attributes.Image = files?.[0];
let data = {
  "Name": "test nameer",
  "Description": "sdfcwe jkenr dfewidj. kwejed wde wdewrert reotiuerw erwrfwe",
  "Email": "dami@gmail.com",
  "Image": "",
  "OwnerAddress": "Aqdmu82pgmpAxJsXZurmbehf7jpdzK9rpzwTpR4N1sbZ",
  "UrlHandle": "wwerweou",
  "Twitter": "uoouoop",
  "Telegram": "woeurewoe",
  "Discord": "wereoiwere",
  "Website": "google.com",
  "TotalVolume": 0,
  "Total": 220,
  "SellerFeeBasisPoints": 1000,
  "Creators": [
    {
      "address": "Aqdmu82pgmpAxJsXZurmbehf7jpdzK9rpzwTpR4N1sbZ",
      "verified": true,
      "share": 100
    }
  ]
};
    fetch('https://www.spendow.com/solapi/createCollection',  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(attributes)
    }).then((res) => res.json())
    .then(response => {
      //var input = document.querySelector('input[type="file"]')
      if (response.returnId) {
        var data = new FormData();
        data.append('file_input', files[0]);
        data.append('idHash', response.returnId);
        data.append('walletId', attributes.OwnerAddress);

        fetch('https://www.spendow.com/solapi/uploadFile', {
          method: 'POST',
          body: data
        });

        setMinting(false);
        console.log(response);
      }
    }).catch((error) => {
      console.log(error);
    })
 
    /*const metadata = {
      name: attributes.name,
      symbol: attributes.symbol,
      creators: attributes.creators,
      description: attributes.description,
      sellerFeeBasisPoints: attributes.seller_fee_basis_points,
      image: attributes.image,
      animation_url: attributes.animation_url,
      attributes: attributes.attributes,
      external_url: attributes.external_url,
      properties: {
        files: attributes.properties.files,
        category: attributes.properties?.category,
      },
    };
    setStepsVisible(false);
    setMinting(true);

    try {
      const _nft = await mintNFT(
        connection,
        wallet,
        endpoint.name,
        files,
        metadata,
        setNFTcreateProgress,
        attributes.properties?.maxSupply,
      );

      if (_nft) setNft(_nft);
      setAlertMessage('');
    } catch (e: any) {
      setAlertMessage(e.message);
    } finally {
      setMinting(false);
    }*/
  };

  return (
    <>
      <Row className={'creator-base-page'} style={{ paddingTop: 50 }}>
        {stepsVisible && (
          <Col span={24} md={4}>
            <Steps
              progressDot
              direction={width < 768 ? 'horizontal' : 'vertical'}
              current={step}
              style={{
                width: '',
                margin: '0 auto 30px auto',
                overflowX: 'auto',
                maxWidth: '100%',
              }}
            >
              <Step title="Main Info" />
              <Step title="Royalties" />
              <Step title="Save" />
            </Steps>
          </Col>
        )}
        <Col span={24} {...(stepsVisible ? { md: 20 } : { md: 24 })}>
          {step === 0 && (
            <BasicStep
            attributes={attributes}
            setAttributes={setAttributes}
            files={files}
            setFiles={setFiles}
            confirm={() => gotoStep(1)}
          /> 
          )} 
          {step === 1 && (
            <RoyaltiesStep
              attributes={attributes}
              confirm={() => gotoStep(2)}
              setAttributes={setAttributes}
            />
          )}
         
          {step === 2 && (
            <WaitingStep
              mint={saveCollection}
              minting={isMinting}
              step={nftCreateProgress}
              confirm={() => gotoStep(3)}
            />
          )}
          {0 < step && step < 2 && (
            <div style={{ margin: 'auto', width: 'fit-content' }}>
              <Button onClick={() => gotoStep(step - 1)}>Back</Button>
            </div>
          )}
        </Col>
      </Row>
      <MetaplexOverlay visible={step === 3}>
        <Congrats nft={nft} urlHandle={attributes.UrlHandle} alert={alertMessage} />
      </MetaplexOverlay>
    </>
  );
};

const BasicStep = (props: {
  attributes: INftCollection;
  files: File[];
  setAttributes: (attr: INftCollection) => void;
  setFiles: (files: File[]) => void;
  confirm: () => void;
}) => {
  const [creators, setCreators] = useState<Array<UserValue>>([]);
  const [royalties, setRoyalties] = useState<Array<Royalty>>([]);
  const [coverFile, setCoverFile] = useState<File | undefined>(
    props.files?.[0],
  );
  const [mainFile, setMainFile] = useState<File | undefined>(props.files?.[1]);
  const [coverArtError, setCoverArtError] = useState<string>();

  const { image, animation_url } = useArtworkFiles(
    props.files,
    props.attributes,
  );
  const [form] = Form.useForm();

  const isShowUrlErrors = false;

  useEffect(() => {
    setRoyalties(
      creators.map(creator => ({
        creatorKey: creator.key,
        amount: Math.trunc(100 / creators.length),
      })),
    );
  }, [creators]);

  let urlHandleTimer;

  const checkUrlHandle = (e) => {
    const urlhandle = e.target.value;
    // Clears running timer and starts a new one each time the user types
    clearTimeout(urlHandleTimer);
    urlHandleTimer = setTimeout(() => {
        fetch('https://www.spendow.com/solapi/checkurlcode?urlCode='+urlhandle,  {
        method: 'GET'
      }).then((res) => res.json())
      .then(response => {
        //var input = document.querySelector('input[type="file"]')
        if (response.successCode == "unavailable") {
          console.log("no go we no fit");
        } else {
          props.setAttributes({
            ...props.attributes,
            UrlHandle: urlhandle,
          })
        }
      }).catch((error) => {
        console.log(error);
      })
    }, 1000);
 
    props.setAttributes({
      ...props.attributes,
      UrlHandle: urlhandle,
    })
  }

  return (
    <>
      <Row className="call-to-action">
        <h2>Describe your collection</h2>
        <p>
          Provide detailed description of your why people should buy in and engage with your NFT collection
        </p>
      </Row>
      <Row className="content-action">
        <Col className="section" md={16} style={{ minWidth: 300 }}>
          <label className="action-field">
            <span className="field-title">Name of Collection</span>
            <Input
              autoFocus
              className="input"
              placeholder="Max 50 characters"
              maxLength={50}
              allowClear
              value={props.attributes.Name}
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  Name: info.target.value,
                })
              }
            />
          </label>

          <label className="action-field">
            <span className="field-title">Detailed Description</span>
            <Input.TextArea
              className="input textarea"
              placeholder="Max 5000 characters"
              maxLength={5000}
              value={props.attributes.Description}
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  Description: info.target.value,
                })
              }
              allowClear
            />
          </label>

          <label className="action-field">
            <span className="field-title">Email Address of Owner</span>
             
            <Input
              autoFocus
              className="input"
              placeholder="Max 50 characters"
              maxLength={50}
              type="email"
              required={true}
              allowClear
              value={props.attributes.Email}
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  Email: info.target.value,
                })
              }
            />
          </label>

          <label className="action-field">
            <span className="field-title">Url Handle</span>
            <Input
              className="input"
              placeholder="Max 100 characters"
              maxLength={100}
              allowClear
              value={props.attributes.UrlHandle}
              /*onChange={info =>
                checkUrlHandle(info.target.value)
                props.setAttributes({
                  ...props.attributes,
                  UrlHandle: info.target.value,
                })
              }*/
              onChange={checkUrlHandle}
            />
            {isShowUrlErrors && (
              <Row>
                <Text type="danger" style={{ paddingBottom: 14 }}>
                  This URL Handle is already taken
                </Text>
              </Row>
            )}
          </label>
          <label className="action-field">
            <span className="field-title">Twitter</span>
            <Input
              className="input"
              placeholder="Max 100 characters"
              maxLength={100}
              allowClear
              value={props.attributes.Twitter}
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  Twitter: info.target.value,
                })
              }
            />
          </label>
          <label className="action-field">
            <span className="field-title">Telegram</span>
            <Input
              className="input"
              placeholder="Max 100 characters"
              maxLength={100}
              allowClear
              value={props.attributes.Telegram}
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  Telegram: info.target.value,
                })
              }
            />
          </label>
          <label className="action-field">
            <span className="field-title">Discord Link</span>
            <Input
              className="input"
              placeholder="Max 100 characters"
              maxLength={100}
              allowClear
              value={props.attributes.Discord}
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  Discord: info.target.value,
                })
              }
            />
          </label>
          <label className="action-field">
            <span className="field-title">Website (if you have one)</span>
            <Input
              className="input"
              placeholder="https://www.example.com"
              maxLength={100}
              allowClear
              value={props.attributes.Website}
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  Website: info.target.value,
                })
              }
            />
          </label>

          <label className="action-field">
            <span className="field-title">Total NFTs in Collection</span>
            <InputNumber
              placeholder="Number of NFTS to be minted"
              step={10}
              value={props.attributes.Total}
              onChange={(val: number) => {
                props.setAttributes({
                    ...props.attributes,
                    Total: val,
                });
              }}
              className="input"
            />
          </label>

          <Row className="action-field">
            <span className="field-title">Upload a cover image (PNG, JPG, GIF, SVG)</span>
            <Dragger
              accept=".png,.jpg,.gif,.mp4,.svg"
              style={{ padding: 20, background: 'rgba(255, 255, 255, 0.08)' }}
              multiple={false}
              onRemove={() => {
                setMainFile(undefined);
                setCoverFile(undefined);
              }}
              customRequest={info => {
                // dont upload files here, handled outside of the control
                info?.onSuccess?.({}, null as any);
              }}
              fileList={coverFile ? [coverFile as any] : []}
              onChange={async info => {
                const file = info.file.originFileObj; 
                if (!file) {
                  return;
                } 
                const sizeKB = file.size / 1024;

                if (sizeKB < 25) {
                  setCoverArtError(
                    `The file ${file.name} is too small. It is ${
                      Math.round(10 * sizeKB) / 10
                    }KB but should be at least 25KB.`,
                  );
                  return;
                }

                setCoverFile(file);
                setCoverArtError(undefined);
              }}
            >
              <div className="ant-upload-drag-icon">
                <h3 style={{ fontWeight: 700 }}>
                  Upload your cover image (PNG, JPG, GIF, SVG)
                </h3>
              </div>
              {coverArtError ? (
                <Text type="danger">{coverArtError}</Text>
              ) : (
                <p className="ant-upload-text" style={{ color: '#6d6d6d' }}>
                  Drag and drop, or click to browse
                </p>
              )}
            </Dragger>
          </Row> 
        </Col>
      </Row>

      <Row>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            form.validateFields().then(values => {
              const nftAttributes = values.attributes;
              // value is number if possible
              for (const nftAttribute of nftAttributes || []) {
                const newValue = Number(nftAttribute.value);
                if (!isNaN(newValue)) {
                  nftAttribute.value = newValue;
                }
              }
              console.log('Adding NFT attributes:', nftAttributes);
              props.setAttributes({
                ...props.attributes,
                Attributes: nftAttributes,
              });

              const files = [coverFile, mainFile].filter(f => f) as File[]; 
              props.setFiles(files); 
              props.confirm();
            });
          }}
          className="action-btn"
        >
          Continue to royalties
        </Button>
      </Row>
    </>
  );
};

interface Royalty {
  creatorKey: string;
  amount: number;
}

const useArtworkFiles = (files: File[], attributes: INftCollection) => {
  const [data, setData] = useState<{ image: string; animation_url: string }>({
    image: '',
    animation_url: '',
  });

  useEffect(() => {
    if (attributes.Image) {
      const file = files.find(f => f.name === attributes.Image);
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          setData((data: any) => {
            return {
              ...(data || {}),
              image: (event.target?.result as string) || '',
            };
          });
        };
        if (file) reader.readAsDataURL(file);
      }
    } 
  }, [files, attributes]);

  return data;
};
 
const RoyaltiesSplitter = (props: {
  creators: Array<UserValue>;
  royalties: Array<Royalty>;
  setRoyalties: Function;
  isShowErrors?: boolean;
}) => {
  return (
    <Col>
      <Row gutter={[0, 24]}>
        {props.creators.map((creator, idx) => {
          const royalty = props.royalties.find(
            royalty => royalty.creatorKey === creator.key,
          );
          if (!royalty) return null;

          const amt = royalty.amount;

          const handleChangeShare = (newAmt: number) => {
            props.setRoyalties(
              props.royalties.map(_royalty => {
                return {
                  ..._royalty,
                  amount:
                    _royalty.creatorKey === royalty.creatorKey
                      ? newAmt
                      : _royalty.amount,
                };
              }),
            );
          };

          return (
            <Col span={24} key={idx}>
              <Row
                align="middle"
                gutter={[0, 16]}
                style={{ margin: '5px auto' }}
              >
                <Col span={4} style={{ padding: 10 }}>
                  {creator.label}
                </Col>
                <Col span={3}>
                  <InputNumber<number>
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    value={amt}
                    parser={value => parseInt(value?.replace('%', '') ?? '0')}
                    onChange={handleChangeShare}
                    className="royalties-input"
                  />
                </Col>
                <Col span={4} style={{ paddingLeft: 12 }}>
                  <Slider value={amt} onChange={handleChangeShare} />
                </Col>
                {props.isShowErrors && amt === 0 && (
                  <Col style={{ paddingLeft: 12 }}>
                    <Text type="danger">
                      The split percentage for this creator cannot be 0%.
                    </Text>
                  </Col>
                )}
              </Row>
            </Col>
          );
        })}
      </Row>
    </Col>
  );
};

const RoyaltiesStep = (props: {
  attributes: INftCollection;
  setAttributes: (attr: INftCollection) => void;
  confirm: () => void;
}) => {
  // const file = props.attributes.image;
  const { publicKey, connected } = useWallet();
  const [creators, setCreators] = useState<Array<UserValue>>([]);
  const [fixedCreators, setFixedCreators] = useState<Array<UserValue>>([]);
  const [royalties, setRoyalties] = useState<Array<Royalty>>([]);
  const [totalRoyaltyShares, setTotalRoyaltiesShare] = useState<number>(0);
  const [showCreatorsModal, setShowCreatorsModal] = useState<boolean>(false);
  const [isShowErrors, setIsShowErrors] = useState<boolean>(false);

  useEffect(() => {
    if (publicKey) {
      const key = publicKey.toBase58();
      setFixedCreators([
        {
          key,
          label: shortenAddress(key),
          value: key,
        },
      ]);
    }
  }, [connected, setCreators]);

  useEffect(() => {
    setRoyalties(
      [...fixedCreators, ...creators].map(creator => ({
        creatorKey: creator.key,
        amount: Math.trunc(100 / [...fixedCreators, ...creators].length),
      })),
    );
  }, [creators, fixedCreators]);

  useEffect(() => {
    // When royalties changes, sum up all the amounts.
    const total = royalties.reduce((totalShares, royalty) => {
      return totalShares + royalty.amount;
    }, 0);

    setTotalRoyaltiesShare(total);
  }, [royalties]);

  return (
    <>
      <Row className="call-to-action" style={{ marginBottom: 20 }}>
        <h2>Set royalties and creator splits</h2>
        <p>
          Royalties ensure that you continue to get compensated for your work
          after its initial sale.
        </p>
      </Row>
      <Row className="content-action" style={{ marginBottom: 20 }}>
        <label className="action-field">
          <span className="field-title">Royalty Percentage</span>
          <p>
            This is how much of each secondary sale will be paid out to the
            creators.
          </p>
          <InputNumber
            autoFocus
            min={0}
            max={100}
            placeholder="Between 0 and 100"
            onChange={(val: number) => {
              props.setAttributes({
                ...props.attributes,
                SellerFeeBasisPoints: val * 100,
              });
            }}
            className="royalties-input"
          />
        </label>
      </Row>
      {[...fixedCreators, ...creators].length > 0 && (
        <Row>
          <label className="action-field" style={{ width: '100%' }}>
            <span className="field-title">Creators Split</span>
            <p>
              This is how much of the proceeds from the initial sale and any
              royalties will be split out amongst the creators.
            </p>
            <RoyaltiesSplitter
              creators={[...fixedCreators, ...creators]}
              royalties={royalties}
              setRoyalties={setRoyalties}
              isShowErrors={isShowErrors}
            />
          </label>
        </Row>
      )}
      <Row>
        <span
          onClick={() => setShowCreatorsModal(true)}
          style={{ padding: 10, marginBottom: 10 }}
        >
          <span
            style={{
              color: 'white',
              fontSize: 25,
              padding: '0px 8px 3px 8px',
              background: 'rgb(57, 57, 57)',
              borderRadius: '50%',
              marginRight: 5,
              verticalAlign: 'middle',
            }}
          >
            +
          </span>
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              verticalAlign: 'middle',
              lineHeight: 1,
            }}
          >
            Add another creator
          </span>
        </span>
        <MetaplexModal
          visible={showCreatorsModal}
          onCancel={() => setShowCreatorsModal(false)}
        >
          <label className="action-field" style={{ width: '100%' }}>
            <span className="field-title">Creators</span>
            <UserSearch setCreators={setCreators} />
          </label>
        </MetaplexModal>
      </Row>
      {isShowErrors && totalRoyaltyShares !== 100 && (
        <Row>
          <Text type="danger" style={{ paddingBottom: 14 }}>
            The split percentages for each creator must add up to 100%. Current
            total split percentage is {totalRoyaltyShares}%.
          </Text>
        </Row>
      )}
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            // Find all royalties that are invalid (0)
            const zeroedRoyalties = royalties.filter(
              royalty => royalty.amount === 0,
            );

            if (zeroedRoyalties.length !== 0 || totalRoyaltyShares !== 100) {
              // Contains a share that is 0 or total shares does not equal 100, show errors.
              setIsShowErrors(true);
              return;
            }

            const creatorStructs: Creator[] = [
              ...fixedCreators,
              ...creators,
            ].map(
              c =>
                new Creator({
                  address: c.value,
                  verified: c.value === publicKey?.toBase58(),
                  share:
                    royalties.find(r => r.creatorKey === c.value)?.amount ||
                    Math.round(100 / royalties.length),
                }),
            );

            const share = creatorStructs.reduce(
              (acc, el) => (acc += el.share),
              0,
            );
            if (share > 100 && creatorStructs.length) {
              creatorStructs[0].share -= share - 100;
            }
            props.setAttributes({
              ...props.attributes,
              Creators: creatorStructs,
            });
            props.confirm();
          }}
          className="action-btn"
        >
          Create Collection
        </Button>
      </Row>
    </>
  );
};

const WaitingStep = (props: {
  mint: Function;
  minting: boolean;
  confirm: Function;
  step: number;
}) => {
  useEffect(() => {
    const func = async () => {
      await props.mint();
      props.confirm();
    };
    func();
  }, []);

  const setIconForStep = (currentStep: number, componentStep) => {
    if (currentStep === componentStep) {
      return <LoadingOutlined />;
    }
    return null;
  };

  return (
    <div
      style={{
        marginTop: 70,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Spin size="large" />
      <Card>
        <Steps direction="vertical" current={props.step}>
          <Step
            className={'white-description'}
            title="Minting"
            description="Starting Mint Process"
            icon={setIconForStep(props.step, 0)}
          />
          <Step
            className={'white-description'}
            title="Preparing Assets"
            icon={setIconForStep(props.step, 1)}
          />
          <Step
            className={'white-description'}
            title="Signing Metadata Transaction"
            description="Approve the transaction from your wallet"
            icon={setIconForStep(props.step, 2)}
          />
          <Step
            className={'white-description'}
            title="Sending Transaction to Solana"
            description="This will take a few seconds."
            icon={setIconForStep(props.step, 3)}
          />
          <Step
            className={'white-description'}
            title="Waiting for Initial Confirmation"
            icon={setIconForStep(props.step, 4)}
          />
          <Step
            className={'white-description'}
            title="Waiting for Final Confirmation"
            icon={setIconForStep(props.step, 5)}
          />
          <Step
            className={'white-description'}
            title="Uploading to Arweave"
            icon={setIconForStep(props.step, 6)}
          />
          <Step
            className={'white-description'}
            title="Updating Metadata"
            icon={setIconForStep(props.step, 7)}
          />
          <Step
            className={'white-description'}
            title="Signing Token Transaction"
            description="Approve the final transaction from your wallet"
            icon={setIconForStep(props.step, 8)}
          />
        </Steps>
      </Card>
    </div>
  );
};

const Congrats = (props: {
  nft?: {
    metadataAccount: StringPublicKey;
  };
  alert?: string;
  urlHandle?: string;
}) => {
  const history = useHistory();

  const newTweetURL = () => {
    const params = {
      text: "I created a new NFT artwork on Spendow, check it out!",
      url: `${
        window.location.origin
      }/#/art/${props.nft?.metadataAccount.toString()}`,
      hashtags: 'NFT,Crypto,Spendow',
      // via: "Metaplex",
      related: 'Spendow,Solana',
    };
    const queryParams = new URLSearchParams(params).toString();
    return `https://twitter.com/intent/tweet?${queryParams}`;
  };

  if (props.alert) {
    // TODO  - properly reset this components state on error
    return (
      <>
        <div className="waiting-title">Sorry, there was an error!</div>
        <p>{props.alert}</p>
        <Button onClick={_ => history.push('/art/create/collection')}>
          Back to Create NFT
        </Button>
      </>
    );
  }

  return (
    <>
      <div className="waiting-title">Congratulations, you've created an NFT collection!</div>
      <div className="congrats-button-container">
        <Button
          className="metaplex-button"
          onClick={_ =>
            history.push(`/collection/${props.urlHandle?.toString()}`)
          }
        >
          <span>Start adding NFTs to this collection</span>
        </Button>
      </div>
      <Confetti />
    </>
  );
};
