import React from "react";
import { Link } from "react-router-dom";

type Props = {
  data?: any;
  workID?: string;
  newBidPrice?: string;
  onSetNewBidPrice?: React.ChangeEventHandler<HTMLInputElement>;
  onUpdateBidPrice?: React.MouseEventHandler<HTMLButtonElement>;
};

const ItemSetBid = ({
  data,
  workID,
  newBidPrice,
  onSetNewBidPrice,
  onUpdateBidPrice,
}: Props) => {
  const dataDetail = data?.data;

  return (
    <>
      <div className="max-w-screen-xl mx-auto hero-body flex items-center text-white mt-0 md:my-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
          <div className="custom:grid-gallery">
            <Link to="#" className="w-full block">
              <div className="custom:grid-gallery-wrap">
                <figure className="custom:photo-art-cover">
                  <img src={dataDetail?.resource.origin} alt="" />
                </figure>
              </div>
            </Link>
            <div className="custom:wrap-content-heightlight">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl leading-none font-extrabold text-gray-900 tracking-tight mb-8 pt-6">
                {dataDetail?.name}
              </h1>
              <div className="text-gray-900 mb-4">
                <span className="block">Set bid price</span>
                <div className="inline-flex items-center">
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
                    className="w-full flex-none text-base leading-6 font-normal py-3 px-2 border-2 border-gray-900 hover:border-gray-900 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200 block"
                  />
                </div>
                <span className="block text-base text-gray-400">
                  ≈ $540.0490
                </span>
                {/* <span className="block pt-4 text-base">
                Amount：<b>1</b>
              </span> */}
              </div>
              <div>
                <div className="items-center custom-ui mt-8">
                  <div className="rounded">
                    {/* <Link to={`/detail/${workID}`}> */}
                    <button
                      className="w-full inline-flex justify-center bg-gray-900 hover:bg-gray-700 text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200"
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
                      <span className="ml-2">
                        {/* {walletAddress ? "Set Bid" : "Connect to Wallet"} */}
                        {"Set Auction"}
                      </span>
                    </button>
                    {/* </Link> */}
                  </div>
                </div>
              </div>
              {/* Creater */}
              <div id="creator">
                <h3 className="custom:title-creators text-3xl mt-8 pt-8 pb-2">
                  Creator
                </h3>
                <Link to="/profile/xxxxxxxxx" className="inline-block ml-1">
                  <div className="flex items-center font-semibold text-gray-900">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <img
                        src="https://scontent.fkkc3-1.fna.fbcdn.net/v/t1.6435-9/122897061_3625276570885053_307056077346322870_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=174925&_nc_eui2=AeE2iSlSwutWsZsPddvFefltmLeL0W8S5aeYt4vRbxLlp144H-ZJtv_hLx1x5FNcV5z2F1Qmn4fqV3eNlNbz1kPz&_nc_ohc=o0OzIbN8AG4AX9HtO-g&_nc_ht=scontent.fkkc3-1.fna&oh=3a029a7a40005b64acbf1c0fa3b9df14&oe=60B92D2D"
                        alt=""
                        className="mr-4 w-12 h-12 rounded-full"
                      />
                    </div>
                    <div className="flex-auto">
                      <span className="text-xl block">Homesawan Umansap</span>
                      <span className="text-gray-500 font-normal mt-">
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

export default ItemSetBid;
