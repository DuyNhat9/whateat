import { connect } from 'react-redux'

import Cart from '../components/Cart/Cart'
import { addItemToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart } from '../reducers/cart'

const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems
})

const mapActionsToProps = (dispatch) => ({
    addItemToCart: (item) => dispatch(addItemToCart(item)),
    increaseQuantity: (id) => dispatch(increaseQuantity(id)),
    decreaseQuantity: (id) => dispatch(decreaseQuantity(id)),
    removeItem: (id) => dispatch(removeItem(id)),
    clearCart: () => dispatch(clearCart()),
})

export default connect(mapStateToProps, mapActionsToProps)(Cart)