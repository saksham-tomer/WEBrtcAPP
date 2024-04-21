
imoport React from 'react'


export default function VideoProvider() {
  const[frontCamera,setFrontCamera] = useState(true);
  const handleCamera = ()=>{
    setFrontCamera((current)=>!current);
  }

  useEffect(()=>{
    async function getStream(){
      let stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: {min:1024,ideal: 1280,max: 1920},
          height: {min: 576,ideal: 720,max: 1080},
          frameRate: {
            ideal: 20,max: 60
          },
          facingMode: frontCamera ? "user" : "environment"
          //Note: In certain cases, it may be necessary to release the current camera facing            mode before you can switch to a different one. To ensure the camera switch, it is            advisable to free up the media resources by invoking the "stop()" method on the tr           ack before requesting a different facing mode.
        }
      }).then((stream)=>{})
      .catch((error,stream)=>{
          console.log("Difficulty handling the video camera ${error}")
          stream.stop();
        })
    }return(
    stream.stop();
    )
  },[])
  return(
  <div>
     <div>
       <video ref={patientVideo} autoplay/>
       <video ref={doctorVideo} autoplay />
       <button onClick={handleCamera}>Switch Camera</button>
     </div>
        </div>

  )
}
