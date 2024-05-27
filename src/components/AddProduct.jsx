import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth, imageDb } from '../firebase'
import { Link } from 'react-router-dom'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'

function AddProduct() {
    const [authUser, setAuthUser] = useState(null)
    const [error, setError] = useState(null)
    const [categoryes, setCategories] = useState(null)
    const [collections, setCollections] = useState(null)
    const [productFormData, setProductFormData] = useState(
        {
            id: "",
            isSale: false,
            salePer: "",
            isNew: false,
            imgUrl: "",
            starCount: "",
            starPoint: "",
            brandName: "",
            productName: "",
            oldPrice: "",
            price: "",
            favorite: false,
            categoryId: "",
            collectionId: "",
            productFor: "",
            sizes: ""
        }
    )
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
            } else {
                setAuthUser(null)
                window.location.href = "/login"
            }
        })


        return () => {
            listen()
        }
    }, [])

    useEffect(() => {
        const getCategoryData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/category.json`)
                let resData = await response.json()
                let arr = []
                for (const key in resData) {
                    if (resData[key].categoryFor === productFormData.productFor) {
                        arr.push({ ...resData[key], id: key })
                    }

                }
                setCategories(arr)
            } catch (error) {
                console.log(error)
            }
            const getCollectionData = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/collection.json`)
                    let resData = await response.json()
                    let arr = []
                    for (const key in resData) {
                        if(resData[key].collectionFor === productFormData.productFor){
                            arr.push({ ...resData[key], id: key })
                        }
                        
                    }
                    setCollections(arr)
                } catch (error) {
                    console.log(error)
                }
            }

            getCollectionData()
        }
        getCategoryData()
    }, [productFormData.productFor])

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setProductFormData(prevState => ({
            ...prevState,
            [name]: (name === "salePer" || name === "salePer" || name === "oldPrice" || name === "price" || name === "starPoint" || name === "starCount") ? (Number(value)) : (name === "isNew" || name === "isSale" ? (checked) : (value))
        }))
        console.log(productFormData)

    }
    function handleCheck() {
        if (productFormData.brandName === "") {
            return "Enter The Brand Name!"
        } else if (productFormData.productName === "") {
            return "Enter The Product Name"
        } else if (productFormData.price === "" || productFormData.price <= 0) {
            return "Price Can't Be Left Blank And Can't Be 0 ! (Min: 1)"
        } else if (productFormData.starCount === "" || productFormData.starCount < 0 || productFormData.starCount > 5) {
            return "The Star Count Should Not Be Left Empty. (Min: 0, Max: 5) !"
        } else if (productFormData.starPoint === "" || productFormData.starPoint < 0 || productFormData.starPoint > 10) {
            return "The Star Point Should Not Be Left Empty. (Min: 0, Max: 10) !"
        } else if (productFormData.imgUrl === "") {
            return "Please upload Product Image!"
        } else if (productFormData.productFor === "" ) {
            return "Please Selecet Product For!"
        } else if (productFormData.categoryId === "") {
            return "Please Selecet Category!"
        } else if (productFormData.isSale) {
            if (productFormData.salePer === "" || productFormData.salePer <= 0 || productFormData.salePer > 100) {
                return "Discount percentage Should Not Be Left Empty And Can't Be 0 ! (Min: 1, Max: 100)"
            } else if (productFormData.oldPrice === "" || productFormData.oldPrice <= 0) {
                return "Old Price Can't Be Left Blank And Can't Be 0 ! (Min: 0)"
            } else {
                handleAddProduct()
                return null
            }
        } else {
            handleAddProduct()
            return null
        }



    }
    const handleAddProduct = async () => {
        try {
            await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/products.json?auth=${await authUser.getIdToken()}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productFormData)
                })
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setError(handleCheck())
        setTimeout(() => {
            setError(null)
        }, 2500);

    }
    const handleImgUpload = async (e) => {
        const selectedFile = e.target.files[0]
        requestDataBase(selectedFile)
    }
    const requestDataBase = async (selFile) => {
        const imgRef = ref(imageDb, `product/${v4()}`)
        try {
            await uploadBytes(imgRef, selFile)
            const downloadURL = await getDownloadURL(imgRef)
            setProductFormData(prevState => ({
                ...prevState,
                imgUrl: downloadURL
            }))

        } catch (error) {
            switch (error.code) {
                case "storage/unauthorized":
                    setError(`${selFile.name} Failed To Upload To Server!\nYou Don't Have Permission To Upload Image!`)
                    break;
                case "storage/canceled":
                    setError(`${selFile.name} Canceled To Upload To Server!\nTry Again!`)
                    break;
                case "storage/unknown":
                    setError(`${selFile.name} Failed To Upload To Server!\nTry Again!`)
                    break;
                case "storage/network-error":
                    setError(`${selFile.name} Failed To Upload To Server!\nTry Again!`)
                    break;
                case "file/invalid-file-type":
                    setError(`${selFile.name} Failed To Upload To Server!\nInvalid File Type!`)
                    break;
                case "file/file-too-large":
                    setError(`${selFile.name} Failed To Upload To Server!\nFile Too Large!`)
                    break;
                default:
                    setError("Unknown Error Occurred\nTry Again İn a Few Minutes!")
                    break
            }
            setTimeout(() => {
                setError(null)
            }, 2500);
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className='pt-3'>

            <h1>Create Product</h1>
            {error ? (<div className='alert alert-danger error mt-3 mb-3 w-75'>{error}</div>) : (null)}
            <div className="mb-3 w-100">
                <label htmlFor="brandName" className="form-label">Brand Name</label>
                <input type="text" name='brandName' className="form-control" id="brandName" value={productFormData.brandName} onChange={handleChange} autoComplete='off' placeholder='Product Beand Name' />
            </div>
            <div className="mb-3 w-100">
                <label htmlFor="productName" className="form-label">Product Name</label>
                <input type="text" name='productName' className="form-control" id="productName" value={productFormData.productName} onChange={handleChange} autoComplete='off' placeholder='Product Name' />
            </div>
            {productFormData.isSale ? (
                <div className="mb-3 w-100">
                    <label htmlFor="salePer" className="form-label">Discount percentage</label>
                    <input type="number" name='salePer' className="form-control" id="salePer" value={productFormData.salePer} onChange={handleChange} autoComplete='off' placeholder='Product Discount Percentage' />
                </div>
            ) : (null)}
            {productFormData.isSale ? (
                <div className="mb-3 w-100">
                    <label htmlFor="oldPrice" className="form-label">Old Price</label>
                    <input type="number" name='oldPrice' className="form-control" id="oldPrice" value={productFormData.oldPrice} onChange={handleChange} autoComplete='off' placeholder='Before Discount Price' />
                </div>
            ) : (null)}
            <div className="mb-3 w-100">
                <label htmlFor="price" className="form-label">Price</label>
                <input type="number" name='price' className="form-control" id="price" value={productFormData.price} onChange={handleChange} autoComplete='off' placeholder={productFormData.isSale ? ("After Discount Price") : ("Product Price")} />
            </div>
            <div className="mb-3 w-100">
                <label htmlFor="starCount" className="form-label">Star Count</label>
                <input type="number" name='starCount' className="form-control" id="starCount" value={productFormData.starCount} onChange={handleChange} autoComplete='off' placeholder='Min-0, Max-5' />
            </div>
            <div className="mb-3 w-100">
                <label htmlFor="starPoint" className="form-label">Star Point</label>
                <input type="number" name='starPoint' className="form-control" id="starPoint" value={productFormData.starPoint} onChange={handleChange} autoComplete='off' placeholder='Min-0, Max-10' />
            </div>
            <div className="mb-3 w-100">
                {productFormData.imgUrl === "" ? (<label htmlFor="img" className="form-label">Upload Image</label>) : (null)}
                {productFormData.imgUrl === "" ? (<div className='d-flex justify-content-between'>
                    <input type="file" name='img' className="form-control w-100" id="img" onChange={handleImgUpload} />
                </div>) : (null)}

                {productFormData.imgUrl === "" ? (null) : (<div className='uploadedimg w-100 mt-3 rounded border shadow-sm'>
                    <img src={productFormData.imgUrl} alt='productimg' className='rounded  shadow' />

                    <div className='removeuploadedfile' onClick={() => { setProductFormData({ ...productFormData, imgUrl: "" }) }}>
                        <img src="../icons/close.svg" alt="" />
                    </div>
                </div>)}
            </div>
            <div className="mb-3 w-100">
                <label htmlFor="productFor" className="form-label">Product For</label>
                <select className='form-control' id='productFor' name='productFor' value={productFormData.productFor} onChange={handleChange}>
                    <option value="">Selecet</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>

                </select>
            </div>

            <div className="mb-3 w-100">
                <label htmlFor="categoryId" className="form-label">Select Category</label>
                <select className='form-control' id='categoryId' name='categoryId' value={productFormData.categoryId} onChange={handleChange}>
                    <option value="">Selecet Category</option>
                    {categoryes == null ? (null) : (
                        categoryes.map((category, categorykey) => {
                            return (<option value={category.id} key={categorykey}>{category.categoryName}</option>)
                        })
                    )}
                </select>
            </div>
            <div className="mb-3 w-100">
                <label htmlFor="collectionId" className="form-label">Select Collection</label>
                <select className='form-control' id='collectionId' name='collectionId' value={productFormData.collectionId} onChange={handleChange}>
                    <option value="">Selecet Collection</option>
                    {collections == null ? (null) : (
                        collections.map((collection, collectionkey) => {
                            return (<option value={collection.id} key={collectionkey}>{collection.collectionName}</option>)
                        })
                    )}
                </select>
            </div>
            <div className="mb-3 w-100">
                <label htmlFor="sizes" className="form-label">Size</label>
                <input type="text" name='sizes' className="form-control" id="sizes" value={productFormData.sizes} onChange={handleChange} autoComplete='off' placeholder='XL/2XL/3XL' />
            </div>
            
            {productFormData.isNew ? (null) : (
                <div className="mb-3 w-100">
                    <div className='d-flex '><input type="checkbox" name='isSale' className="form-check" id="isSale" checked={productFormData.isSale} onChange={handleChange} autoComplete='off' placeholder='' /><p className='mb-0 ms-2'>Have Sale</p></div>
                </div>
            )}
            {productFormData.isSale ? (null) : (
                <div className="mb-3 w-100">
                    <div className='d-flex '><input type="checkbox" name='isNew' className="form-check" id="isNew" checked={productFormData.isNew} onChange={handleChange} autoComplete='off' placeholder='' /><p className='mb-0 ms-2'>New</p></div>
                </div>
            )}
            <button className='btn btn-primary w-100'>Add Product</button>
            <Link to="/admin" className='btn btn-outline-primary w-100 mt-3'>Cancel</Link>
        </form>
    )
}

export default AddProduct