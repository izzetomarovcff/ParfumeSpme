import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function KidsCollection() {
    const [collectionData, setCollectionData] = useState([])
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/collection.json`)
                let resData = await response.json()
                let arr = []
                for (const key in resData) {
                    if (resData[key].collectionFor === "kids") {
                        arr.push({ ...resData[key], id: key })
                    }
                }
                setCollectionData(arr)
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])
    return (
        <div className='collections'>
            {collectionData.length == 0 ? (null) : (
                collectionData.map((collection, collectionkey) => {
                    return (
                        <Link to={`/shop/kids/collection/${collection.id}`} key={collectionkey} className='mt-3 rounded shadow-sm'>
                            <div  className='collection rounded'>
                                <img src={collection.collectionImgUrl} alt="" className='rounded' />
                                <div className="overlay rounded"></div>
                                <div className="collectiontext">{collection.collectionName}</div>
                            </div>
                        </Link>
                    )
                })
            )}
        </div>
    )
}

export default KidsCollection