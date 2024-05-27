import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth, imageDb } from '../firebase'
import { Link } from 'react-router-dom'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'

function AddCollection() {
    const [error, setError] = useState(null)
    const [authUser, setAuthUser] = useState(null)
    const [collectionFormData, setCollectionFormData] = useState(
        {
            id: "",
            collectionName: "",
            collectionFor: "",
            collectionImgUrl: ""
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
        setCollectionFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
        console.log(collectionFormData)
    }
    function handleCheck() {
        if (collectionFormData.collectionName === "") {
            return "Enter The Collection Name!"
        } else if (collectionFormData.collectionFor === "") {
            return "Please Select Collection For!"
        } else if (collectionFormData.collectionImgUrl === "") {
            return "Please Upload Image!"
        } else {
            handleAddCollection()
            return null
        }
    }
    const handleAddCollection = async () => {
        try {
            await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/collection.json?auth=${await authUser.getIdToken()}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(collectionFormData)
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
        const imgRef = ref(imageDb, `collection/${v4()}`)
        try {
            await uploadBytes(imgRef, selFile)
            const downloadURL = await getDownloadURL(imgRef)
            setCollectionFormData(prevState => ({
                ...prevState,
                collectionImgUrl: downloadURL
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
                <label htmlFor="collectionName" className="form-label">Collection Name</label>
                <input type="text" name='collectionName' className="form-control" id="collectionName" value={collectionFormData.collectionName} onChange={handleChange} autoComplete='off' placeholder='Collection Name' />
            </div>
            <div className="mb-3 w-100">
                <label htmlFor="collectionFor" className="form-label">Collection For</label>
                <select className='form-control' id='collectionFor' name='collectionFor' value={collectionFormData.collectionFor} onChange={handleChange}>
                    <option value="">Selecet</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                </select>
            </div>
            <div className="mb-3 w-100">
                {collectionFormData.collectionImgUrl === "" ? (<label htmlFor="img" className="form-label">Upload Image</label>) : (null)}
                {collectionFormData.collectionImgUrl === "" ? (<div className='d-flex justify-content-between'>
                    <input type="file" name='img' className="form-control w-100" id="img" onChange={handleImgUpload} />
                </div>) : (null)}
                {collectionFormData.collectionImgUrl === "" ? (null) : (<div className='uploadedimg w-100 mt-3 rounded border shadow-sm'>
                    <img src={collectionFormData.collectionImgUrl} alt='productimg' className='rounded  shadow' />

                    <div className='removeuploadedfile' onClick={() => { setCollectionFormData({ ...collectionFormData, collectionImgUrl: "" }) }}>
                        <img src="../icons/close.svg" alt="" />
                    </div>
                </div>)}
            </div>
            <button className='btn btn-primary w-100'>Add Collection</button>
            <Link to="/admin" className='btn btn-outline-primary w-100 mt-3'>Cancel</Link>
        </form>
    )
}

export default AddCollection