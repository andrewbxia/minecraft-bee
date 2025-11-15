/*
keysoundInput.addEventListener("input", (e) => {
    const audioFile = e.currentTarget.files[0];
    if(audioFile){
        const audioObj = new Audio(URL.createObjectURL(audioFile));
        const audioName = audioFile.name.split(".")[0];
        let add = "";
        if(audioFiles[audioName + add]){
            while(audioFiles[audioName + add]){
                const num = parseInt(add.substring(1)) || 0;
                // console.log(parseInt(add))
                add = `(${num + 1})`;
            }
        }
        audioFiles[audioName + add] = audioObj;
        addAudioOption(audioName + add);
        loadAudioFile(audioObj, audioName + add);
        // playKeysound(audioName + add);
    }
});*/

function parseHexStr(hexStr){
    return hexStr.split(" ").map((v) => parseInt(v, 16));
}


const HEADER = parseHexStr("4D 54 68 64 00 00 00 06");
// const MThd = parseHexStr("00 00 00 06"); ALREADY INCLUDED IN HEADER
//ff ff nn nn dd dd
const midiInput = document.getElementById("midi");
midiInput.addEventListener("input", (e) => {
    const midifile = e.currentTarget.files[0];
    if(!midifile) return;
    // const reader = new FileReader();
    // reader.onload = (event) => {
    //     const arraybuffer = event.target.result;
    //     const u8arr = new Uint8Array(arraybuffer);
    //     console.log(u8arr);

    //     let idx = 0;
    //     function step(num){
    //         idx += num;
    //     }  
    //     // header processing
    //     if (!HEADER.every((v, i) => v === u8arr[i])) return console.log("Invalid MIDI file");
    //     step(0x04);
    //     // if (!MThd.every((v, i) => v === u8arr[i + idx])) return console.log("Invalid MIDI file");
    //     step(0x04);
    //     const format = u8arr[idx] << 8 | u8arr[idx + 1];
    //     if (![0, 1, 2].includes(format)) return console.log("Invalid MIDI format");
    //     console.log(`MIDI format: ${format}`);
        

    //     step(0x02);
    //     const numtracks = u8arr[idx] << 8 | u8arr[idx + 1];
    //     console.log(numtracks);
    //     if(numtracks < 1) return console.log("Invalid number of tracks");
    //     step(0x02);
    //     const division = u8arr[idx] << 8 | u8arr[idx + 1];
    //     console.log(division);
    //     step(0x02);
        


    //     console.log("Valid MIDI file");


    // }
    // reader.readAsArrayBuffer(midifile);
    
});
