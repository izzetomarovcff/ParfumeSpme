import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AddToFav } from '../redux/actions'
import { Link } from 'react-router-dom'

function HaveSaleProducts() {
  const [productdata, setProductData] = useState([])
  const { GeneralResponse } = useSelector(state => state)
  const dispatch = useDispatch()
  useEffect(() => {


    const getData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/products.json`)
        let resData = await response.json()
        let arr = []
        for (const key in resData) {
          if (resData[key].isSale) {
            arr.unshift({ ...resData[key], id: key })
          }
        }
        setProductData(arr)
      } catch (error) {
        console.log(error)
      }
    }
    getData()

  }, [])
  const addFav = (product) => {
    dispatch(AddToFav(product))
  }
  return (
    <div id='salesection' className='pt-5'>

      <h1 className='px-3'>Endrimli Ətirlər</h1>
      <p className='px-3'>Super Yay Endrimləri</p>
      {productdata.length == 0 ? (<div className='mx-auto text-dark'>Endrimli Məhsul Mövcud deyildir</div>) : (
        <div className='saleproduct '>
          {productdata.filter(product => product.isSale).map((product, keyproduct) => {
            return (
              <div className="product mx-3" key={keyproduct} >
                <Link to={`/shop/product/${product.id}`} className='productimg'>
                  <img src={product.imgUrl} alt="product" />
                  {product.isSale ? (<div className='sale bg-primary'>-{product.salePer}%</div>) : (null)}
                  {product.isNew ? (<div className='new bg-dark'>Yeni</div>) : (null)}
                </Link>
                <div className='d-flex mt-2'>
                  {Array.from({ length: product.starCount }, (_, index) => <img src="image/home/sale/star.svg" alt="" key={index} />)}
                  {Array.from({ length: 5 - product.starCount }, (_, index) => <img src="image/home/sale/starinactive.svg" alt="" key={index} />)}
                  <p className='mb-0 fs-6'>({product.starPoint})</p>
                </div>
                <p className='mb-1 mt-1'>{product.brandName}</p>
                <h6>{product.productName}</h6>
                <div className='d-flex'>{product.isSale ? (<del className='me-2' >{product.oldPrice} ₼</del>) : (null)}<p className='text-primary newprice'>{product.price} ₼</p></div>
                {GeneralResponse.favorites.find(item => item.id == product.id) ? (<div className='addfav shadow-sm bg-primary' onClick={() => addFav(product)}><img src="image/home/sale/heart.svg" alt="" /></div>) : (<div className='addfav shadow-sm' onClick={() => addFav(product)}><img src="image/home/sale/heart.svg" alt="" /></div>)}

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

export default HaveSaleProducts