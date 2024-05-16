import { connect } from "react-redux";
import App from "../App";

const mapStateToProps = (state) => ({
  auth: state.auth,
  cartItems: state.cart.cartItems
});

export default connect(mapStateToProps)(App);
