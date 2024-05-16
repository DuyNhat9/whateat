import LoginPage from "../pages/LoginPage/LoginPage";
import { login } from "../reducers/auth";

import { connect } from "react-redux";

const mapActionsToProps = { login };

export default connect(null, mapActionsToProps)(LoginPage);
