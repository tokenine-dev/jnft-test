import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IWork } from 'types';
import { SlideShow, Loading } from 'components'
import { Slide } from 'react-slideshow-image';
/* --- Image Import --- */
import ART from '../../assets/img/art.jpeg'

type ItemShowProps = {
    heroes?: any
}

export default function ItemShow({ heroes }: ItemShowProps) {
    const [work, setWorks] = useState<any>(null)

    useEffect(() => {
        if (heroes[0]) {
            console.log(heroes[0])
            setWorks(heroes[0])

        }
    }, [])

    // heroes.push(heroes[0])

    return (
        heroes[0] ? (
            <Slide easing="ease" duration={1500}>
                {
                    heroes?.map((el: any, index: number) => {
                        return (
                            <>
                                {(index % 2) ? <SlideDefault data={el} /> : <SlideCustom data={el} />}
                            </>
                        )
                    })
                }

            </Slide >
        ) : (
            <Loading text={'Loading...'} status={true} padding={true} />
        )

    )
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

const SlideCustom = ({ data: el }: any) => {
    return (
        <div className="item-container slide-show">
            <div className="item-wrapper">
                <div className="item-wrapper-content">
                    <div className="item-content">
                        <h1>{el.name}</h1>
                        <p>
                            <span>Current price</span>
                            <span className="detail-price">{el.price} BNB</span>
                            <span className="detail-around">≈ $540.0490</span>
                        </p>
                    </div>
                    <Link className="gallery-container" to={`detail/${el.id}`}>
                        <div className="gallery-wrapper">
                            <figure className="gallery-wrapper-content">
                                <img src={el.resource.origin} alt="" />
                            </figure>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}