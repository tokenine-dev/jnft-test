import ItemPlaceBid from 'components/item/item-placebid'
import React, { useEffect, useState }  from 'react'
import { GET } from "api";
import { useParams } from "react-router-dom";

const PlaceBid = () => {
    const [detail, setDetail] = useState(null);
    const id = Object(useParams()).id;

    useEffect(() => {
        getDetail();
    }, []);

    async function getDetail() {
        try {
            let detail = await GET(`/getwork?id=${id}`);
            setDetail(detail);
        } catch (error) {
            console.log(`error`, error);
        }
    }


    return (
        <>
           <ItemPlaceBid data={detail} />
        </>
    )
}

export default PlaceBid
