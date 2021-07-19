import React from "react";
import { Link } from "react-router-dom";

type Props = {
  data?: any;
  workID?: string;
  newBidPrice?: string;
  onSetNewBidPrice?: React.ChangeEventHandler<HTMLInputElement>;
  onUpdateBidPrice?: React.MouseEventHandler<HTMLButtonElement>;
};

const ItemPlaceBid = ({
  data,
  workID,
  newBidPrice,
  onSetNewBidPrice,
  onUpdateBidPrice,
}: Props) => {
  const dataDetail = data?.data;

  return (
    <>
      <div id="item-placebid" className="item-container">
        <div className="item-wrapper">
          <div className="item-wrapper-content">
            <Link to="#" id="gallery-placebid" className="gallery-container">
              <div className="gallery-wrapper">
                <figure className="gallery-wrapper-content">
                  <img src={dataDetail?.resource.origin} alt="" />
                </figure>
              </div>
            </Link>
            <div className="item-content">
              <h1>
                {dataDetail?.name}
              </h1>
              <p>
                <span >Place bid</span>
                <div id="field-placebid" className="field-content">
                  {/* <span className="block text-2xl py-2 sm:text-3xl">
                  {dataDetail?.price}
                </span> */}
                  <input
                    onChange={onSetNewBidPrice}
                    required
                    placeholder="bid price"
                    type="text"
                    id="name"
                    name="name"
                    value={newBidPrice}
                    className="field-input"
                  />
                </div>
                <span className="detail-around">
                  ≈ $540.0490
                </span>
                {/* <span className="block pt-4 text-base">
                Amount：<b>1</b>
              </span> */}
              </p>
              <div>
                <div id="button-placebid" className="button-group">
                  <div className="button-group-content">
                    {/* <Link to={`/detail/${workID}`}> */}
                    <button
                      className="btn-default __icon"
                      onClick={onUpdateBidPrice}
                    >
                      <svg
                        className="w-4"
                        viewBox="0 0 40 53"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        href="http://www.w3.org/1999/xlink"
                      >
                        <g
                          id="Page-1"
                          stroke="none"
                          strokeWidth="1"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <g id="unlock" fill="#FFFFFF" fillRule="nonzero">
                            <path
                              d="M36.9230769,22.0082051 L36.9230769,16.9230769 C36.9230769,7.59169231 29.3313846,0 20,0 C10.6686154,0 3.07692308,7.59169231 3.07692308,16.9230769 L3.07692308,22.0082051 C1.28625641,22.6432821 0,24.3533333 0,26.3589744 L0,32.5128205 C0,43.5408205 8.972,52.5128205 20,52.5128205 C31.028,52.5128205 40,43.5408205 40,32.5128205 L40,26.3589744 C40,24.3533333 38.7137436,22.6432821 36.9230769,22.0082051 Z M6.15384615,16.9230769 C6.15384615,9.28830769 12.3652308,3.05641026 20,3.05641026 C27.6347692,3.05641026 33.8461538,9.28830769 33.8461538,16.9230769 L33.8461538,21.7435897 L30.7692308,21.7435897 L30.7692308,16.9230769 C30.7692308,10.9849231 25.9381538,6.15384615 20,6.15384615 C14.0618462,6.15384615 9.23076923,10.9849231 9.23076923,16.9230769 L9.23076923,21.7435897 L6.15384615,21.7435897 L6.15384615,16.9230769 Z M27.6923077,16.9230769 L27.6923077,21.7435897 L12.3076923,21.7435897 L12.3076923,16.9230769 C12.3076923,12.6815385 15.7584615,9.21025641 20,9.21025641 C24.2415385,9.21025641 27.6923077,12.6815385 27.6923077,16.9230769 Z M36.9230769,32.5128205 C36.9230769,41.8442051 29.3313846,49.4564103 20,49.4564103 C10.6686154,49.4564103 3.07692308,41.8442051 3.07692308,32.5128205 L3.07692308,26.3589744 C3.07692308,25.5106667 3.76707692,24.8205128 4.61538462,24.8205128 L35.3846154,24.8205128 C36.2329231,24.8205128 36.9230769,25.5106667 36.9230769,26.3589744 L36.9230769,32.5128205 Z"
                              id="Shape"
                            ></path>
                            <path
                              d="M20,27.8974359 C17.4550769,27.8974359 15.3846154,29.9678974 15.3846154,32.5128205 C15.3846154,34.5184615 16.6708718,36.2285128 18.4615385,36.8635897 L18.4615385,41.7435897 C18.4615385,42.5932308 19.150359,43.2820513 20,43.2820513 C20.849641,43.2820513 21.5384615,42.5932308 21.5384615,41.7435897 L21.5384615,36.8635897 C23.3291282,36.2285128 24.6153846,34.5184615 24.6153846,32.5128205 C24.6153846,29.9678974 22.5449231,27.8974359 20,27.8974359 Z M20,34.0512821 C19.1516923,34.0512821 18.4615385,33.3611282 18.4615385,32.5128205 C18.4615385,31.6645128 19.1516923,30.974359 20,30.974359 C20.8483077,30.974359 21.5384615,31.6645128 21.5384615,32.5128205 C21.5384615,33.3611282 20.8483077,34.0512821 20,34.0512821 Z"
                              id="Shape"
                            ></path>
                          </g>
                        </g>
                      </svg>
                      <span>
                        {/* {walletAddress ? "Set Bid" : "Connect to Wallet"} */}
                        {"Place Bid"}
                      </span>
                    </button>
                    {/* </Link> */}
                  </div>
                </div>
              </div>
              {/* Creater */}
              <div id="creator-container-placebid" className="creator-container">
                <h3 >
                  Creator
                </h3>
                <Link to="/profile/xxxxxxxxx" className="creator-wrapper">
                  <div className="creator-content">
                    <div className="creator-profile">
                      <img
                        src="https://i.pinimg.com/736x/ca/1c/fa/ca1cfab793b853a5b7cb63ebe11c32cb.jpg"
                        alt=""
                      />
                    </div>
                    <div className="creator-detail">
                      <span className="text __txt-name">Homesawan Umansap</span>
                      <span className="text __txt-at">
                        @Homesawan
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemPlaceBid;
