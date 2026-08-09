import { Box, Typography } from '@mui/material';
import mvrLogoGold from '../../../public/mvrLogoGold.png'
const Dashboard = () => {
    return (
        <div style={{ textAlign: "center" }}>
            <img className="scale-down-center" src={mvrLogoGold} width="520px" height="520px" />
            <h1 style={{ textAlign: "center" }}>
                {/* Добредојдовте на <br />  */}
                НАСЛОВ НА АПЛИКАЦИЈАТА
            </h1>
            <h3>Министерство за внатрешни работи</h3>
        </div>
    );
};

export default Dashboard;