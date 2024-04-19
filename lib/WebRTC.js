//
//
// const config = {
//   "video": {
//     "width": 1920,
//     "height": 1080,
//   }
// }
//
export default async function RTCprovider(peerConnection){
  const localStream = await getUserMedia({
    vide: true,audio: true
  })
 localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track,localStream)
  })
}
