import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect  } from 'react';

export default function Account(props) {

    const T2S=props.T2S;
    T2S.cancel();
    const [data, setData] = useState([]);

    const handleGetInformation = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };      
        const response = await axios.get(process.env.REACT_APP_API_ACCOUNT, config);
        setData(response.data);
      } catch (e) {
        console.error(e);
      }
      return true;
    };
  
    useEffect(() => {
      handleGetInformation();
    }, []);

    const propertiesData = [
        { property: "Imię", value: data.Name },
        { property: "Wiek", value: data.Age },
        { property: "Płeć", value: data.Gender },
        { property: "Język", value: data.Language },
        { property: "Poziom", value: data.Level },
        { property: "Hobby", value: data.Hobby },
        { property: "Typ zajęć", value: data.Type },
        { property: "Limit zapytań", value: data.Limit },
        { property: "Wykorzystane zapytania", value: data.Counter },
      ];
     
    return (
        <div className='card bg-dark rounded-5' >
            <h2 className="card-title text-white my-5">Informacje o użytkowniku</h2>
            <div className="table-responsive">
                <table className="table table-dark table-striped">
                    <thead>
                    <tr>
                        <th scope="col">Właściwość</th>
                        <th scope="col">Dane</th>
                    </tr>
                    </thead>
                    <tbody>
                    {propertiesData.map((property, index) => (
                        <tr key={index}>
                            <td>{property.property}</td>
                            <td>{property.value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Link to='/'>
                <button type='button' 
                    className="btn buttonReact buttonService py-3">
                    Powrót
                </button>
            </Link>
        </div>
    )
}