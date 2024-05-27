import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth, imageDb } from '../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'

function AddCategory() {
    const [error, setError] = useState(null)
    const [authUser, setAuthUser] = useState(null)
    const [categoryFormData, setCategoryFormData] = useState(
        {
            id: "",
            categoryName: "",
            categoryFor: "",
            categoryImgUrl: ""
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
        console.log(categoryFormData)
    }

    function handleCheck() {
        if(categoryFormData.categoryName === ""){
            return "Enter The Category Name!"
        }else if(categoryFormData.categoryFor === ""){
            return "Please Selecet Category For!"
        }else if(categoryFormData.categoryImgUrl === ""){
            return "Please Upload Image!"
        }else{
            handleAddCategory()
            return null
        }
    }
    const handleAddCategory = async() =>{
        try {
            await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/category.json?auth=${await authUser.getIdToken()}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(categoryFormData)
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
        }, 1500);
    }
    const handleImgUpload = async (e) => {
        const selectedFile = e.target.files[0]
        requestDataBase(selectedFile)
    }
    const requestDataBase = async (selFile) => {
        const imgRef = ref(imageDb, `category/${v4()}`)
        try {
            await uploadBytes(imgRef, selFile)
            const downloadURL = await getDownloadURL(imgRef)
            setCategoryFormData(prevState => ({
                ...prevState,
                categoryImgUrl: downloadURL
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
                <label htmlFor="categoryName" className="form-label">Category Name</label>
                <input type="text" name='categoryName' className="form-control" id="categoryName" value={categoryFormData.categoryName} onChange={handleChange} autoComplete='off' placeholder='Category Name' />
            </div>
            <div className="mb-3 w-100">
                <label htmlFor="categoryFor" className="form-label">Category For</label>
                <select className='form-control' id='categoryFor' name='categoryFor' value={categoryFormData.categoryFor} onChange={handleChange}>
                    <option value="">Selecet</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                </select>
            </div>
            <div className="mb-3 w-100">
                {categoryFormData.categoryImgUrl === "" ? (<label htmlFor="img" className="form-label">Upload Image</label>) : (null)}
                {categoryFormData.categoryImgUrl === "" ? (<div className='d-flex justify-content-between'>
                    <input type="file" name='img' className="form-control w-100" id="img" onChange={handleImgUpload} />
                </div>) : (null)}
                {categoryFormData.categoryImgUrl === "" ? (null) : (<div className='uploadedimg w-100 mt-3 rounded border shadow-sm'>
                    <img src={categoryFormData.categoryImgUrl} alt='productimg' className='rounded  shadow' />

                    <div className='removeuploadedfile' onClick={() => { setCategoryFormData({ ...categoryFormData, categoryImgUrl: "" }) }}>
                        <img src="../icons/close.svg" alt="" />
                    </div>
                </div>)}
            </div>
            <button className='btn btn-primary w-100'>Add Category</button>
            <Link to="/admin" className='btn btn-outline-primary w-100 mt-3'>Cancel</Link>
        </form>
    )
}

export default AddCategory