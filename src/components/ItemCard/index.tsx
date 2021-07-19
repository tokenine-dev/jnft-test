import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { LazyLoad } from 'components/LazyLoad';
import { firestore } from 'libs/firebase-sdk';
import { CountdownTimerDisplay } from 'components/Timer'

export function ItemCard ({ data }: any) {
  const { page, item, id } = data
  const [ itemData, setItemData ] = useState(item)
  const [ isLoading, setIsLoading ] = useState(true)
  const [ isError, setIsError ] = useState(false)
  const [ isVisible, setIsVisible ] = useState(false)

  const handleVisible = () => {
        if (id) {
            loadWorkItem(id)
            .then((data_: any) => {
                setItemData(data_)
                setIsLoading(false)
            })
        }
  }

  return (<>
        {/* <span>{ id }</span> */}
        <div id={`${page.id}-${id}`} key={`${page.id}-${id}`} className={`item-card ${ isLoading ? '_loading' : ''}`}>
            <LazyLoad onVisible={handleVisible}>
                <Link to={`/detail/${id}`}>
                    <div className="cover-art">
                        <figure>
                            <img src={itemData?.resource?.thumbnail_256} alt="" />
                        </figure>
                    </div>
                    <div className="title-art">
                        <h3>
                            {itemData?.name}
                        </h3>
                        <div className={`_pricetag ${itemData?.price ? "_active" : ""}`}>
                            {
                                itemData?.price
                                ? (<>
                                    {
                                        itemData?.sellingType === "OFFERING" &&
                                        (<>
                                            {
                                                itemData?.sellingTime && (<>
                                                    {
                                                        itemData?.sellingTime.startTime * 1000 > new Date().getTime()
                                                        ? (<>
                                                            <div className="_price"><span className="_title">Reserve Price</span> <PriceDisplay data={itemData} /></div>
                                                            <div className={`timer ${itemData?.sellingTime.startTime * 1000 > new Date().getTime() ? "_active" : ""}`}>
                                                                    <CountdownTimerDisplay epoch={itemData?.sellingTime?.startTime} type="starting" size="mini" />
                                                            </div>
                                                        </>) : (<>
                                                            <div>
                                                                Buy with <PriceDisplay data={itemData} />
                                                            </div>
                                                        </>)
                                                    }
                                                </>)
                                            }
                                        </>)
                                    }
                                </>) : (<>
                                    <div>Follow</div>
                                </>)
                            }
                        </div>
                    </div>
                </Link>
            </LazyLoad>
        </div>
  </>)
}

export default ItemCard


export async function loadWorkItem (id: string) {
    try {
        const docRef = firestore.collection("works").doc(id)

        docRef.onSnapshot((doc) => {
             console.log("Current data: ", doc.data());
        })

        const doc = await docRef.get()
        if (doc.exists) {
             const data = doc.data()
             return data
        }
        return []

   } catch (error) {
        console.error(error)
   }
}

/* 

*/
export const PriceDisplay = ({ data, handlers }: any) => {
    const { price, sellingType } = data
    const { amount, currencyToken } = price
    const decimalLength = amount.length > currencyToken.decimals + 9 ? 0 : 2

    const formatPrice = (parseInt(amount) / (10 ** currencyToken.decimals)).toFixed(decimalLength).toString()

    return (<>
        <div className="price-display">
            {
                sellingType !== "PENDING"
                    ? (<>{ formatPrice } { currencyToken.symbol }</>)
                    : "View Artwork"
            }
            {/* {
                sellingType 
                && sellingType === -1
                    ? "To see price, please setup MetaMask first"
                    : sellingType > 0
                        ? (<>{ formatPrice } { currencyToken.symbol}</>)
                        : "Not on sell"
            } */}
        </div>
    </>)
}