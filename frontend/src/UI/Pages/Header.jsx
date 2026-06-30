import {useAuth} from "../../context/AuthContext.jsx";

const Header = () => {
    const {logout,user} = useAuth();
    console.log(user);
    return (
        <div>
            <h1 className="text-center text-gray-500 mb-6">asd</h1>
            <button
                onClick={() => logout()}
            >
                Logout
            </button>
        </div>
    )
}
export default Header;