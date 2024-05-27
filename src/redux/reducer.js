const INITIAL_STATE = {
    cart: [],
    favorites: [],
}
export default (state = INITIAL_STATE, action)=>{
    switch (action.type){
        case "ADD_TO_CART":
            return { ...state, cart: [...state.cart, action.payload] }
        case "ADD_TO_FAV":
            let producttofav = state.favorites.find(item=>item.id == action.payload.id)
            if(producttofav){
                let removeindexfav = state.favorites.indexOf(producttofav)
                let newfav = state.favorites
                newfav.splice(removeindexfav, 1)
                return { ...state, favorites: newfav }            
            }else{
             return { ...state, favorites: [...state.favorites, action.payload] }
            }
        case "PRODUCT_PLUS":
            let plusproduct = state.cart.find(item=>item.id == action.payload)
            let plusindex = state.cart.indexOf(plusproduct)
            if(plusproduct){
                let newcart = state.cart
                newcart[plusindex].count ++
                return { ...state, cart: newcart }
            }
        case "CLEAR_CART":
            let delcart = state.cart
            let dellenght = delcart.length
            delcart.splice(0,dellenght)
            return{...state, cart: delcart}
        case "PRODUCT_MINUS":
            let minusproduct = state.cart.find(item=>item.id == action.payload)
            let minusindex = state.cart.indexOf(minusproduct)
            if(minusproduct){
                let newcart = state.cart
                if(state.cart[minusindex].count==1){
                    newcart.splice(minusindex, 1)
                    return { ...state, cart: newcart }
                }else{
                    newcart[minusindex].count --
                    return { ...state, cart: newcart }
                }
                
            }
        case "PRODUCT_REMOVE_CART":
            let removeproduct = state.cart.find(item=>item.id == action.payload)
            let removeindex = state.cart.indexOf(removeproduct)
            let newcart = state.cart
            newcart.splice(removeindex, 1)
            return { ...state, cart: newcart }            
        default:
            return state;
    }
}