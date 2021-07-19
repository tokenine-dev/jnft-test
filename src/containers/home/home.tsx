import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import { ItemShow, ItemFeeds, ItemArtist } from 'components'
import { ICreator, IWork } from 'types';
import { firestore } from 'libs/firebase-sdk';
import { LoadingScreen } from 'components/Loader';
import { Label } from 'components';
import { Slide } from 'react-slideshow-image';
import { GET } from 'api';
// import Coverflow from 'react-coverflow';

const debugable = false
const pageid = "home"


export default function Home() {
     
     const [ isDebugging, setDebugging ] = useState(debugable)
     const [ isPageReload, setPageReload ] = useState(true)
     const [ isLoading, setLoading ] = useState(true);
     
     const [ heroes, setHeroes ] = useState<IWork[]>([])
     const [ recentWorks, setRecentWorks ] = useState<IWork[]>([])
     const [ selectedArtist, setSelectedArtist ] = useState<ICreator[]>([])
     const [ selectedItem, setSelectedItem ] = useState("")

     // Things to do everytime this page is reload or re-mount
     useEffect(() => {
          setPageReload(false);

          (async () => {
               let _healthcheck = await GET("/healthcheck");
               console.log("HEALTH CHECK", _healthcheck)
          })()
     })

     useEffect(() => {
          (async () => {

               const list = await getSelectedCreatorIndex() as any
               const _creators: ICreator[] | undefined[] = []
               for (let key of list) {
                    const work = await getSelectedCreatorItem(key)
                    // @ts-ignore 
                    if (work) { _creators.push(work) }
               }
               // @ts-ignore 
               setSelectedArtist(_creators)
          })()
          return () => setSelectedArtist([])
     }, [isPageReload])

     // const getSelectedCreatorIndex = async () => {
     //      try {
     //           const doc = await firestore.collection('users_index').doc('selected-creator').get()
     //           const index = doc.data()
     //           if (doc.exists) {
     //                const list = (index as any).list
     //                const sortedList = Object.keys(list).sort((a: any, b: any) => a.nanoseconds - b.nanoseconds)
     //                return sortedList
     //           }
     //           return []
     //      } catch (error) {
     //           console.error("getSelectedCreatorIndex", error)
     //      }
     // }

     // const getSelectedCreatorItem = async (id: string) => {
     //      try {
     //           const doc = await firestore.collection("users").doc(id).get()
     //           const creator = doc.data()
     //           if (doc.exists) {
     //                return creator
     //           }
     //           return
     //      } catch (e) {
     //           console.error("getSelectedCreatorItem", e)
     //      }
     // }

     const pageState = { isDebugging, isPageReload, setPageReload, isLoading, setLoading }

     return (<div className="page">
          { isLoading && <LoadingScreen isLoading={isLoading} />}
          <HeroesDisplay pageState={pageState} />
          {/* <ItemShow heroes={heroes} /> */}
          {/* <ItemArtist selectedArtist={selectedArtist} /> */}
          <SelectedArtistsDisplay pageState={pageState} />
          <FeaturedArtistsDisplay pageState={pageState} />
          <RecentWorksDisplay pageState={pageState} titleLabel="New Arrival" titleLinkLabel="View All" selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
          <FeaturedWorksDisplay pageState={pageState} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
          {/* <ItemFeeds labelTitle={'New Arrival'} labelLinkname={'View all artworks'} works={recentWorks} /> */}
          { debugable && <button onClick={() => setDebugging(!isDebugging)}>Debug {`${isDebugging ? "On": "Off"}`}</button> }
     </div>);
}

export const HeroesDisplay = ({ pageState }: any) => {

     const [ data, setData ] = useState<any>({});
     const dataRef = useRef(data);
     const [ isFetching, setFetching ] = useState(false)
     const { isDebugging, isPageReload, setPageReload, isLoading, setLoading } = pageState
     
     dataRef.current = data
     useEffect(() => {
          if (isPageReload) {
               (async () => {
                    const list = await getWorkIndex("heroes") as any
                    const displayFirstItemsCount = 1;
     
                    for (let [i, _item] of list.entries()) {
                         // console.log(i, _item, data[_item.id], dataRef.current)
                         // TODO: Add skip for what's loaded
                         if (!dataRef.current[_item.id] && _item.isActive) {
                              // See if item will be loaded (and not reload again)
                              console.log("Loading...", _item.id)

                              // See all item in order, its list's data, the data that was setted, and whole data object.
                              // console.log(i, _item, data[_item.id], data, dataRef.current)
                              let _itemData: any = null
                              if (_item.type === "works") { _itemData = await getWorkItem(_item.id) }
                              if (_item.type === "billboards") { _itemData = await getBillboardItem(_item.id) }

                              // See item Data
                              console.log(_item.id, _item, _itemData)
                              if (_itemData &&
                                   (
                                        (_item.type === "works" && _itemData.isApproved)
                                        || (_item.type === "billboards")
                                   )
                              ) {
                                   // Check if item pass the criteria and will be setted.
                                   console.log(_item.id, "will be setted")
                                   setData({ ...dataRef.current, [_item.id]: { ..._item, ..._itemData } })
                              } else {
                                   console.log("Failed to load data of item", _item.id, `because it's does not approved or exists`)
                              }
                              if (i < displayFirstItemsCount) {
                                   setLoading(false)
                              }
                         } else {
                              // See if item wasn't load
                              console.log("Failed to load", _item.id, `because it's ${!_item.isActive ? "set to inactive," : ""}${dataRef.current[_item.id] ? "already loadad" : ""}`)
                         }
                    }
               })()
               setTimeout(() => {
                    if (isLoading) { setLoading(false) }
               }, 500)
          }
     }, [ isPageReload ])

     const handleRefresh = () => {
          setPageReload(true)
     }

     const handleOnSlideChange = (oldIndex: number, newIndex: number) => {
          // console.log(oldIndex, newIndex)
     }

     const slideConfigs = {
          duration: 2000,
          transitionDuration: 200,
          canSwipe: true,
          pauseOnHover: true,
          onChange: handleOnSlideChange
     }

     const slides = Object.keys(data)
          .map(key => data[key])
          .filter((item: any) => item.isApproved)
          .map((item: any, index) => (
               <HeroesItemDisplay item={item} index={index} key={item.id} pageState={pageState} />
          ))

     pageState.isDebugging && console.log("Re-rendering:", `isPageReload ${isPageReload}`, `isLoading ${isLoading}`)

     return (<>
          <div className="heroes-display">   
          { 
               data
               ? (<>
               {
                    pageState.isDebugging &&
                    Object.keys(data).map(key => (<div key={key}><span >{ key }</span><br/></div>))
               }
               {
                    <Slide {...slideConfigs} >
                         {slides}
                    </Slide >
               }
               </>)
               : (<>
                    { // TODO: Improve displaying for No Data
                    }
                    <div>No Data</div>
               </>) 
          }

          </div>
          { // Debugging only
               pageState.isDebugging &&
               (<button onClick={handleRefresh}>Refresh </button>)
          }
     </>)
}

export const HeroesItemDisplay = (props: any) => {
     const { item, pageState } = props
     const { type } = item

     pageState.isDebugging && console.log("HeroesItemDisplay", item)

     return (<>
          <div>
               { pageState.isDebugging && (<span>{ item.type } { item.id } { item.createAt ? `@ ${item.createAt.seconds}` : "" }</span>) }
               { type
                    ? (
                         (type === "works" && (<SlideWorks data={item} />))
                         || (type === "billboards" && (<SlideBillboards data={item} />))
                         || (type === "contents" && (<SlideContents data={item} />))
                    )
                    : <SlideDefault data={item} />
               }
          </div>
     </>)
}


const SlideDefault = ({ data: el }: any) => {
     return (
         <div className="item-container slide-show">
             <div className="item-wrapper">
                 <div className="item-wrapper-content">
                     <Link className="gallery-container" to={`detail/${el.id}`}>
                         <div className="gallery-wrapper">
                             <figure className="gallery-wrapper-content">
                                 <img src={el.resource.origin} alt="" />
                             </figure>
                         </div>
                     </Link>
                     <div className="item-content">
                         <h1>{el.name}</h1>
                         <p>
                             <span>Current price</span>
                             <span className="detail-price">{el.price} BNB</span>
                             <span className="detail-around">≈ $540.0490</span>
                         </p>
                         <div>
                             <div className="button-group">
                                 <div className="button-group-content">
                                     <Link to={`detail/${el.id}`} className="btn-art" >
                                         View artwork
                                     </Link>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     )
 }

const SlideContents = ({ data: el }: any) => {
     return (
         <div className="item-container slide-show">
             {/* <div className="item-wrapper">
                 <div className="item-wrapper-content">
                     <Link className="gallery-container" to={`detail/${el.id}`}>
                         <div className="gallery-wrapper">
                             <figure className="gallery-wrapper-content">
                                 <img src={el.resource.origin} alt="" />
                             </figure>
                         </div>
                     </Link>
                     <div className="item-content">
                         <h1>{el.name}</h1>
                         <p>
                             <span>Current price</span>
                             <span className="detail-price">{el.price} BNB</span>
                             <span className="detail-around">≈ $540.0490</span>
                         </p>
                         <div>
                             <div className="button-group">
                                 <div className="button-group-content">
                                     <Link to={`detail/${el.id}`} className="btn-art" >
                                         View artwork
                                     </Link>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div> */}
         </div>
     )
}

const SlideBillboards = ({ data }: any) => {
     const htmlContent = { __html: data.content }

     return (
         <div className="slide-show _billboard">
              <div dangerouslySetInnerHTML={htmlContent} />
             {/* 
               <div className="item-wrapper">
                 <div className="item-wrapper-content">
                     <Link className="gallery-container" to={`detail/${data.id}`}>
                         <div className="gallery-wrapper">
                             <figure className="gallery-wrapper-content">
                                 <img src={data.resource.origin} alt="" />
                             </figure>
                         </div>
                     </Link>
                     <div className="item-content">
                         <p>
                             <span>Current price</span>
                             <span className="detail-price">{data.price} BNB</span>
                             <span className="detail-around">≈ $540.0490</span>
                         </p>
                         <div>
                             <div className="button-group">
                                 <div className="button-group-content">
                                     <Link to={`detail/${data.id}`} className="btn-art" >
                                         View artwork
                                     </Link>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
               </div> 
             */}
         </div>
     )
}

const SlideWorks = ({ data: el }: any) => {
     return (
         <div className="item-container slide-show">
             <div className="item-wrapper">
                 <div className="item-wrapper-content">
                     <Link className="gallery-container" to={`detail/${el.id}`}>
                         <div className="gallery-wrapper">
                             <figure className="gallery-wrapper-content">
                                 <img src={el.resource.origin} alt="" />
                             </figure>
                         </div>
                     </Link>
                     <div className="item-content">
                         <h1>{el.name}</h1>
                         <p>
                             <span>Current price</span>
                             <span className="detail-price">{el.price} BNB</span>
                             <span className="detail-around">≈ $540.0490</span>
                         </p>
                         <div>
                             <div className="button-group">
                                 <div className="button-group-content">
                                     <Link to={`detail/${el.id}`} className="btn-art" >
                                         View artwork
                                     </Link>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     )
}


export const RecentWorksDisplay = (props: any) => {
     const { titleLabel = '', titleLinkLabel, pageState, selectedItem, setSelectedItem } = props;

     const [ isLoading, setLoading ] = useState(true);
     const [ data, setData ] = useState<any>({});
     const dataRef = useRef(data);
     const [ isFetching, setFetching ] = useState(false)
     const { isDebugging, isPageReload, setPageReload } = pageState
     
     dataRef.current = data
     useEffect(() => {
          if (isPageReload) {
               (async () => {
                    const _list = await workLoader("recent", dataRef, { setLoading, setData})
               })()
               // if (isLoading) { setLoading(false) }
          }
     }, [ isPageReload ])

     return (<>
          <div className="section">
          {
               // TODO: Change to minimal loader
               // isLoading && <LoadingScreen isLoading={isLoading} />
          }
          { 
               data
               ? (<>
               {/* {
                    Object.keys(data).map(key => data[key]).filter((item: any) => item.isApproved).map((item: any) => <WorkItemDisplay item={item} key={item.id} />)
               } */}
                    <div className="_title-container">
                         <div className=" _title">
                              <span>New Arrival</span>
                              {/* <Label title={`Selected Artists`} /> */}
                         </div>
                    </div>
                    <div className="body-container">
                         <div className="body-wrapper">
                              {/* <Label title={`${titleLabel}`} linkName={titleLinkLabel} /> */}
                              <div id="present-art-items" className="body-wrapper-content">
                                   { Object.keys(data).map(key => data[key]).filter((item: any) => item.isApproved).map((item: any) => <WorkItemDisplay item={item} key={item.id} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />) }
                              </div>
                         </div>
                    </div>
               </>) : (<>
                    { // TODO: Improve displaying for No Data
                    }
                    <div>No Data</div>
               </>) 
          }</div>
     </>)
}

export const FeaturedWorksDisplay = (props: any) => {
     const { pageState, selectedItem, setSelectedItem } = props;

     const [ isLoading, setLoading ] = useState(true);
     const [ data, setData ] = useState<any>({});
     const dataRef = useRef(data);
     const [ isFetching, setFetching ] = useState(false)
     const { isDebugging, isPageReload, setPageReload } = pageState
     
     dataRef.current = data
     useEffect(() => {
          if (isPageReload) {
               (async () => {
                    const _list = await workLoader("recent", dataRef, { setLoading, setData})
               })()
               // if (isLoading) { setLoading(false) }
          }
     }, [ isPageReload ])

     return (<>
          <div className="section">
          {
               // TODO: Change to minimal loader
               // isLoading && <LoadingScreen isLoading={isLoading} />
          }
          { 
               data
               ? (<>
               {/* {
                    Object.keys(data).map(key => data[key]).filter((item: any) => item.isApproved).map((item: any) => <WorkItemDisplay item={item} key={item.id} />)
               } */}
                    <div className="_title-container">
                         <div className=" _title">
                              <span>Featured Arts</span>
                              {/* <Label title={`Selected Artists`} /> */}
                         </div>
                    </div>
                    <div className="body-container">
                         <div className="body-wrapper">
                              {/* <Label title={`${titleLabel}`} linkName={titleLinkLabel} /> */}
                              <div id="present-art-items" className="body-wrapper-content">
                                   { Object.keys(data).map(key => data[key]).filter((item: any) => item.isApproved).map((item: any) => <WorkItemDisplay item={item} key={item.id} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />) }
                              </div>
                         </div>
                    </div>
               </>) : (<>
                    { // TODO: Improve displaying for No Data
                    }
                    <div>No Data</div>
               </>) 
          }</div>
     </>)
}

async function workLoader (index = "recent", dataRef: any, handlers: any) {
     const list = await getWorkIndex(index) as any
     const displayFirstItemsCount = 4;
     const { setLoading, setData } = handlers

     for (let [i, _item] of list.entries()) {
          // console.log(i, _item, data[_item.id], dataRef.current)
          // TODO: Add skip for what's loaded
          console.log("Check Item", _item)
          if (!dataRef.current[_item.id] && _item.isActive) {
               // See if item will be loaded (and not reload again)
               // console.log("Loading...", _item.id)

               // See all item in order, its list's data, the data that was setted, and whole data object.
               // console.log(i, _item, data[_item.id], data, dataRef.current)
               let _itemData: any = await getWorkItem(_item.id)
               // if (_item.type === "works") { _itemData = await getWorkItem(_item.id) }
               // if (_item.type === "billboards") { _itemData = await getBillboardItem(_item.id) }

               // See item Data
               // console.log(_item.id, _item, _itemData)
               if (_itemData
                    && _itemData.isApproved
                    // && (
                    //      (_item.type === "works" && _itemData.isApproved)
                    //      || (_item.type === "billboards")
                    // )
               ) {
                    // Check if item pass the criteria and will be setted.
                    console.log(_item.id, "will be setted")
                    setData({ ...dataRef.current, [_item.id]: { ..._item, ..._itemData } })
               } else {
                    console.log("Failed to load data of item", _item.id, `because it's does not approved or exists`)
               }
               if (i < displayFirstItemsCount) {
                    setLoading(false)
               }
          } else {
               // See if item wasn't load
               console.log("Failed to load", _item.id, `because it's ${!_item.isActive ? "set to inactive," : ""}${dataRef.current[_item.id] ? "already loadad" : ""}`)
          }
     }
}

export const WorkItemDisplay = (props: any) => {
     const { item, selectedItem, setSelectedItem } = props
     const handleItemSelect = (el: any, id: string) => {
          setSelectedItem(id)
          console.log(el)
     }

     return (<>
          { debugable && Object.keys(item) }
          <div>
               {
                    <div id={`${pageid}-${item.id}`}
                         key={`${pageid}-${item.id}`}
                         className={`body-content work-card ${ selectedItem === item.id ? "_selected" : "" }`}
                         onClick={(el) => handleItemSelect(el, item.id)}
                    >
                    <Link to={`/detail/${item.id}`}>
                         <div className="cover-art">
                              <figure>
                                   <img src={item.resource.thumbnail_256} alt="" />
                              </figure>
                         </div>
                         <div className="title-art">
                              <h3>
                                   {item.name}
                              </h3>
                              <span className="price-art">
                                   {/* <span >PRICE</span>
                                   {item.price} BNB */}
                              </span>
                         </div>
                    </Link>
               </div>
               }
          </div>
     </>)
}

export const SelectedArtistsDisplay = ({ pageState }: any) => {

     const [ data, setData ] = useState<any>({});
     const dataRef = useRef(data);
     const [ isFetching, setFetching ] = useState(false)
     const [ showDetail, setShowDetail ] = useState("")
     const { isDebugging, isPageReload, setPageReload, isLoading, setLoading } = pageState
     
     dataRef.current = data
     useEffect(() => {
          if (isPageReload) {
               (async () => {
                    const list = await getSelectedCreatorIndex()
                    const displayFirstItemsCount = 3;
     
                    for (let [i, _item] of list.entries()) {
                         const [_id, _score] = _item as [string, number]

                         // TODO: Add skip for what's loaded
                         if (!dataRef.current[_id]) {
                              // See if item will be loaded (and not reload again)
                              console.log("Loading...", _id)

                              // See all item in order, its list's data, the data that was setted, and whole data object.
                              // console.log(i, _item, data[_item.id], data, dataRef.current)
                              let _itemData: any = await getSelectedCreatorItem(_id)

                              // See item Data
                              console.log(_id, _itemData)
                              if (_itemData) {
                                   // Check if item pass the criteria and will be setted.
                                   console.log(_id, "will be setted")
                                   setData({ ...dataRef.current, [_id]: _itemData })
                              } else {
                                   console.log("Failed to load data of item", _id, `because it's does not approved or exists`)
                              }
                              if (i < displayFirstItemsCount) {
                                   setLoading(false)
                              }
                         } else {
                              // See if item wasn't load
                              console.log("Failed to load", _id, `because it's ${dataRef.current[_id] ? "already loadad" : ""}`)
                         }
                    }
               })()
               setTimeout(() => {
                    if (isLoading) { setLoading(false) }
               }, 500)
          }
     }, [ isPageReload ])

     const handleRefresh = () => {
          setPageReload(true)
     }

     // const handleOnSlideChange = (oldIndex: number, newIndex: number) => {
     //      // console.log(oldIndex, newIndex)
     // }

     // const slideConfigs = {
     //      duration: 2000,
     //      transitionDuration: 200,
     //      canSwipe: true,
     //      pauseOnHover: true,
     //      onChange: handleOnSlideChange
     // }

     // const slides = Object.keys(data)
     //      .map(key => data[key])
     //      .filter((item: any) => item.isApproved)
     //      .map((item: any, index) => (
     //           <HeroesItemDisplay item={item} index={index} key={item.id} pageState={pageState} />
     //      ))
     const handleShowDetail = (id: string) => {
          if (showDetail !== id) {
               setShowDetail(id)
          } else {
               setShowDetail("")
          }
     }

     const handlers = {
          handleShowDetail
     }

     pageState.isDebugging && console.log("Re-rendering:", `isPageReload ${isPageReload}`, `isLoading ${isLoading}`)

     const items = Object.keys(data).map(key => data[key])

     return (<>
          <div className="section">
          {
               // TODO: Change to minimal loader
               // isLoading && <LoadingScreen isLoading={isLoading} />
          }
          { 
               data
               ? (<>
               {/* {
                    Object.keys(data).map(key => data[key]).filter((item: any) => item.isApproved).map((item: any) => <WorkItemDisplay item={item} key={item.id} />)
               } */}<div className="_title-container">
                         <div className=" _title">
                              <span className="styled-text-colourful-1">Selected Artists</span>
                              {/* <Label title={`Selected Artists`} /> */}
                         </div>
                    </div>
                    <div className="selected-artists-container">
                         <div className="selected-artists-item-container">
                              { items.map((item: any) => <SelectedArtistsItem item={item} key={item.id} handlers={handlers} />) }
                         </div>
                         <div className={`selected-artists-detail ${showDetail && "_show"}`}>
                              { data[showDetail]?.bio }
                         </div>
                         {/* <Coverflow
                              width={960}
                              height={480}
                              displayQuantityOfSide={Math.floor(items.length / 2)}
                              navigation={false}
                              enableHeading={false}
                              active={Math.floor(items.length / 2)}
                              infiniteScroll
                              classes={{
                                   "coverflow-x": true
                              }}
                              className="coverflow-x"
                         >
                              { items.map((item: any) => <SelectedArtistsItem item={item} key={item.id} />) }
                         </Coverflow> */}
                    </div>
               </>) : (<>
                    { // TODO: Improve displaying for No Data
                    }
                    <div>No Data</div>
               </>) 
          }</div>
     </>)
}

export const SelectedArtistsItem = (props: any) => {
     const { handlers } = props;
     const { handleShowDetail } = handlers;

     const { item } = props
     return (<>
          <div key={item.id} className="selected-artist-item" onClick={() => handleShowDetail(item.id)}>
               <div className="_image">
                    <div className="_border" />
                    <img src={item.images.thumbnail_128} alt={item.name}/>
               </div>
               <span className="_title">{ item.name }</span>
          </div>
     </>)
}

export const FeaturedArtistsDisplay = (props: any) => {
     return (<>
     
     </>)
}

export const getWorkIndex = async (indexName = "recent") => {
     let data_ : any = []
     try {
          const doc = await firestore.collection("works_index").doc(indexName).get()
          const index = doc.data()
          if (doc.exists) {
               const list = (index as any).list
               data_ = sortAlgorithms(list)
          }

     } catch (e) {
          console.error("getWorkIndex", e)
     }
     return data_
}

export const getWorkItem = async (id: string) => {
     try {
          // TODO: Add persistence caching, more on https://firebase.google.com/docs/firestore/manage-data/enable-offline
          const doc = await firestore.collection("works").doc(id).get()
          // console.log("getWorkItem", doc)
          const work = doc.data()
          if (doc.exists) {
               return work
          }
          return null
     } catch (e) {
          console.error("getWorkItem", e)
     }
}

export const getBillboardItem = async (id: string) => {
     try {
          // TODO: Add persistence caching, more on https://firebase.google.com/docs/firestore/manage-data/enable-offline
          const doc = await firestore.collection("billboards").doc(id).get()
          // console.log("getBillboardItem", doc)
          if (doc.exists) {
               return doc.data()
          }
          return null
     } catch (e) {
          console.error("getBillboardItem", e)
     }
}

export const getSelectedCreatorIndex = async () => {
     try {
          const doc = await firestore.collection('users_index').doc('selected-creator').get()
          if (doc.exists) {
               const index: any = doc.data()
               const { list } = index
               if (!list) { return [] }
               const sortedList = Object.entries(list).sort(([a_key, a_val]: any, [b_key, b_val]: any) => a_val - b_val)
               return sortedList
          }
          return []
     } catch (error) {
          console.error("getSelectedCreatorIndex", error)
          return []
     }
}


export const getSelectedCreatorItem = async (id: string) => {
     try {
          const doc = await firestore.collection("users").doc(id).get()
          if (doc.exists) {
               return doc.data()
          }
          return {}
     } catch (e) {
          console.error("getSelectedCreatorItem", e)
     }
}


export const sortAlgorithms = (data: any, type?: string | null) => {
     let data_ = []
     if (data) {
          const _data = data
          data_ = Object.keys(_data)
          .sort((a: any, b: any) => a.timestamp - b.timestamp)
          .sort((a: any, b: any) => a.score - b.score)
          .map(key => ({ id: key, ...data[key] }))
     }
     return data_
}
