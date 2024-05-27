import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function MenCategory() {
    const [categoryData, setcategoryData] = useState([])
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/category.json`)
                let resData = await response.json()
                let arr = []
                for (const key in resData) {
                    if (resData[key].categoryFor === "men") {
                        arr.push({ ...resData[key], id: key })
                    }
                }
                setcategoryData(arr)
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])
    return (
        <div className='categories'>
            {categoryData.length == 0 ? (null) : (
                categoryData.map((category, categorykey) => {
                    return (
                        <Link to={`/shop/men/category/${category.id}`} key={categorykey}>
                            <div className='category mt-3 rounded shadow-sm'>
                                <div className='categorytext'>{category.categoryName}</div>
                                <div className='categoryimg'>
                                    <img src={category.categoryImgUrl} alt="" />
                                </div>
                                
                            </div>
                        </Link>
                    )
                })
            )}
        </div>
    )
}

export default MenCategory