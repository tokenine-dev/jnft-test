import React, { useEffect, useState } from 'react';

import ICON_TWITTER from 'assets/img/icon-twitter.svg';
import ICON_INSTRAGRAM from 'assets/img/icon-instagram.svg';
import { useParams } from 'react-router';
import { useDAppContext } from 'providers/dapp';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { ICreator, IWork } from '../../types'

type Props = {
     data?: any;
     creator: ICreator | null;
};

export default function ProfileComponent({ data, creator }: Props) {
     const [edit, setedit] = useState(false);
     const { account } = useDAppContext();
     const user_id = Object(useParams()).creator;

     useEffect(() => {
          setBtnEdit();
     });

     function setBtnEdit() {
          if (account === user_id) {
               setedit(true);
          }
     }

     return (
          <div className="body-container">
               <div className="body-wrapper">
                    <div className="body-wrapper-content __profile">
                         <div className="left">
                              <div className="__profile-detail">
                                   <div className="-profile-detail-image">
                                        {
                                             creator?.images
                                             ? (
                                                  <img
                                                       src={creator?.images?.thumbnail_128}
                                                       alt=""
                                                       className="mr-4 w-24 h-24 rounded-full border border-white bg-white"
                                                  />
                                             )
                                             : (<FaUserCircle className="mr-4 w-24 h-24 rounded-full border border-white bg-white" />)
                                        }
                                   </div>
                                   <div className="-profile-detail-description text-black">
                                        <h1 style={{ color: "black"}}>{creator?.name || "No Name"}</h1>
                                        {/* <span className="text-black __block __f-norm">@Anonymous{` `}</span> */}
                                        <span className="text-black" id="key-address">
                                             {user_id ? user_id?.substr(0, 6) + '...' + user_id?.substr(user_id?.length - 4, 4) : "xxxxxxxxxxx...xxxx"}
                                        </span>
                                   </div>
                              </div>
                              {/* <div className="__profile-follow">
                                   <div className="-profile-follow-content">
                                        <span className="txt-white __block __f-extrabold">9M</span>
                                        <span >Following</span>
                                   </div>
                                   <div className="-profile-follow-content">
                                        <span className="txt-white __block __f-extrabold">48K</span>
                                        <span >Follower</span>
                                   </div>
                                   <div className="-profile-follow-content">
                                        <Link
                                             className="button __btn-link -white"
                                             to={`/profile/edit/${user_id}`}
                                        >
                                             {edit ? 'Edit' : 'Follow'}
                                        </Link>
                                   </div>
                              </div> */}
                         </div>

                         <div className="right mt-4 text-white">
                              <span className="txt-opa-upper  text-black">Bio</span> <br />
                              <small className="text-base  text-black">
                                   {creator?.bio || "..."}
                              </small>
                              {/* <div className="__profile-network">
                                   <span className="txt-opa-upper">Network</span>
                                   <div className="-profile-network-content">
                                        <Link to="#" className="-network-link">
                                             <span >
                                                  <img height="12" width="18" src={ICON_TWITTER} alt="" />
                                                  @Homesawan
                                             </span>
                                        </Link>
                                        <Link to="#" className="-network-link">
                                             <span >
                                                  <img height="12" width="18" src={ICON_INSTRAGRAM} alt="" />
                                                  @Homesawan
                                             </span>
                                        </Link>
                                        <Link to="#" className="-network-link">
                                             foundation.app ➝
                                        </Link>
                                   </div>
                              </div> */}
                         </div>
                    </div>
               </div>
          </div>
     );
}
