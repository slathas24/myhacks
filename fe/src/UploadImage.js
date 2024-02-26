import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import PreviewComponent from './PreviewComponent';

const UploadImage = ({ uploadType }) => {
  const webcamRef = useRef(null);
  const [customerId, setCustomerId] = useState('');
  const [countryId, setCountryId] = useState('');
  const [currdate,setCurrDate]= useState(new Date());
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  //setCurrentDate(new Date().toString);
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };

  const handleCustomerIdChange = (event) => {
    setCustomerId(event.target.value);
  };

  const handleCountryIdChange = (event) => {
    setCountryId(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (uploadType === 'webcam' && !imageSrc) {
      alert('Please scan an image');
      return;
    }

    if (uploadType === 'file' && !selectedFile) {
      alert('Please select an image to upload');
      return;
    }

    if (!customerId) {
      alert('Please enter a customer ID');
      return;
    }
    if (!countryId) {
        alert('Please enter a Country Code');
        return;
      }
    const formData = new FormData();
    if (uploadType === 'webcam') {
      formData.append('file', dataURLtoFile(imageSrc, 'image.jpg'));
    } else if (uploadType === 'file') {
      formData.append('file', selectedFile);
    }
    formData.append('customerId', customerId);
    formData.append('countrycode',countryId);
    formData.append('timestamp',currdate);
    console.log(formData.getAll);
    try {
      const resp = await axios.post('http://localhost:9999/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(resp.status);
      if (resp.status===201) {
        console.log(resp.data);
        setLoading(true);
        setResponse(resp.data);
        console.log("response is ",response);
      }// Handle success
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error
    }
  };

  // Helper function to convert base64 to File object
  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div>
        <div>
          <h2>Cheque Upload </h2>
        </div>
     <div>
       <label>Customer ID:</label>
        <input type="text" value={customerId} onChange={handleCustomerIdChange} />
     </div>
     <div>
        <label>Country Code</label>
        <input type="text" value={countryId} onChange={handleCountryIdChange} />
     </div>
     <div>
        <label>Current Date</label>
        <input type="text" value={currdate} readOnly={true}  />
     </div>
      
      
    
      <h4>Upload Image</h4>
      {uploadType === 'webcam' && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
            height={480}
            videoConstraints={{
              facingMode: 'environment', // Use rear camera for mobile devices if available
            }}
          />
          <button onClick={captureImage}>Scan Image</button>
        </>
      )}
      {uploadType === 'file' && (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </>
      )}
      {imageSrc && (
        <div>
          <h2>Preview Scanned Image:</h2>
          <img src={imageSrc} alt="Scanned" />
        </div>
      )}
      <div>
      <button onClick={handleSubmit}>Upload Image</button>
      </div>
       
        {loading && <PreviewComponent responseData={response} />}
         
     </div>
  );
};

export default UploadImage;
