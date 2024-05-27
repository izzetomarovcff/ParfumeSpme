import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AddToFav } from '../redux/actions'

function CollectionProduct() {
    const { GeneralResponse } = useSelector(state => state)
    const dispatch = useDispatch()

    const [collection, setCollection] = useState(null)
    const [productData, setProductData] = useState([])
    useEffect(() => {
        let collectionId = window.location.pathname.split("/")[4]

        const getData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/collection/${collectionId}.json`)
                let resData = await response.json()
                
                if(resData.collectionFor == window.location.pathname.split("/")[2]){
                    setCollection({ ...resData, id: collectionId })

                }
            } catch (error) {
                console.log(error)
            }
        }
        getData()

    }, [])
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/products.json`)
                let resData = await response.json()
                let arr = []
                for (const key in resData) {
                    if (resData[key].collectionId === collection.id) {
                        arr.unshift({ ...resData[key], id: key })

                    }
                }
                setProductData(arr)
            } catch (error) {
                console.log(error)
            }
        }
        if (collection) {
            getData()
        }

    }, [collection])
    const addFav = (product)=>{
        dispatch(AddToFav(product))        
    }
    return (
        <div className='collectionproducts '>
            {collection ? (<div className='collectionname  border'>{collection.collectionName ? (collection.collectionName):("Incorrect Collection")}</div>) : (null)}
            <div className='products'>
                {productData.length == 0 ? (null) : (
                    productData.map((product,keyproduct)=>{
                        return(
                            <div className="product shadow-sm" key={keyproduct} >
                                <Link to={`/shop/product/${product.id}`}>
                                <div className='productimg'>
                                    <img src={product.imgUrl} alt="product" />
                                    {product.isSale ? (<div className='sale bg-primary'>-{product.salePer}%</div>) : (null)}
                                    {product.isNew ? (<div className='new bg-dark'>new</div>) : (null)}
                                </div>
                                </Link>
                                <div className='d-flex mt-2 ms-2'>
                                    {Array.from({ length: product.starCount }, (_, index) => <img src="../../../image/home/sale/star.svg" alt="" key={index} />)}
                                    {Array.from({ length: 5 - product.starCount }, (_, index) => <img src="../../../image/home/sale/starinactive.svg" alt="" key={index} />)}
                                    <p className='mb-0 fs-6 ms-1'>({product.starPoint})</p>
                                </div>
                                <p className='mb-1 mt-1 ms-2'>{product.brandName}</p>
                                <h6 className='ms-2'>{product.productName}</h6>
                                <div className='d-flex ms-2'>{product.isSale ? (<del className='me-2' >{product.oldPrice} $</del>) : (null)}<p className='text-primary newprice'>{product.price} $</p></div>
                                {GeneralResponse.favorites.find(item=>item.id == product.id) ? (<div className='addfav shadow-sm bg-primary' onClick={()=>addFav(product)}><img src="../../../image/home/sale/heart.svg" alt="" /></div>):(<div className='addfav shadow-sm' onClick={()=>addFav(product)}><img src="../../../image/home/sale/heart.svg" alt="" /></div>)}
                                
                            </div>
                        )
                    })
                )}
            </div>

        </div>
    )
}

export default CollectionProduct