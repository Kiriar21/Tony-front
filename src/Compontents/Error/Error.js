import { Link } from 'react-router-dom';

export default function Error(props) {
    const T2S=props.T2S;
    T2S.cancel();
    return (
        <div>
            <p>Nie odnaleziono strony.</p>
            <Link to='/'>
                <button type='button' 
                    className="btn buttonReact buttonService">
                    Powrót
                </button>
            </Link>
        </div>
    )
}