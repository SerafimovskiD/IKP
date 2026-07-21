import Header from "./Header.jsx";
import {useNavigate} from "react-router-dom";

const Dashboard = () =>{
    const navigate =useNavigate();
    return (
        <div>
            <Header />
            <br/>
            <br/>
            <br/>
            <button onClick={() => navigate("/createPosta/nova?tipDelovnik=Ispratena")}>
                Ispratena
            </button>
            <button onClick={() => navigate("/createPosta/nova?tipDelovnik=Dobiena")}>
                Dobiena
            </button>
        </div>
    )
}
export default Dashboard;