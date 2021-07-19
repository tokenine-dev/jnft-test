import { Link } from 'react-router-dom';

import { useDAppContext } from 'providers/dapp';

import { ConnectButton } from 'components/Wallet';

import JNFT from 'assets/img/JNFT.logo.svg';
import JFNT_LOGO_WHITE from 'assets/img/JNFT.logo.white.svg';
import { firestore } from 'libs/firebase-sdk';
import { ethers } from 'ethers';
import { useState, useEffect, useLayoutEffect } from 'react';
import { FaUserCircle, FaUserClock, FaArrowRight, FaPlus, FaImages, FaExclamation, FaStar } from 'react-icons/fa';
import { IoMdHand } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { ICreator } from '../../types'
import SideBar from 'components/side-bar/side-bar';
import { useEthersContext } from 'providers/ethers';
import { useLocation } from "react-router-dom";
import { AddressMask } from "components/AddressMask";
import Avatar from "components/Avatar";

type navBarProps = {
     data?: any,
     handlers?: any,
     id?: string;
     profile?: JSX.Element[] | JSX.Element;
     feeds?: JSX.Element[] | JSX.Element;
};


/* TODO: Move to be a display utility */
const balanceReducer = (balance: number): string => {
     return balance.toString();
};

const Navbar = ({ id, profile, feeds, data, handlers }: navBarProps) => {
     const { account, disconnect } = useDAppContext();
     const { contracts } = useEthersContext();

     const { isActiveExpandPanel } = data
     const { openExpandTopBar } = handlers
     // const symbol = 'BNB';

     // const balance = 0; // Use Ethers Context
     // const _balance = balanceReducer(balance);

     const [totalOwnedNFT, setTotalOwnedNFT] = useState(0)

     const [user, setUser] = useState<ICreator | null>(null)

     useEffect(() => {
          console.log("Accoung Changed", account)
          if (account) {
               getUser()
               // console.log(contracts)
               getTotalOwnedNFT()
          }
          return () => {
               setUser(null)
          }
     }, [account])

     function useWindowSize() {
          const [size, setSize] = useState([0, 0]);
          useLayoutEffect(() => {
               function updateSize() {
                    setSize([window.innerWidth, window.innerHeight])
               }
               window.addEventListener('resize', updateSize)
               updateSize()
          }, [])
          return size
     }

     const getUser = () => {
          console.log("getUser", account)
          if (!account) { throw { message: "Account not initialized" } }
          firestore.collection('users').doc(account).get().then((doc) => {
               if (doc.exists) {
                    // console.log("Document data:", doc.data());
                    setUser(doc.data() as ICreator)
               } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
               }
          }).catch((error) => {
               console.log("Error getting document:", error);
          });
     }

     const getTotalOwnedNFT = () => {
          // const _totalOwnedNFT = 
          if (contracts.NFTWORK) {
               contracts.NFTWORK.balanceOf(account)
               .then((result: any) => setTotalOwnedNFT(result))
               .catch((error: any) => console.error(error))
          }
     }

     const CreatorButton = () => {
          const location = useLocation()

          const [ width, height ] = useWindowSize()
          const [ currentLocation, setCurrentLocation ] = useState(location.pathname)

          useEffect(() => {
               setCurrentLocation(location.pathname)
               // console.log(location)
          }, [location])

          return (
               (account)
                    ? user?.isApprovedCreator
                         ? (
                              <div className="rounded-md">
                                   {
                                        width > 576 &&
                                        <Link to="/create-work" className={`create-button-plus ${currentLocation === '/create-work' ? "_active": ""}`}>
                                             <FaPlus className="_icon" />
                                             <div className="_tooltip">
                                                  <span className="_text">Mint your work</span>
                                             </div>
                                        </Link>
                                   }
                              </div>
                         ) : (
                              <div className="rounded-md" >
                                   {
                                        width > 576 &&
                                        <Link to="/request-to-be-creator" className={`create-button-plus ${currentLocation === '/request-to-be-creator' ? "_active": ""}`}>
                                             <IoMdHand className="_icon" />
                                             <div className="_tooltip">
                                                  <span className="_text">Be a Creator</span>
                                             </div>
                                        </Link>
                                   }
                              </div>
                         )
                    : (<></>)
          )
     }

     const openSidebar = () => {
          const side = document.querySelector<HTMLElement>('.sidebar-container')!;
          side.style.left = '0';
     }

     async function handleGetFakeJFIN () {
          try {
               const total_ = ethers.utils.parseUnits("9999000000000000000000", 'wei')
               console.log("Faucet for Account", account, "by", total_, contracts)
               const tx = await contracts["FJFIN"].faucet(account, total_)

               tx.wait()
               .then((txResult: any) => console.log(txResult))
               .catch((txError: any) => console.error(txError))
          } catch (error) {
               console.error(error)
          }
     }

     const [width, height] = useWindowSize()

     return (
          <>
               <div id="navbar" className="navbar-container">
                    <header id="header">
                         <nav role="navigation">
                              <div className="navbar-wrapper">
                                   <div className="navbar-content">
                                        <div className="__menu-content">
                                             {
                                                  width <= 576 &&
                                                  <button
                                                       type="button"
                                                       aria-controls="mobile-menu"
                                                       aria-expanded="false"
                                                       onClick={openSidebar}
                                                  >
                                                       <span>Open main menu</span>
                                                       {/* Icon when menu is closed.
                                                              Heroicon name: outline/menu
                                                              Menu open: "hidden", Menu closed: "block" */}
                                                       <svg
                                                            className="block"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            aria-hidden="true"
                                                       >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                                       </svg>
                                                       {/* Icon when menu is open.
                                                              Heroicon name: outline/x
                                                              Menu open: "block", Menu closed: "hidden" */}


                                                       <svg
                                                            className="hidden"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            aria-hidden="true"
                                                       >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                       </svg>
                                                  </button>
                                             }
                                        </div>
                                        <div className="__nav-content">
                                             <div id="nav-items-logo" className="nav-items __logo">
                                                  <Link to="/home">
                                                       <img src={JFNT_LOGO_WHITE} alt="Workflow" />
                                                  </Link>
                                             </div>
                                             <div id="nav-items-item" className="nav-items __item">
                                                  <div className="space">
                                                       <nav role="navigation">
                                                            <Link to="" className="hide">
                                                                 Home
                                                            </Link>
                                                            {
                                                                 width > 576 && (<>
                                                                      <Link to="/nft-market" className="show">
                                                                           Marketplace
                                                                      </Link>
                                                                      <Link to="/blog" className="show">
                                                                           Blogs
                                                                      </Link>
                                                                      <Link to="/about" className="show">
                                                                           About
                                                                      </Link>
                                                                 </>)

                                                            }
                                                            { account && (<><div id="btn-faucet" className="button ml-4" onClick={ handleGetFakeJFIN }><FaStar className="_icon mr-2" />Get Free fJFIN</div></>) }
                                                       </nav>
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="btn flex">
                                             <CreatorButton />
                                             <div id="nav-button-profile" className="nav-button __profile-btn">
                                                  {account ?
                                                       (
                                                            <div className={`__profile-btn-wrapper ${isActiveExpandPanel ? "_expand" : "_compact"}`}>
                                                                 <div className="_contents dropdown">
                                                                      <div onClick={() => openExpandTopBar('profile')} >
                                                                           <span className="__profile-btn-content">
                                                                                <div className="__text">
                                                                                     {/* <span className="__balance">{`${_balance} ${symbol}`}</span> */}
                                                                                     <span className="__owned-nft">{`${totalOwnedNFT} NFT`}</span>
                                                                                     {/* <span className="text-xs text-gray-500">
                                                                                          {
                                                                                               user?.name
                                                                                                    ? user.name
                                                                                                    : account.substr(0, 6) + '...' + account.substr(account.length - 4, 4)
                                                                                          }
                                                                                     </span> */}
                                                                                     <span className="text-xs text-gray-500">{ AddressMask({ account }) }</span>
                                                                                </div>
                                                                                <span id="nav-profile" className="__image ml-2">
                                                                                     <Avatar data={{ user, size: 40 }} />
                                                                                </span>
                                                                           </span>
                                                                      </div>
                                                                      {/* <div className="dropdown-content">
                                                                           <div className="dropdown-content-hover">
                                                                                <Link className="dropdown-content-button" to={`/profile/edit/${account}`}>
                                                                                     Edit Profile
                                                                                </Link>
                                                                           </div>
                                                                           <div className="dropdown-content-hover">
                                                                                <button className="dropdown-content-button" onClick={disconnect}>
                                                                                     Disconnect Wallet
                                                                                </button>
                                                                           </div>
                                                                      </div> */}
                                                                 </div>
                                                                 <div className={`profile-panel-close ${isActiveExpandPanel ? "_active" : "_hide"}`} onClick={() => openExpandTopBar('profile', { close: true })}  >
                                                                      <IoClose className="_icon" />
                                                                      {/* <div className="_tooltip">
                                                                           <span className="_text">X</span>
                                                                      </div> */}
                                                                 </div>
                                                            </div>
                                                       )
                                                       :
                                                       (
                                                            <ConnectButton />
                                                       )}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </nav>
                    </header>
                    {profile}
               </div>
               {feeds}
               <SideBar
                    account={account}
                    isApprovedCreator={user?.isApprovedCreator}
               />
          </>
     );
};

export default Navbar;
