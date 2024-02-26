import React,{useState} from 'react';
import axios from 'axios';

const PreviewComponent = ({ responseData }) => {
    const [nulstate,setNulState] = useState(false);
    //responseData.micr=null;
//const jsonObject = JSON.parse(responseData)
  const hasNulValue = (obj) => {
    for (let key in obj) {
      if (obj[key] === null) {
        console.log("nullfound")
        return true;
       // break;
      }
      
    }
    return false;
}
  
    const  ProceedPost = async () => {
    try {
     const resp = await axios.post('http://localhost:9089/postchq/self', responseData, {
        headers: {
          'Content-Type': 'application/json'
        }
    })
     console.log('Response:', resp.data);
     } catch (error) {
      console.error('Error:', error);
      // Handle error
    }

    } 

  return (
    <div>
      <h2>Cheque Response Preview</h2>
      <h3>Preview:</h3>
      <div>{responseData.accountNo}</div>
      <pre>{JSON.stringify(responseData, null, 2)}</pre>
      <div>
      {hasNulValue(responseData) ? (     
        <h1>Invalid </h1>  
     ):(
      <button onClick={ProceedPost}>"Proceed Cheque ?" </button>)   
     }
      </div>
    </div>
    
    
  );
};

export default PreviewComponent;