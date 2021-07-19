import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
//
import { GET } from "api";
import { bidPrice } from "modules/bid";
//
import { ItemSetBid, Label } from "components";
//
const CreateBid = () => {
  const [detail, setDetail] = useState(null);
  const [newBidPrice, setNewBidPrice] = useState("");

  const id = Object(useParams()).id;
  const { onSetCurrentPrice, onUpdateBidPrice } = bidPrice();

  useEffect(() => {
    getDetail();
  }, [detail !== null]);

  const handleSetNewBidPrice = (event: any) => {
    setNewBidPrice(event.target.value);
  };

  /**
   * function handleUpdateBidPrice
   * For update bid price on contract
   *
   * @param _tokenId int
   * @param _price wei
   *
   */

  const handleUpdateBidPrice = async () => {
    
    if (parseFloat(newBidPrice) > 0 && detail) {
      // @ts-ignore
      const _tokenId = detail?.tokenId;
      if (_tokenId) {
        const _price = parseFloat(newBidPrice);
        const tx = await onUpdateBidPrice(_tokenId, _price);
        console.log("transaction", tx);
      } else {
        console.log(`Don't have a tokenId`)
      }
    }
  };

  /**
   * function handleUpdateBidPriceOnWork
   * For update bid price on work
   *
   * @param _tokenId int
   * @param _price bnb
   *
   */
  const handleUpdateBidPriceOnWork = async () => {
    const _tokenId = 1;
    const _price = 1;
    //
  };

  async function getDetail() {
    try {
      let detail = await GET(`/getwork?id=${id}`);
      setDetail(detail);
    } catch (error) {
      console.log(`error`, error);
    }
  }
  console.log("detail", detail);
  return (
    <>
      <div className="min-h-screen">
        <div className="custom:height-full-screen flex items-stretch flex-col">
          {/* <Navbar /> */}
          <ItemSetBid
            data={detail}
            workID={id}
            newBidPrice={newBidPrice}
            onSetNewBidPrice={handleSetNewBidPrice}
            onUpdateBidPrice={handleUpdateBidPrice}
          />
          <div id="data">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
              <div className="main">
                <Label
                  title={"Contemporary Information"}
                  linkName={"Share"}
                  labelStyle={
                    "text-base font-normal rounded-lg bg-gray-100 text-black py-3 text-center cursor-pointer px-3"
                  }
                />
                {/* <!-- END  --> */}
                <div
                  id="present-data-items"
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="overflow-scroll">
                    <div className="table-of-content">
                      <table className="custom:w-3/4">
                        <tbody>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              id :
                            </th>
                            <td className="font-semibold text-right">
                              <div>42567</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              Block Number
                            </th>
                            <td className="font-semibold text-right">
                              <div>6720069</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              accent_color :
                            </th>
                            <td className="font-semibold text-right">
                              <div>water leaf</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              ears :
                            </th>
                            <td className="font-semibold text-right">
                              <div>rabbits</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              eye_shape :
                            </th>
                            <td className="font-semibold text-right">
                              <div>shy</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              highlight_color :
                            </th>
                            <td className="font-semibold text-right">
                              <div>viking</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              pattern :
                            </th>
                            <td className="font-semibold text-right">
                              <div>spaark</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              unknown1 :
                            </th>
                            <td className="font-semibold text-right">
                              <div>unknown</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              birthday :
                            </th>
                            <td className="font-semibold text-right">
                              <div>1618889732</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              generation :
                            </th>
                            <td className="font-semibold text-right">
                              <div>19</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              able to breed :
                            </th>
                            <td className="font-semibold text-right">
                              <div>1620179677</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* <!-- END Column --> */}
                  <div className="overflow-scroll">
                    <div className="table-of-content">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              Create Time :
                            </th>
                            <td className="font-semibold text-right">
                              <div>2021-04-20 10:35:32</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              Owner :
                            </th>
                            <td className="font-semibold text-right">
                              <div>
                                0x9e829f7242a4b3a3cf2cb0288347eb7e34fbfbde
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              base_color :
                            </th>
                            <td className="font-semibold text-right">
                              <div>tea green</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              eye_color :
                            </th>
                            <td className="font-semibold text-right">
                              <div>cinnabar</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              hairs :
                            </th>
                            <td className="font-semibold text-right">
                              <div>wind wings</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              mouth :
                            </th>
                            <td className="font-semibold text-right">
                              <div>singing</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              tail :
                            </th>
                            <td className="font-semibold text-right">
                              <div>snowball</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              unknown2 :
                            </th>
                            <td className="font-semibold text-right">
                              <div>unknown</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              energy :
                            </th>
                            <td className="font-semibold text-right">
                              <div>4224</div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              scope="row"
                              className="font-normal text-left text-gray-500"
                            >
                              breeding fee :
                            </th>
                            <td className="font-semibold text-right">
                              <div>48</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* <!--  END ID present-art-items --> */}
              </div>
            </div>
          </div>
          {/* END Information */}
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
};

export default CreateBid;
