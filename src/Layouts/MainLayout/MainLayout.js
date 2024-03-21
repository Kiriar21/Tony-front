import Footer from "../../Compontents/Footer/Footer";
import Header from "../../Compontents/Header/Header";
import Navigation from "../../Compontents/Navigation/Navigation";
import { useLocation } from "react-router-dom";
export default function MainLayout(props) {

    const location = useLocation();

    return (
        <>
            <Header />
            { !(location.pathname === '/login') && <Navigation />}
            <main>
                {props.children}        
            </main>
            <Footer />
        </>

    )
}