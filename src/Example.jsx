import React, {useRef,useEffect, useState } from 'react';
import axios from 'axios';
import './Example.css';
import { TiArrowRightOutline } from 'react-icons/ti';

const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const model = "whisper-1";



const Example = () => {
    
  const inputRef = useRef();
  const [file,setFile] = useState();
  const [response, setResponse] = useState('');
  const [showKeyPointer, setShowKeyPointer] = useState(false);
  
  const onChangeFile =()=>{
    setFile(inputRef.current.files[0]);
  };
  
  useEffect(()=>{
    const fetchAudioFile = async () =>{
      if(!file){
        return;
      }
      const formData = new FormData();
      formData.append("model", model);
      formData.append("file", file);

      axios
         .post("https://api.openai.com/v1/audio/transcriptions", formData,{
          headers:{
            "Content-Type" : "multipart/form-data",
            Authorization: `Bearer ${VITE_OPENAI_API_KEY}`,
          },
         })
         .then((res)=>{
          console.log(res.data.text);
          setResponse(res.data);
         })
         .catch((err) => {
          console.log(err);
         });

    };
    fetchAudioFile();
  },[file] ) ;

  const summary =`${JSON.stringify(response,null, 2)}`;
  if (typeof summary !== 'string') {
    return <div>Error: Summary is not a valid string.</div>;
  }
  const points = summary.split(/[.]/);

  const toggleKeyPointer = () => {
    setShowKeyPointer(!showKeyPointer);
  };

  

  return (
    <div>
      
      <h2 className='app-name'><strong>Voice Textify </strong></h2>
      <h4 className='desc'>Transcribe audio to text with our AI audio to text transcription tool.</h4>
      <input  className='input-box' type='text'  placeholder='Your Audio File Name Will Display Here'  value={file ? file.name : ''} readOnly/>

      <label className="custom-file-upload" htmlFor='fileInput'>
      <input className='audio-input'
      type='file'
      id="fileInput"
      ref={inputRef}
      accept="audio/*"
      onChange={onChangeFile}
      />
      <span className='choose-button'>Choose File</span>
      </label>
        
      <h2> Audio To Text will be seen below</h2>
     
 <pre>{response && (
    <div className="responseBox1Style">
      <strong>Text Box </strong>
      
    </div>
  )} </pre>

<div className="output-box">

    <div className="box1">
       <h2>Audio To Text </h2>  
       <hr/>
         {response && <pre>{response.text}</pre>}
    </div>
<button className="keypoint-summary" onClick={toggleKeyPointer} > convert <TiArrowRightOutline/></button>
     <div className="box2">
       <h2> Key Pointer! </h2>
       <hr/>
         {showKeyPointer && (
        <div className="key-pointer">
          <ul>
        {points.map((point, index) => (
          <li key={index}>{point.trim()}</li>
        ))}
        </ul>
        </div>
      )}
    </div>
   </div>
    </div>
  )
}

export default Example;