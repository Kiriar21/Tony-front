import { Link } from "react-router-dom"
import styles from "./Home.module.css";

export default function Home(props) {
    const T2S=props.T2S;
    T2S.cancel();
    return (
        <>
            <div className={styles['homeMainContent']}>
                <div className={styles['homeService']}>
                    <div className="card bg-dark rounded-5">
                        <div className="card-body">
                            <p className="card-title text-white">Porozmiawiaj z TONYM!</p>
                            <Link to="/talk">
                                <button  id="talkID" type="button"
                                    className="btn buttonReact buttonService py-3">
                                        Rozmawiaj
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={styles['homeService']}>
                
                    <div className="card bg-dark rounded-5">
                        <div className="card-body">
                            <p className="card-title text-white">Popisz z TONYM!</p>
                            <Link  to="/">
                                <button type="button" disabled
                                    className="btn buttonReact buttonService text-white py-3">
                                        SOON...
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={styles['homeService']}>

                    <div className="card bg-dark rounded-5">
                        <div className="card-body">
                            <p className="card-title text-white">???</p>
                            <Link to="/">
                                <button type="button" 
                                    className="btn buttonReact buttonService text-white py-3" disabled>
                                        SOON...
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                </div>
        </>
    )
}