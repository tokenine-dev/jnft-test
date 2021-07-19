import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { useDAppContext } from "providers/dapp"
import { firestore } from "libs/firebase-sdk"
import { AddressMask } from "components/AddressMask";
import Avatar from "components/Avatar";

export const ProfileMini = ({ data = ({}) as any, handlers = ({}) as any }) => {
    const location = useLocation()
    const { account, disconnect } = useDAppContext();
    const [ user, setUser ] = useState({} as any)

    const { isActiveExpandPanel } = data
    const { openExpandTopBar } = handlers

    const getUser = () => {
        if (account) { 
            firestore.collection('users').doc(account).get().then((doc) => {
                 if (doc.exists) {
                      // console.log("Document data:", doc.data());
                      setUser(doc.data() as any)
                      console.log(doc.data());
                 } else {
                      // doc.data() will be undefined in this case
                      console.log("No such document!");
                 }
            }).catch((error) => {
                 console.log("Error getting document:", error);
            });
        } 
   }

   useEffect(() => {
        getUser()
   }, [ account ])
   
    return (<>
        {
            <div id="profile-mini" className={`${isActiveExpandPanel ? "_active" : ""}`}>
                <div className="_details">
                    <div className="_profile-details">
                        <Link to={`/profile/${account}`}>
                            <div className="mr-8"><Avatar data={{ user, size: 160 }} /></div>
                        </Link>
                        <div className="_description">
                            { user?.name ? (<>
                                    <h1 className="_name">{ user?.name !== "" ? user?.name : "Set your name" }</h1>
                                    <span className="txt-white" id="key-address">Wallet Address: { AddressMask({ account }) }</span>
                                </>) : (<>
                                    <h1 className="_name">Anonymous</h1>
                                    <span className="txt-white" id="key-address">Wallet Address: { AddressMask({ account }) }</span>
                                </>)
                            }
                        </div>
                    </div>
                    <div className="_buttons-panel">
                        <Link to={`/profile/edit/${account}`}>
                            <button className={`button-round-default ${location.pathname === '/profile/edit/' + account ? "_active" : ""}`}>
                                Edit Profile
                            </button>
                        </Link>
                        <button className="button-round-default" onClick={() => { disconnect(); openExpandTopBar(null, { close: true }) }}>
                            Disconnect Wallet
                        </button>
                    </div>
                </div>
            </div>
        }
    </>)
}

export default ProfileMini
