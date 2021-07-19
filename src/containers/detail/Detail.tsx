/* 

  TODO:
  - Add Click to Copy on Work ID
*/

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { IWorkDetail, IWorkCreator } from "./types"
import { firestore } from 'libs/firebase-sdk';

// import { GET } from 'api';

import { ItemDetail, Label/* , Loading */ } from 'components';
import { LoadingScreen } from 'components/Loader'
import { WalletAddressCensor, Time } from 'utils/display'
import { safeAddress } from 'utils/contract';
import { FallbackLoading, FallbackWorkIsNotAvailable } from 'components/Fallbacks';

import './detail.css';
import { useDAppContext } from 'providers/dapp';

export default function Detail() {
    const { account } = useDAppContext()
    const id = Object(useParams()).id;

    const [isLoading, setIsLoading] = useState(true)
    const [detail, setDetail] = useState<IWorkDetail | null>(null)
    const [creator, setCreator] = useState<IWorkCreator | null>(null)

    const handleDataChange = (doc: any) => {
        const _data = doc.data()
        setDetail(_data)
        console.log("Data changed, Current data: ", _data)
    }

    useEffect(() => {
        getDetail(id)
    }, [])

    async function getDetail(_id: string) {
        try {
            const doc = firestore.collection("works").doc(_id)
            
            // Subscribe on data changed - get realtime updates
            doc.onSnapshot(handleDataChange)

            const _doc = await doc.get()
            if (_doc.exists) {
                setDetail(_doc.data() as IWorkDetail)
            }
        } catch (e) {
                console.error("getDetail", e)
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 200)
        }
        // try {
            
        //     let { data: detail } = await GET(`/getwork?id=${id}`)
        //     if (!detail) { throw { message: "work not found" } }
        //     setDetail(detail)
        //     console.log(detail)
        //     let { data: _creator } = await GET(`/getuser?id=${detail.creator}`)
        //     setCreator(_creator)

        // } catch (error) {
        //     console.log(`error`, error);
        // } finally {
        //     setTimeout(() => {
        //         setIsLoading(false)
        //     }, 200)
        // }
    }

    return (
        <>
            <LoadingScreen isLoading={isLoading} />
            <div className="page">
            {
                detail
                ? detail.isApproved
                    ? (<>
                            <ItemDetail data={detail} workID={id} />
                            {/* <InformationDisplay detail={detail} /> */}
                            {/* <div id="data">
                                <div className="body-container">
                                    <div className="body-wrapper">
                                        <div id="present-data-history" className="body-wrapper-content __detail" >
                                            <BidHistoryDisplay />
                                            <CreatorDisplay />
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </>
                    )
                    : safeAddress(detail.owner) === safeAddress(account)
                        ? (<>
                            <ItemDetail data={detail} workID={id} />
                                {/* <InformationDisplay detail={detail} /> */}
                                {/* <div id="data">
                                    <div className="body-container">
                                        <div className="body-wrapper">
                                            <div id="present-data-history" className="body-wrapper-content __detail" >
                                                <BidHistoryDisplay />
                                                <CreatorDisplay />
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </>
                        )
                    : (<>
                        <FallbackWorkIsNotAvailable />
                    </>)
                : (<>
                    <FallbackLoading />
                </>)
            }
            </div>
        </>
    );
}

const InformationDisplay = (props: any) => {
    const { detail } = props

    return (
        <div id="data">
            <div className="body-container">
                <div className="body-wrapper">
                    <Label
                        title={"Information"}
                        linkName={"Share"}
                        labelStyle={
                            "link"
                        }
                    />
                    <div id="present-data-items" className="body-wrapper-content __detail">
                        <div className="body-content">
                            <div className="table-content __row">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th scope="row">
                                                ID :
                                            </th>
                                            <td>
                                                <div>{detail.id.substr(0, 8)}...{detail.id.substr(24, 12)}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" >
                                                Block Number
                                            </th>
                                            <td>
                                                <div>{detail.blockNumber || "Unknown"}</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="body-content">
                            <div className="table-content __row">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th scope="row" >
                                                Create Time :
                                            </th>
                                            <td>
                                                <div>{Time(detail.createAt._seconds * 1000)}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">
                                                Seller :
                                            </th>
                                            <td>
                                                <div>
                                                    {WalletAddressCensor(detail.seller)}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const BidHistoryDisplay = () => {

    const bidHistoryData = [
        {
            profile: 'https://images.unsplash.com/profile-1617002849453-b8d9b7457f7cimage?dpr=1&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff',
            username: '@annamcnaughty',
            price_bnb: 1,
            price_usd: 3590.65,
            date_time: 'May 3, 2021 at 3:45am'
        },
        {
            profile: 'https://images.unsplash.com/profile-1540512287548-b93caecf9903?dpr=1&auto=format&fit=crop&w=64&h=64&q=60&crop=faces&bg=fff',
            username: '@chris_ainsworth22',
            price_bnb: 3,
            price_usd: 1590,
            date_time: 'May 3, 2021 at 3:45am'
        },
        {
            profile: 'https://images.japan-experience.com/guide-japon/2795/s380x280/doraemon.jpg',
            username: '@doradora_mon',
            price_bnb: 6,
            price_usd: 7500,
            date_time: 'May 5, 2021 at 11:54am'
        }
    ]

    return (
        <div>
            <Label title={"History"} />
            {
                bidHistoryData?.map((el) => (
                    <div id="history-bid" className="history-content">
                        <div className="history-detail">
                            <div className="history-detail-profile">
                                <img
                                    src={el.profile}
                                    alt=""
                                />
                            </div>
                            <div className="history-detail-description">
                                <span className="txt-black __block">
                                    Auction settled by
                                    <span >
                                        <a href="" >
                                            {el.username}
                                        </a>
                                    </span>
                                </span>
                                <span className="txt-gray">
                                    {el.date_time}
                                </span>
                            </div>
                        </div>
                        <div id="display-price" className="history-price">
                            <span className="txt-black __block __f-semi">
                                {el.price_bnb.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="txt-gray __block">${el.price_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

const CreatorDisplay = () => {
    return (
        <div id="creator-display" className='creator-container'>
            <Label title={"Creator"} />
            <a href="" className="creator-wrapper">
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
            </a>
            <p className="creator-bio">
                ห่มสวรรค์ อู่ม่านทรัพย์ จบการศึกษาจากวิทยาลัยช่างศิลป
                กรมศิลปากร ลาดกระบัง, ระดับปริญญาตรีและโท
                สาขาศิลปไทยจากคณะจิตรกรรม ประติมากรรมและภาพพิมพ์ ฯ
                มหาวิทยาลัยศิลปากร ปัจจุบัน กําลังศึกษาต่อระดับดุษฎีบัณฑิต
                ที่ภาควิชาทัศนศิลป์ คณะจิตรกรรม ประติมากรรมและภาพพิมพ์ฯ
                มหาวิทยาลัยศิลปากร
            </p>
        </div>
    )
}

