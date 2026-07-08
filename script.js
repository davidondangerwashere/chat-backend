const socket = io('https://my-chat-backend-9b3p.onrender.com'); 
const peer = new Peer();

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const nextBtn = document.getElementById('nextBtn');

let localStream;
let currentCall;

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;
    })
    .catch(err => {
        alert("ক্যামেরা অন করতে সমস্যা হয়েছে! পারমিশন দিন।");
    });

peer.on('open', (id) => {
    nextBtn.onclick = () => {
        if (currentCall) currentCall.close();
        remoteVideo.srcObject = null; 
        socket.emit('join', id); 
        nextBtn.innerText = "Searching...";
    };
});

socket.on('match', (partnerPeerId) => {
    nextBtn.innerText = "Next";
    const call = peer.call(partnerPeerId, localStream);
    handleCall(call);
});

peer.on('call', (call) => {
    call.answer(localStream);
    nextBtn.innerText = "Next";
    handleCall(call);
});

function handleCall(call) {
    currentCall = call;
    call.on('stream', (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
    });
}
