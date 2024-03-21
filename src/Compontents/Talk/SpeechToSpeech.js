import { useRef, useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import axios from 'axios';
import styles from './SpeechToSpeech.module.css'

export default function SpeechToSpeech(props) {

    // Main variables start

    const textRef = useRef(null);
    let lastTranscript = '';
    const [items, setItems] = useState([]);
    const [langOut, setlangOut] = useState('pl-PL')
    const T2S = props.T2S;
    const [limit, setLimit] = useState();
    const [counter, setCounter] = useState();

    const itemsHistory = [];

    const voiceSpeaker = window.speechSynthesis.getVoices().filter(x => x.name.includes('Multilingual')).find(x => x.name === "Microsoft RemyMultilingual Online (Natural) - French (France)" || x[0]);
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    var talkInterval;
    let langT2S = [
        {mode:'Polski', lang: 'pl-PL', name: voiceSpeaker},
        {mode:'Angielski US', lang: 'en-US', name: voiceSpeaker},
        {mode:'Angielski UK', lang: 'en-GB', name: voiceSpeaker},
        {mode:'Francuski', lang: 'fr-FR', name: voiceSpeaker},
        {mode:'Niemiecki', lang: 'de-DE', name: voiceSpeaker},
        {mode:'Włoski', lang: 'it-IT', name: voiceSpeaker},
        {mode:'Hiszpański', lang: 'es-ES', name: voiceSpeaker},
        {mode:'Rosyjski', lang: 'ru-RU', name: voiceSpeaker},
    ]
    
    // Main variables end

    // User data start
    const [data, setData] = useState([]);
    const handleGetInformation = async () => {
        try {
        const token = sessionStorage.getItem('accessToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };      
        const response = await axios.get(process.env.REACT_APP_API_ACCOUNT, config);
        const data = await response.data;
        setData(data);
        setLimit(data.Limit);
        setCounter(data.Counter);
        } catch (e) {
            console.error("Error" + e);
        }
        return true;
    };

    useEffect(() => {
        handleGetInformation();
    }, [counter, limit]);

        
    // User data end
    

    //Text do Speech start

    const text2Speech = async (content) => { 

        document.getElementById("pauseButton").removeAttribute("disabled","disabled");
        document.getElementById("endButton").removeAttribute("disabled","disabled");
        
        const utter = new SpeechSynthesisUtterance(content.toString().replace('"', ` " `));
        utter.lang = langOut.toString();
        utter.voice = langT2S.find(x => x.lang === langOut.toString()).name;
        let isPlaying = false;
        let isPause = false;
        T2S.speak(utter);
        isPlaying = true;
        talkInterval = setInterval(() => {
            if(!isPlaying) {
                if(talkInterval) {
                    clearInterval(talkInterval);
                }
            } else {
                if(isPause) {
                    T2S.pause();
                } else {
                    T2S.resume();
                }
            } 
         }, 100);

        document.getElementById('pauseButton').addEventListener('click', () => {
            isPause = !isPause;
            if (isPause) {
                document.getElementById("talkButton").innerHTML = "Tony czeka!";   
                document.getElementById("pauseButton").innerHTML = "Wznów";   
            } else {
                document.getElementById("talkButton").innerHTML = "Tony mówi!";   
                document.getElementById("pauseButton").innerHTML = "Zatrzymaj";   
            }
        });
        document.getElementById('endButton').addEventListener('click', () => {
            document.getElementById("talkButton").innerHTML = "Rozmawiaj!";
            document.getElementById("talkButton").removeAttribute("disabled","disabled");
            document.getElementById("pauseButton").setAttribute("disabled","disabled");
            document.getElementById("endButton").setAttribute("disabled","disabled");
            T2S.cancel();
            isPlaying = false;
            clearInterval(talkInterval);
        });

        utter.onend = () => {
            isPlaying = false;
            clearInterval(talkInterval);    
            document.getElementById("talkButton").innerHTML = "Rozmawiaj!";
            document.getElementById("talkButton").removeAttribute("disabled","disabled");
            document.getElementById("pauseButton").setAttribute("disabled","disabled");
            document.getElementById("endButton").setAttribute("disabled","disabled");
        }

        T2S.onerror = (error) => {
            alert("Wystąpił nieoczekiwany błąd. Spróbuj wylogować sie i zalogować. Pamietaj, że nasza aplikacja domyślnie jest wspierana przez Microsoft Edge. Jeżeli korzystasz z innej przegladarki zalecane jest przełączenie się na Microsoft Edge.");
        }


        const today = new Date();
        const hour = String(today.getHours()).padStart(2, '0');
        const minute = String(today.getMinutes()).padStart(2, '0');
        const second = String(today.getSeconds()).padStart(2, '0');
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const contentAI = {
            author:`${"Tony - Asystent Glosowy"}`,
            content:`${content}`,
            lang:`${langOut}`,
            time:`Godzina: ${hour}:${minute}.${second}\nData: ${day}.${month}.${year}`,
        }

        itemsHistory.unshift(contentAI);

        setItems( prevItems => {
            return [contentAI, ...prevItems];
        });
        
        window.onbeforeunload = function(){
            T2S.cancel(); 
        }
    }

    // Text to Speech end

    // API SI start 

    const handleGetAiAnswer = async () => {
        try {
            const token = sessionStorage.getItem('accessToken');
            const tempItmes = itemsHistory.map(obj => obj.content);
            const config = {
                token: `Bearer ${token}`,
                input: JSON.stringify(tempItmes),
                langOut: langOut,
            };      
            await axios.post(process.env.REACT_APP_API_TALK, config)
                .then((res) => {
                    document.getElementById("talkButton").innerHTML = "Tony mówi!";
                    setLimit(res.data.limit);
                    setCounter(res.data.counter);
                    text2Speech(`${res.data.messageAi}`);
            })
            .catch((err) => {
                if (err.response) {
                    console.error("Server returned an error: ", err.response.status);
                    console.error(err.response.data);
                } else if (err.request) {
                    console.error("Network error: ", err.request);
                } else {
                    console.error("Client side error: ", err.message);
                }
                console.error(err.config);
            });
        } catch (e) {
            console.error("Error" + e);
        }

        return;
    };

    // API SI end

    // Speech to text start 

    const speech2Text = () => {
        document.getElementById("talkButton").setAttribute("disabled", "disabled");
        document.getElementById("talkButton").innerHTML = "Tony słucha!";
        let speech = true;
        let error = false;
        try {
            if(recognition) {
                    recognition.continuous = false; 
                    recognition.lang = langOut.toString();
                    recognition.interimResults = true;
                    recognition.maxAlternatives = 1;

                    recognition.addEventListener('start', (e) => {});
                    recognition.addEventListener('error', (event) => {
                        switch (event.error) {
                            case 'audio-capture':
                                alert('Nie można uzyskać dostępu do mikrofonu.');
                                break;
                            case 'not-allowed':
                                alert('Użytkownik odmówił dostępu do mikrofonu.');
                                break;
                            case 'aborted':
                                alert('Rozpoznawanie zostało przerwane przez użytkownika.');
                                break;
                            default:
                                alert('Wystąpił nieznany błąd. Prawdopodobnie twoja przeglądarka nie obsługuje funkcji strony lub Tony nic nie usłyszał. Zalecamy korzystanie z Microsoft Edge.');
                        }
                        document.getElementById("talkButton").innerHTML = "Rozmawiaj!";
                        document.getElementById("talkButton").removeAttribute("disabled","disabled");
                        document.getElementById("pauseButton").setAttribute("disabled","disabled");
                        document.getElementById("endButton").setAttribute("disabled","disabled");
                        T2S.cancel();
                        clearInterval(talkInterval);
                        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
                            alert('Wystąpił nieznany błąd. Prawdopodobnie twoja przeglądarka nie obsługuje funkcji strony. Zalecamy korzystanie z Microsoft Edge.');
                            return;
                        }
                        error = true;
                    });

                    recognition.addEventListener('result', (e) => {
                    const transcript = Array.from(e.results)
                        .map((result) => result[0])
                        .map((result) => result.transcript);

                    if (textRef && textRef.current) {
                        textRef.current.innerText = transcript;
                        lastTranscript = transcript;
                    }
                    });

                    recognition.addEventListener('end', (e) => {
                        textRef.current.innerText = '';  
                        if(!error) {
                            const today = new Date();
                            const hour = String(today.getHours()).padStart(2, '0');
                            const minute = String(today.getMinutes()).padStart(2, '0');
                            const second = String(today.getSeconds()).padStart(2, '0');
                            const year = today.getFullYear();
                            const month = String(today.getMonth() + 1).padStart(2, '0');
                            const day = String(today.getDate()).padStart(2, '0');
                            const content = {
                                author:`${data.Name}`,
                                content:`${lastTranscript}`,
                                lang:`${langOut}`,
                                time:`Godzina: ${hour}:${minute}.${second}\nData: ${day}.${month}.${year}`,
                            }
                            
                            if(itemsHistory.length > 20) {
                                itemsHistory.pop();
                                itemsHistory.pop();
                            } 
                            itemsHistory.unshift(content);

                            setItems( prevItems => {
                                return [content, ...prevItems];
                            });

                            handleGetAiAnswer();
                            document.getElementById("talkButton").innerHTML = "Tony myśli!";
                        } else {
                            
                        }                    
                    });

                    if (speech === true) {
                        recognition.start();
                    }
                }
            } catch (e) {
               alert('Wystąpił nieznany błąd. Prawdopodobnie twoja przeglądarka nie obsługuje funkcji strony. Zalecamy korzystanie z Microsoft Edge.');
            }
    }

    return (
        <div className='card bg-dark rounded-5 text-white'>
            <h2 className="card-title  my-5">Rozmowa z TONYM</h2>
            <div>
                Wykorzystane zapytania { counter} z { limit}
            </div>
            <div>
               <p id="error"></p>
            </div>


            { !window.speechSynthesis.getVoices().filter(x => x.name.includes('Multilingual')).find(x => x.name === "Microsoft RemyMultilingual Online (Natural) - French (France)" || x[0]) ? ( 
                <p className=" my-5 px-5">Niestety, ale nie posiadasz zainstalowanego odpowiedniego głosu, żeby korzystać z aplikacji. Doinstaluj wielojęzykowy głos i spróbuj ponownie. Nie wiesz jak to zrobić? Najprościej otwórz jakąś strone w przeglądarce Microsoft EDGE i kliknij prawy przycisk myszy. Następnie wciśnij - czytaj na głos. Wyłącz w prawym górnym rogu lektora i odśwież tą stronę.</p>  
            ) : ( 
                
                <div>
                        <div id="limit" className={`my-5 ${(counter >= limit) ? '' : 'd-none'}`} >
                            <p>
                                Wykorzystano wszystkie dostępne zapytania
                            </p>
                            <button type="button" id="payment" disabled className={`btn btn-success py-3 my-5 fw-bold ${styles.buttonTalk}`}>Dokup więcej</button>
                        </div>
                
                    <div className="my-5">
                        <div style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }} className="">

                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <label htmlFor="sourceLang">Wybierz język rozmowy </label>
                                <select className=" bg-dark my-5 text-white" name="sourceLang" value={langOut} onChange={(e) => setlangOut(e.target.value)} id="sourceLang">
                                    {langT2S.map((language, idx) => (
                                        <option key={idx} value={language.lang}>
                                            {language.mode}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={`py-5 ${counter >= limit ? 'd-none' : ''}`}>
                            <button type="button" onClick={speech2Text} id="talkButton" className={`btn btn-primary  py-3 my-5 fw-bold ${styles.buttonTalk}`}>Rozmawiaj!</button>
                            <button type="button" id="pauseButton" disabled className={`btn btn-primary py-3  my-5 fw-bold ${styles.buttonTalk}`}>Zatrzymaj</button>
                            <button type="button" id="endButton" disabled className={`btn btn-primary py-3  my-5 fw-bold ${styles.buttonTalk}`}>Zakończ mówienie</button>
                            <Link to='/'><button className={`btn btn-danger fw-bold py-3 ${styles.buttonTalk}`}>Zakończ rozmowe</button></Link>
                        </div>

                        <span id="Text" className='' ref={textRef}></span>
                        
                        <div className="">
                            {
                                Object.keys(items).map((item, index) => (
                                    <div key={index} className={`${items[item].author === 'Tony - Asystent Glosowy' ? 'text-start' : 'text-end'} px-5 pb-5`}>
                                        <p>{items[item].time}</p>
                                        <p>{items[item].author} {items[item].author === 'Tony - Asystent Glosowy' ? '(Tony AI)' : '(Ty)'} - {langT2S.find(x => x.lang === items[item].lang).mode}</p>
                                        <p>Treść:&nbsp;{items[item].content}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    )
}
