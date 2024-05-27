import React from 'react'
const order = {
    orderId: "good",
    orderOwnerEmail: "email",
    orderStatus: "wow",
    products: [{id:"nice"},{id:"bad"}]
}
function Test() {
     const sendData = async() => {
        try{
            await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/orders.json`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(order)
                })
        }catch(error){
            console.log(error.message)
        }
     }
  return (
    <div className='btn btn-outline-success  mt-3' onClick={sendData}>Send Button</div>
  )
}

export default Test