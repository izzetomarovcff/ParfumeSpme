import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { AddToCart, AddToFav, ProductMinus, ProductPlus } from '../redux/actions'

function ProductDetails() {
    const [product, setProduct] = useState(null)
    const [productToCart,setProductTocart] = useState({
        productid : "",
        productSize: ""
    })
    const dispatch = useDispatch()
    const { GeneralResponse } = useSelector(state => state)
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
          // console.log(user.email) //check token status
          if (user) {
          } else {
            window.location.href = "/signup"
          }
        })
        return () => {
          listen()
        }
      }, [])
    useEffect(() => {
        let productId = window.location.pathname.split("/")[3]
        const getData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/products/${productId}.json`)
                let resData = await response.json()
                setProduct({ ...resData, id: productId, count: 1 })
            } catch (error) {
                console.log(error)
            }
        }
        getData()

    }, [])
    const shareproduct = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${product.productName} (${product.brandName})`,
                    url: window.location.href
                })
            }

        } catch (error) {

        }
    }
    const handleChange = (e)=>{
        const {value} = e.target
        setProductTocart(prevState=>({
            ...prevState,
            productSize: value
        }))
    }
    const handleAddCart = ()=>{
        dispatch(AddToCart({...product, sizes: productToCart.productSize}))
    }
    const productCountPlus = ()=>{
        let stateres = GeneralResponse.cart.find(item=>item.id == product.id)
        if(stateres){
            dispatch(ProductPlus(product.id))
        }else{
            
        }        
    }
    const productCountMinus = () =>{
        let stateres = GeneralResponse.cart.find(item=>item.id == product.id)
        if(stateres){
            dispatch(ProductMinus(product.id))
        }
    }
    const addFav = (product)=>{
        dispatch(AddToFav(product))        
    }
    return (
        <div className='productdetails'>
            <div className='productheader bg-secondary'>
                <div className='backicon' onClick={() => { window.history.back() }}><img src="/icons/back.svg" alt="" /></div>
                {product ? (<div className='productname'>{product.productName}</div>) : (null)}
                <div className='shareicon' onClick={shareproduct}><img src="/icons/share.svg" alt="" /></div>
            </div>
            {product ? (
                <div className="product">
                    <div className='productimg'><img src={product.imgUrl} alt="" /></div>
                    <div className="sizeandfav mt-2">
                        <select className='size form-control w-75' onChange={handleChange}>
                            <option value="">Size</option>
                            {product.sizes.split("/").map((size, sizekey)=>{
                                return(<option key={sizekey} value={size}>{size}</option>)
                            })}
                        </select>
                        {GeneralResponse.favorites.find(item=>item.id == product.id) ? (<div className='addfavpd shadow bg-primary' onClick={()=>addFav(product)}><img src="/image/home/sale/heart.svg" alt="" /></div>):(<div className='addfavpd shadow' onClick={()=>addFav(product)}><img src="/image/home/sale/heart.svg" alt="" /></div>)}
                        
                    </div>
                    <div className="brandandprice">
                        <div className="brand"><h1>{product.brandName}</h1></div>
                        <div className="price">{product.oldPrice ? (<del><h1>${product.oldPrice}</h1></del>) : (null)} <h1 className='ms-2 text-primary'>${product.price}</h1></div>
                    </div>
                    <p className='productname mt-1'>{product.productName}</p>
                    <div className='d-flex mt-1 stars'>
                        {Array.from({ length: product.starCount }, (_, index) => <img src="/image/home/sale/star.svg" alt="" key={index} />)}
                        {Array.from({ length: 5 - product.starCount }, (_, index) => <img src="/image/home/sale/starinactive.svg" alt="" key={index} />)}
                        <p className='mb-0 fs-6'>({product.starPoint})</p>
                    </div>
                    <p className='longtext mt-2'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam veritatis commodi ipsum ea nihil dolores, dolorem, quasi quod maxime, voluptatum alias eos ex eligendi quo. Suscipit ex rerum dolorem assumenda.</p>
                    <div className='footer bg-white shadow-lg'>
                        {GeneralResponse.cart.find(item=>item.id == product.id) ? (
                            <div className='btngroup'>
                            <div className='btn btnleft btn-primary' onClick={productCountMinus}>-</div>
                            <div className='productcount '>
                                {GeneralResponse.cart.find(item=>item.id == product.id).count}
                            </div>
                            <div className='btn btnright btn-primary ' onClick={productCountPlus}>+</div>
                        </div>
                        ) : (
                            <button className='btn btn-lg btn-primary w-75' onClick={handleAddCart}>Add To Cart</button>
                        )}
                        
                    </div>
                </div>
            ) : (null)}



        </div>
    )
}

export default ProductDetails