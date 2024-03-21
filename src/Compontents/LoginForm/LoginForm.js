import axios from 'axios';
import { useState } from 'react';
import styles from "./LoginForm.module.css";

function LoginForm() {
    const [errMessagestate, setErrMessageState] = useState(false)
    const [errMessage, setErrMessage] = useState('')
    const [login, setLogin] = useState()

    const handleLoginSubmit = async (e) => {
        e.preventDefault();        
        if(login) {
            try {
                const response = await axios.post(process.env.REACT_APP_API_LOGIN, {
                    userId: login,
                });

                if (response.data?.accessToken) {
                    sessionStorage.setItem("accessToken", response.data.accessToken);
                    setErrMessageState(false);
                    window.location.href = '/';
                }
            } catch (err) {
                setErrMessage("Niepoprawny login")  
                setErrMessageState(true);
            }
        } else {
            setErrMessage("Nie wprowadzono loginu")  
            setErrMessageState(true);
        }
    }

    return (
        <main>
            <form onSubmit={handleLoginSubmit} className={styles['formLoginForm']}>
                <div className="form-group px-sm-5 ">
                    <label htmlFor="login" className="text-dark py-2">Wprowadź login</label>
                    <input type="text" id="login" className="form-control form-control-lg" 
                        placeholder="login" name="login" aria-describedby="emailHelp"
                        onChange={(e) => setLogin(e.target.value)} 
                    />
                    <small id="emailHelp" className="form-text text-muted">Podajemy swój identyfikator.</small>
                </div>
                
                    { errMessagestate && (<
                        div className="alert alert-danger text-center text-danger mt-5"> {errMessage} </div>
                    )} 
                
                <div className="text-center">
                    <input type="submit" className="btn buttonReact py-3" value={"Zaloguj"} />
                </div>
            </form>
        </main>
    )
}

export default LoginForm;