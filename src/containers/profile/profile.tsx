import { ItemFeeds, Navbar, ProfileComponent } from 'components'
import { firestore } from 'libs/firebase-sdk';
import { useDAppContext } from 'providers/dapp';
import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { safeAddress } from 'utils/contract';
import { ICreator, IWork } from '../../types'
import { getWorksByIndex  } from 'helpers/fireabase';
import { sortWorksList } from 'helpers/data';
import { ItemCard } from 'components/ItemCard'

export default function Profile() {
    const page = {
        id: "MARKETPLACE"
    }

    const creator = Object(useParams()).creator;

    const { account } = useDAppContext();
    const [user, setUser] = useState<ICreator | null>(null)
    const [works, setWorks] = useState<IWork[]>([])
    const [ownedWorksList, setOwnedWorksList] = useState<any>({})
    const [ownedWorks, setOwnedWorks] = useState<any[]>([])
    const [createdWorksList, setCreatedWorksList] = useState<any>({})
    const [createdWorks, setCreatedWorks] = useState<any[]>([])

    useEffect(() => {
        if (creator) {
            getUser()
            // getWork()
            // getWorksList()
        }
        return () => {
            setUser(null)
            setWorks([])
            setOwnedWorksList([])
            setCreatedWorksList([])
        }
   }, [creator])

   useEffect(() => {
       if (creator) {
           getWorksByIndex(`user:${safeAddress(creator)}`)
           .then((result_: any) => {
               const { list_creation, list_own } = result_
               if (list_creation) {
                   setCreatedWorks(sortWorksList(list_creation))
               }
               if (list_own) {
                   setOwnedWorks(sortWorksList(list_own))
               }
           })
       }
    }, [creator])

    // useEffect(() => {
    //     if (pageData.list) {
    //         const sortedList = sortWorksList(pageData.list)
    //         setSortedList(sortedList)
    //     }
    // }, [createdWorksList, ownedWorksList])

   const getUser = () => {
        console.log(creator)
        firestore.collection('users').doc(creator || '').get().then((doc) => {
             if (doc.exists) {
                  setUser(doc.data() as ICreator)
             } else {
                  console.log("No such document!");
             }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

//    const getWork = () => {
//         let worksList: IWork[] = []
//         firestore.collection('works').where("owner", "==", creator || '').get().then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//                 worksList.push(doc.data() as IWork)
//             });
//             setWorks(worksList)
//         }).catch((error) => {
//             console.log("Error getting document:", error);
//         });
//     }

//    const getWorksList = () => {
//         firestore.collection('works_index').doc(`user:${safeAddress(creator)}`).get()
//         .then((_doc: any) => {
//             // console.log("Getting document", _doc)
//             if (_doc.exists) {
//                 const _data = _doc.data()
//                 const { list_creation, list_own } = _data
//                 // console.log(_data)
//                 const ownedWorkList = Object.entries(list_own).map((_entry: any) => {
//                     const [ id, item ] = _entry
//                     return {
//                         id,
//                         ...item,
//                         isLoaded: false
//                     }
//                 })
//                 // console.log("Owned Works", ownedWork)
//                 setOwnedWorksList(ownedWorkList)
//                 // Promise.all(ownedWorkList.map(async (_item: any) => {
//                 //     try {
//                 //         const _doc = await firestore.collection('works').doc(_item?.id).get()
//                 //         if (_doc.exists) {
//                 //             const doc_ = _doc.data()
//                 //             return {
//                 //                 ...doc_,
//                 //                 isLoaded: true
//                 //             }
//                 //         }
//                 //     } catch (error) {
//                 //         console.log(error)
//                 //         return
//                 //     }
//                 // })).then((ownedWork_: any) => {
//                 //     console.log("Promise All", ownedWork_);
//                 //     setOwnedWorks(ownedWork_)
//                 // })
//                 const createdWorkList = Object.entries(list_own).map((_entry: any) => {
//                     const [ id, item ] = _entry
//                     return {
//                         id,
//                         ...item,
//                         isLoaded: false
//                     }
//                 })
//                 // console.log("Owned Works", ownedWork)
//                 setCreatedWorksList(createdWorkList)
//                 // Promise.all(createdWorkList.map(async (_item: any) => {
//                 //     try {
//                 //         const _doc = await firestore.collection('works').doc(_item?.id).get()
//                 //         if (_doc.exists) {
//                 //             const doc_ = _doc.data()
//                 //             return {
//                 //                 ...doc_,
//                 //                 isLoaded: true
//                 //             }
//                 //         }
//                 //     } catch (error) {
//                 //         console.log(error)
//                 //         return
//                 //     }
//                 // })).then((createdWork_: any) => {
//                 //     console.log("Promise All", createdWork_);
//                 //     setCreatedWorks(createdWork_)
//                 // })
//             }
//         }).catch((error) => {
//             console.log("Error getting document:", error);
//         });
//         // firestore.collection('works').where("owner", "==", creator || '').get().then((querySnapshot) => {
//         //     querySnapshot.forEach((doc) => {
//         //         worksList.push(doc.data() as IWork)
//         //     });
//         //     setWorks(worksList)
//         // }).catch((error) => {
//         //     console.log("Error getting document:", error);
//         // });
//     }

    return (
        <>
            <div className="navbar-container">
                <ProfileComponent creator={user} />
            </div>


            {/* { ownedWorksList.length > 0 && (<ItemFeeds labelTitle={'Owned'} works={ownedWorks} />) }
            { createdWorksList.length > 0 && (<ItemFeeds labelTitle={'Created'} works={createdWorks} />) } */}


            <div className="max-w-screen-xl w-full mx-auto hero-body flex mt-0 md:my-8 jimmyis-softcard" style={{ marginTop: "100px" }} >
                <div className="_title">
                    Owned Artworks
                </div>
                <div>
                    <div className="body-container">
                        <div className="body-wrapper">
                            <div id="present-art-items" className="body-wrapper-content">
                            {
                                ownedWorks.map((id: string) => (<ItemCard key={id} data={{ page, id }} />))
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="max-w-screen-xl w-full mx-auto hero-body flex mt-0 md:my-8 jimmyis-softcard" style={{ marginTop: "100px" }} >
                <div className="_title">
                    Minted Artworks
                </div>
                <div>
                    <div className="body-container">
                        <div className="body-wrapper">
                            <div id="present-art-items" className="body-wrapper-content">
                            {
                                createdWorks.map((id: string) => (<ItemCard key={id} data={{ page, id }} />))
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
