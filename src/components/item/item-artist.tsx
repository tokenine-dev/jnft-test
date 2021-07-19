import React from 'react'
import { Label } from 'components';
import { FaUserCircle } from 'react-icons/fa';
import Image01 from '../../assets/img/user-36-06.jpg';
import { ICreator } from 'types';
import { Link } from 'react-router-dom';


type ItemArtistsProps = {
    selectedArtist?: ICreator[] | []
};

const ItemArtist = ({ selectedArtist }: ItemArtistsProps) => {
    return (
        <div id="feeds">
            <div className="body-container">
                <div className="body-wrapper">
                    <Label title={`Selected Artist`} />
                    <div id="present-art-items" className="flex justify-around">
                        {
                            selectedArtist?.map((artist: ICreator) => (
                                <Link to={`/profile/${artist.id}`} className="items">
                                    <div className="mr-3 flex flex-col items-center content-center">
                                        <div className="flex-shrink-0">
                                            {artist?.images.thumbnail_128
                                                ? (
                                                    <img className="rounded-full" src={artist?.images.thumbnail_128} width="100" height="100" alt={`creator`} style={{ height: '100px', width: '100px' }} />
                                                )
                                                : (
                                                    <FaUserCircle className="rounded-full" size="6em" />
                                                )
                                            }
                                        </div>
                                        <div className="font-medium text-sm text-gray-800">{artist.name}</div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemArtist
