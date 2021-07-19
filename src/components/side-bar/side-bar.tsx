import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './sidebar.scss'

import JFNT_LOGO_WHITE from '../../assets/img/JNFT.logo.white.svg'
import { FaAngleLeft, FaUserClock } from 'react-icons/fa'
import { SiMarketo } from 'react-icons/si'
import { MdCreateNewFolder } from 'react-icons/md'

export interface Props {
    isApprovedCreator?: boolean,
    account?: boolean
}
export default function SideBar(props: any) {
    const { isApprovedCreator, account } = props

    const closeSidebar = () => {
        const side = document.querySelector<HTMLElement>('.sidebar-container')!;
        side.style.left = '-18rem';
    }

    return (
        <div id="sidebar-container" className="sidebar-container">
            <div className="sidebar-wrapper">
                <div className="sidebar-content">
                    <div className='__header'>
                        <div id="nav-items-logo" className="nav-items __logo">
                            <Link to="/home">
                                <img src={JFNT_LOGO_WHITE} alt="Workflow" />
                            </Link>
                        </div>
                    </div>
                    <div className="__content">
                        <ul>
                            <li>
                                <Link to="/nft-market">
                                    <SiMarketo className="__inline" />
                                    Marketplace
                                </Link>
                                <Link to="/blog" className="show">
                                    Blogs
                                </Link>
                                <Link to="/about" className="show">
                                    About
                                </Link>
                            </li>
                            {
                                (account) &&
                                <>
                                    {
                                        isApprovedCreator ?
                                            <li>
                                                <Link to="/user/add-work">
                                                    <MdCreateNewFolder className="__inline" />
                                                    Create Work
                                                </Link>
                                            </li> : <li>
                                                <Link to="/user/tobecreator">
                                                    <FaUserClock className="__inline" />
                                                    Request to be Creator
                                                </Link>
                                            </li>
                                    }
                                </>
                            }
                        </ul>
                    </div>
                </div>
                <div className="sidebar-arrow" onClick={closeSidebar}>
                    <FaAngleLeft height={100} />
                </div>
            </div>
        </div >
    )
}
