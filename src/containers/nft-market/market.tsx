import { ItemFeeds } from 'components';
import React, { useEffect, useState } from 'react';
import { IWork } from 'types';
import './market.css';
import { ItemCard } from 'components/ItemCard'
import { getWorksByIndex  } from 'helpers/fireabase';
import { sortWorksList } from 'helpers/data';


export default function Market() {
     const [ indexName, setIndexName ] = useState("recent")
     const [ pageData, setPageData ] = useState<any>({})
     const [ sortedList, setSortedList ] = useState<string[]>([])
     const page = {
          id: "MARKETPLACE"
     }

     // const [recentWorks, setRecentWorks] = useState<IWork[]>([])

     // useEffect(() => {
     //      (async () => {
     //           const list = await getWorkIndex("recent") as any
     //           const _works: IWork[] | undefined[] = []
     //           for (let key of list) {
     //                const work = await getWorkItem(key)
     //                // @ts-ignore 
     //                if (work) { _works.push(work) }
     //           }
     //           // @ts-ignore 
     //           setRecentWorks(_works)
     //      })()
     //      return () => setRecentWorks([])
     // }, [])

     // const getWorkIndex = async (indexName = "recent") => {
     //      try {
     //           const doc = await firestore.collection("works_index").doc(indexName).get()
     //           const index = doc.data()
     //           if (doc.exists) {
     //                const list = (index as any).list
     //                const sortedList = Object.keys(list).sort((a: any, b: any) => a.nanoseconds - b.nanoseconds)
     //                return sortedList
     //           }
     //           return []

     //      } catch (e) {
     //           console.error("getWorkIndex", e)
     //      }
     // }

     // const getWorkItem = async (id: string) => {
     //      try {
     //           const doc = await firestore.collection("works").doc(id).get()
     //           const work = doc.data()
     //           if (doc.exists) {
     //                return work
     //           }
     //           return
     //      } catch (e) {
     //           console.error("getWorkItem", e)
     //      }
     // }

     useEffect(() => {
          getWorksByIndex(indexName)
          .then((result: any) => setPageData(result))
     }, [indexName])

     useEffect(() => {
          if (pageData.list) {
               const sortedList = sortWorksList(pageData.list)
               setSortedList(sortedList)
          }
     }, [pageData])

     return (
          <div>
               {/* { JSON.stringify(pageData) } */}
               <div className="body-container">
                    <div className="body-wrapper">
                         {/* <Label title={`${labelTitle}`} linkName={labelLinkname ? labelLinkname : ''} /> */}
                         <div id="present-art-items" className="body-wrapper-content">
                         {
                              sortedList.map((id: string) => (<ItemCard key={id} data={{ page, id }} />))
                         }
                         </div>
                    </div>
               </div>
               
               
               {/* <ItemFeeds labelTitle={'Marketplace'} works={recentWorks} /> */}
          </div>
     );
}

