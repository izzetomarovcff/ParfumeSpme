export const AddToCart = product =>{
    return {
        type: 'ADD_TO_CART',
        payload: product
    }
}
export const AddToFav = product =>{
    return {
        type: 'ADD_TO_FAV',
        payload: product
    }
}
export const ProductPlus = id =>{
    return {
        type: 'PRODUCT_PLUS',
        payload: id
    }
}
export const ProductMinus = id =>{
    return {
        type: 'PRODUCT_MINUS',
        payload: id
    }
}
export const ProductRemoveCart = id =>{
    return {
        type: 'PRODUCT_REMOVE_CART',
        payload: id
    }
}
export const ClearCart = () =>{
    return {
        type: 'CLEAR_CART',
    }
}
