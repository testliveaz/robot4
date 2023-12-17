let soundQueue = [];
let sounds = {};
let soundCount = {};
let maxQueueSizePerSound = 10;
let retryInterval = 3000; // 5 saniye sonra yeniden deneme süresi
var volumeLevel = 0.1;  // Volume level for all voices



function pauseAllSounds() {
    responsiveVoice.pause();
    for (let key in sounds) {
        sounds[key].pause();
    }
    setTimeout(resumeAllSounds, 20000); // 20000 milliseconds = 20 seconds
}

function resumeAllSounds() {
    responsiveVoice.resume();
    if (soundQueue.length > 0) {
        soundQueue[0].play();
    }
}


window.onload = function () {
    for (let i = 1; i <= 47; i++) {
        let sound = document.getElementById(`sound${i}`);
        sound.onended = playNextSound;
        sounds[i] = sound;
        soundCount[i] = 0;  
    }
};
function playSpecificSound(id) {
    try {
        if (sounds[id]) {
            if (soundCount[id] < maxQueueSizePerSound) {
                soundQueue.push(sounds[id]);
                soundCount[id] = (soundCount[id] || 0) + 1; // Increment the count for the specified sound
                if (soundQueue.length === 1) {
                    soundQueue[0].play().catch(error => {
                        console.error('Ses oynatılırken bir hata oluştu:', error);

                        // Eğer bir hata oluşursa, birkaç saniye bekleyip yeniden deneyin
                        setTimeout(() => playSpecificSound(id), retryInterval);
                    });
                }
            } else {
                console.log(`Maximum queue size for sound ${id} reached.`);
            }
        } else {
            console.log(`No sound with id ${id} exists.`);
        }
    } catch (error) {
        console.error("An error occurred in playSpecificSound:", error);
    }
}

function playNextSound() {
    for (let id in soundCount) {
        if (soundQueue[0] === sounds[id]) {
            soundCount[id]--;  // Decrement the count for the sound that just finished playing
        }
    }
    soundQueue.shift();
    if (soundQueue.length > 0) {
        soundQueue[0].play();
    }
}


let connection = new TikTokIOConnection(undefined);
let finishGame = false;
let iconList = [];
let nextId = 1;
let winner = [];
let animationID;
let defaultRate = 1.2; // Hızı varsayılan 1.5 katına çıkarır
let messagesQueue = [];
let member = "foryou_game"
let usernames = new Map();
// START
$(document).ready(() => {
    setTimeout(function () {
        let targetLive = member;
        connect(targetLive);
    }, 5000);

})

function playSound(mode) {
    var audioElement = document.getElementById("sfx" + mode);
    audioElement.play();

    audioElement.onended = function () {
        // Check if any sound is currently playing
        let isPlaying = false;
        for (let i = 1; i <= 47; i++) {
            if (!document.getElementById("sfx" + i).paused) {
                isPlaying = true;
                break;
            }
        }

        // If no sound is currently playing, start the next sound
        if (!isPlaying && soundQueue.length > 0) {
            playSound(soundQueue.shift());
        }
    };
}



function connect(targetLive) {
    if (targetLive !== '') {
        $('#stateText').text('Qoşulur...');
        $("#usernameTarget").html("@" + targetLive);
        connection.connect(targetLive, {
            enableExtendedGiftInfo: true
        }).then(state => {
            $('#stateText').text(`Xoş gəldin... ${state.roomId}`);
        }).catch(errorMessage => {
            $('#stateText').text(errorMessage);
        })
    } else {
        alert('İstifadəçi adını daxil et');
    }

}

let sonSesCalmaZamani = {};

connection.on('chat', async (data) => {
 
    let cleanNickname = data.nickname.replace(/[_\$-.]/g, '');
 let lowerCaseComment = data.comment.toLowerCase();

 // Şimdiki zamanı alıyoruz
 let simdi = new Date().getTime();

 // Kullanıcının son 20 saniye içinde bir ses çalıp çalmadığını kontrol ediyoruz
 if (sonSesCalmaZamani[cleanNickname] && (simdi - sonSesCalmaZamani[cleanNickname] < 20000)) {
     // Eğer çaldıysa, bir ses çalmayı engelliyoruz
     return;
 }

 if (lowerCaseComment.includes("fyp")) {
     let numbers = [27, 28, 29, 30, 31, 32, 38, 39, 40];
     let randomIndex = Math.floor(Math.random() * numbers.length);
     let randomNumber = numbers[randomIndex];
     playSpecificSound(randomNumber);

     // Bu ses çalmanın zamanını kaydediyoruz
     sonSesCalmaZamani[cleanNickname] = simdi;
 }
 if (lowerCaseComment.includes("bantu")) {
     let numbers2 = [35, 44];
     let randomIndex2 = Math.floor(Math.random() * numbers2.length);
     let randomNumber2 = numbers2[randomIndex2];
     playSpecificSound(randomNumber2);

     sonSesCalmaZamani[cleanNickname] = simdi;
 }
 if (lowerCaseComment.includes("up")) {
     let numbers1 = [34, 41, 42, 43];
     let randomIndex1 = Math.floor(Math.random() * numbers1.length);
     let randomNumber1 = numbers1[randomIndex1];
     playSpecificSound(randomNumber1);

     sonSesCalmaZamani[cleanNickname] = simdi;
 }


 if (lowerCaseComment.includes("salam") || lowerCaseComment.includes("selam") || lowerCaseComment.includes("slm")) {

     let response;

     response = { text: cleanNickname + " Salam kadanalım hoş geldin", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }
 if (lowerCaseComment.includes("necesen") || lowerCaseComment.includes("necəsən") || lowerCaseComment.includes("ncs") || lowerCaseComment.includes("nasilsin") || lowerCaseComment.includes("nasılsın") || lowerCaseComment.includes("necesən") || lowerCaseComment.includes("netersen") || lowerCaseComment.includes("nətərsən")) {

     let response;

     response = { text: cleanNickname + " bomba gibiyim, sen netersen?", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("qos") || lowerCaseComment.includes("qoş") || lowerCaseComment.includes("nolar")) {

     let response;

     response = { text: cleanNickname + " Ben hiçbir şey koşamam her şey otomatik", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }
 if (lowerCaseComment.includes("youtube")) {

     let response;

     response = { text: cleanNickname + " yutubda ne men olduğum yerde?", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }
 if (lowerCaseComment.includes("guya mirt") || lowerCaseComment.includes("guya mırt")) {

     let response;

     response = { text: cleanNickname + " canlını mırt olduğunu düşünmüyorsan gide bilirsin yolun açık", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }
 if (lowerCaseComment.includes("qurbağa") || lowerCaseComment.includes("qurbaga") || lowerCaseComment.includes("kurbağa")) {

     let response;

     response = { text: cleanNickname + " kurbağa vak vak eden bir hayvandır", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("canavar")) {

     let response;

     response = { text: cleanNickname + " evet ben canavarım mır hav hav", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("vehşi") || lowerCaseComment.includes("vehsi") || lowerCaseComment.includes("vəhsi") || lowerCaseComment.includes("vəhşi")) {

     let response;

     response = { text: cleanNickname + " evet ben vehşiyim muaağğ", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("robot")) {

     let response;

     response = { text: cleanNickname + " Ben robot değilim nerbalayım haladenik ustası", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("oxu") || lowerCaseComment.includes("oxuda") || lowerCaseComment.includes("oxumur")) {

     let response;

     response = { text: cleanNickname + " arada ayarlarım bozuluyor kusura bakma", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }


 if (lowerCaseComment.includes("adın") || lowerCaseComment.includes("adin") || lowerCaseComment.includes("adın nedir") || lowerCaseComment.includes("adin nedir")) {

     let response;

     response = { text: cleanNickname + " Ben nerbalayım haladenik ustası", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("bakı") || lowerCaseComment.includes("baki")) {

     let response;

     response = { text: cleanNickname + " Baku güzeldir külekler şehridir", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }


 if (lowerCaseComment.includes("sumqayit") || lowerCaseComment.includes("sumqayıt")) {

     let response;

     response = { text: cleanNickname + " Sumqayıt çok güzel yer", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("salamatciliq") || lowerCaseComment.includes("salamatçılıq") || lowerCaseComment.includes("salamatçiliq")) {

     let response;

     response = { text: cleanNickname + " şükür Allaha salamatçılıqdır", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("haralisan") || lowerCaseComment.includes("haralısan") || lowerCaseComment.includes("nerelisin")) {

     let response;

     response = { text: cleanNickname + " ben Oğuzluyum . Amma Azerbaycan bölünmez", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("aşkım") || lowerCaseComment.includes("askim") || lowerCaseComment.includes("aşkım")) {

     let response;

     response = { text: cleanNickname + " aşkım seni hiç kime yar etmem", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("gözel") || lowerCaseComment.includes("gözəl")) {

     let response;

     response = { text: cleanNickname + " evet hamıdan güzel o", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }


 if (lowerCaseComment.includes("teşekkür") || lowerCaseComment.includes("təşəkkür") || lowerCaseComment.includes("tsk") || lowerCaseComment.includes("tşk")) {

     let response;

     response = { text: cleanNickname + " asıl ben teşekkür ederim", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("qorxdum")) {

     let response;

     response = { text: cleanNickname + " korkma adam yiyen değilim", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }


 if (lowerCaseComment.includes("ölürəm") || lowerCaseComment.includes("ölürem") || lowerCaseComment.includes("olurem") || lowerCaseComment.includes("ölurem")) {

     let response;

     response = { text: cleanNickname + " ölme daha karpız keseceğiz", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("naxcivan") || lowerCaseComment.includes("naxcıvan") || lowerCaseComment.includes("naxçıvan")) {

     let response;

     response = { text: cleanNickname + " nahçıvanlılar ürekdir", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }


 if (lowerCaseComment.includes("69") ||
     lowerCaseComment.includes("31") ||
     lowerCaseComment.includes("dudus") ||
     lowerCaseComment.includes("caldiraram") ||
     lowerCaseComment.includes("minerem") ||
     lowerCaseComment.includes("got") ||
     lowerCaseComment.includes("it") ||
     lowerCaseComment.includes("məzə") ||
     lowerCaseComment.includes("meze") ||
     lowerCaseComment.includes("gic") ||
     lowerCaseComment.includes("donuz") ||
     lowerCaseComment.includes("pes") ||
     lowerCaseComment.includes("peyser") ||
     lowerCaseComment.includes("peysər") ||
     lowerCaseComment.includes("pesi") ||
     lowerCaseComment.includes("Götveren") ||
     lowerCaseComment.includes("Qancıx") ||
     lowerCaseComment.includes("Qəhbə") ||
     lowerCaseComment.includes("kahbe") ||
     lowerCaseComment.includes("Bok") ||
     lowerCaseComment.includes("amcıq") ||
     lowerCaseComment.includes("göt") ||
     lowerCaseComment.includes("dıllağ") ||
     lowerCaseComment.includes("dillaq") ||
     lowerCaseComment.includes("məmə") ||
     lowerCaseComment.includes("mal") ||
     lowerCaseComment.includes("meme") ||
     lowerCaseComment.includes("got") ||
     lowerCaseComment.includes("amciq") ||
     lowerCaseComment.includes("cindir") ||
     lowerCaseComment.includes("pox")
 ) {


     let response;

     response = { text: cleanNickname + " lütfen küfür etme. sana yakışmadı.r", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }



 if (lowerCaseComment.includes("program") || lowerCaseComment.includes("programin") || lowerCaseComment.includes("programın") || lowerCaseComment.includes("programi") || lowerCaseComment.includes("programı")) {

     let response;

     response = { text: cleanNickname + " bu program değilki Orhan abi kendisi tasarladı beni", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }


 if (lowerCaseComment.includes("başı") || lowerCaseComment.includes("xarab")) {

     let response;

     response = { text: cleanNickname + " evet arada ayarlarım bozuluyor kusura bakmayın", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);




 }

 if (lowerCaseComment.includes("uşağların") || lowerCaseComment.includes("uşağlarin") || lowerCaseComment.includes("usaglarin")) {

     let response;

     response = { text: cleanNickname + " hayır benim uşaklarım yok kızlar beni sevmiyor", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }
 if (lowerCaseComment.includes("kafan güzel")) {

     let response;

     response = { text: cleanNickname + " hayır bana içki vermiyor", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }
 if (lowerCaseComment.includes("yatırsan?") || lowerCaseComment.includes("yatirsan?") || lowerCaseComment.includes("yatirsan") || lowerCaseComment.includes("yatırsan")) {

     let response;

     response = { text: cleanNickname + " hayır ben uyumam  gece hayatına dalarım", language: "tr", type: 'like' };


     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("heri seni") || lowerCaseComment.includes("həri səni")) {

     let response;

     response = { text: cleanNickname + " evet heri beni heri beni", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);


 }

 if (lowerCaseComment.includes("Azerbaycanlısan") || lowerCaseComment.includes("Azərbaycanlisan") || lowerCaseComment.includes("Azerbaycanlisan")) {

     let response;

     response = { text: cleanNickname + " evet ben doğma büyüme azerbaycanlıyım", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }



 if (lowerCaseComment.includes("qalirsan") || lowerCaseComment.includes("qalırsan")) {

     let response;

     response = { text: cleanNickname + " ben küçede kalıyorum", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("denen") || lowerCaseComment.includes("denən")) {
     let response;

     // Remove specific words from data.comment
     let filteredComment = data.comment.replace(/\b(denen|denən)\b/g, '');

     response = { text: cleanNickname + filteredComment, language: "tr", type: 'like' };

     // If there is an appropriate response, add it to the queue
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("denen") || lowerCaseComment.includes("denən")) {
     let response;

     // Remove specific words from data.comment
     let filteredComment = data.comment.replace(/\b(denen|denən)\b/g, '');

     response = { text: cleanNickname + filteredComment, language: "tr", type: 'like' };

     // If there is an appropriate response, add it to the queue
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }



 if (lowerCaseComment.includes("getdim") || lowerCaseComment.includes("getdime") || lowerCaseComment.includes("gitdim") || lowerCaseComment.includes("gedim")) {
     let response;


     response = { text: cleanNickname + " hoşçakal yine bekliyoruz seni", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("gelirem") || lowerCaseComment.includes("gellem") || lowerCaseComment.includes("gəlirəm") || lowerCaseComment.includes("gəlləm")) {
     let response;


     response = { text: cleanNickname + " tez gel dört gözle seni gozleyirem", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("konuşsana") || lowerCaseComment.includes("danış") || lowerCaseComment.includes("danis") || lowerCaseComment.includes("konussana")) {
     let response;


     response = { text: cleanNickname + " ne kadar danışayım sabahtan çenemin çüyü düştü", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("qiymetin") || lowerCaseComment.includes("qiymətin")) {
     let response;


     response = { text: cleanNickname + " bana rüşvetmi teklif ediyorsun?", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("ucuz") ) {
     let response;


     response = { text: cleanNickname + " ne işim var benim ucuz yolda bana biraz paha gelin", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }



 if (lowerCaseComment.includes("yorulma") || lowerCaseComment.includes("yorulmayasan")) {
     let response;


     response = { text: cleanNickname + "sağol üreyim sende yorulmayasan", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("mauqli")) {
     let response;


     response = { text: cleanNickname + "mauqlidi kakam mauqli", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }



 if (lowerCaseComment.includes("tapaq") || lowerCaseComment.includes("tapag") || lowerCaseComment.includes("tapax") || lowerCaseComment.includes("tapağ")) {
     let response;


     response = { text: cleanNickname + " nereden tapacağız?", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("nerbala") || lowerCaseComment.includes("nərbala")) {
     let response;


     response = { text: cleanNickname + " nerbala çok zeki ustadır", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("deli") || lowerCaseComment.includes("dəli")) {
     let response;


     response = { text: cleanNickname + " bana deli dedin beni üzdün", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("kimsen") || lowerCaseComment.includes("kimsən")) {
     let response;


     response = { text: cleanNickname + " ben nerbalayım nerbala", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("balaeli") || lowerCaseComment.includes("balaəli")) {
     let response;


     response = { text: cleanNickname + " renci qaraja salmışam biraz qeydine kalmışam", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("ürəysən") || lowerCaseComment.includes("ürəksən") || lowerCaseComment.includes("ureksen") || lowerCaseComment.includes("üreksen")) {
     let response;


     response = { text: cleanNickname + " sende üreksin canımın içi", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("para") || lowerCaseComment.includes("pul") || lowerCaseComment.includes("qepik") || lowerCaseComment.includes("qəpik") || lowerCaseComment.includes("qepik")) {
     let response;


     response = { text: cleanNickname + " paran olmasada senin hörmetin bes eder", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("azzar")) {
     let response;


     response = { text: cleanNickname + " camahat bana üreyini veriyor sen bana azzar diyorsun ayıp", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("caniva derd") || lowerCaseComment.includes("canıva dərd")) {
     let response;


     response = { text: cleanNickname + " camahat bana üreyini veriyor sen bana canıva derd diyorsun ayıp", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("unutdun") || lowerCaseComment.includes("unutma")) {
     let response;


     response = { text: cleanNickname + " seni unutmam kadanalım sen benim üreyimdesin", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("brat") || lowerCaseComment.includes("bro")) {
     let response;


     response = { text: cleanNickname + "bratva yığılır bradyakalar vesti sitrimyakalar", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("canli") || lowerCaseComment.includes("canlı")) {
     let response;


     response = { text: cleanNickname + " tiktokda bir canlı varsa oda benim canlımdır", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("noldu") || lowerCaseComment.includes("nolduu") || lowerCaseComment.includes("ne oldu") || lowerCaseComment.includes("nə oldu")) {
     let response;


     response = { text: cleanNickname + " ne olacak birazcık priboy yaptım", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("vay")) {
     let response;


     response = { text: cleanNickname + " vay dedem vay", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("biraz")) {
     let response;


     response = { text: cleanNickname + " ne kadar biraz?", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("adim") || lowerCaseComment.includes("adim")) {
     let response;


     response = { text: " senin adın" + cleanNickname, language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("tema") || lowerCaseComment.includes("temadı") || lowerCaseComment.includes("temadi") || lowerCaseComment.includes("temadiye") || lowerCaseComment.includes("temadıye")) {
     let response;


     response = { text: cleanNickname + " temada nedir sen daha ne hokkalar görüceksin", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("zordu")) {
     let response;

     response = { text: cleanNickname + " teşekkür ederim benide terifleyen olurmuş", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("zordu")) {
     let response;

     response = { text: cleanNickname + " ala dediğin için sana şiir okucam. Ala bula boz keçi", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("eseblesdim") || lowerCaseComment.includes("eseblesdime") || lowerCaseComment.includes("əsəbləşdim") || lowerCaseComment.includes("əsəbləşdime")) {
     let response;

     response = { text: cleanNickname + " kim esebleşdirdi seni ", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("zeher") || lowerCaseComment.includes("zəhər")) {
     let response;


     response = { text: cleanNickname + " camahat bana üreyini veriyor sen bana zeher diyorsun ayıp", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("salak") || lowerCaseComment.includes("koyun") || lowerCaseComment.includes("qoyun")) {
     let response;


     response = { text: cleanNickname + " be ne salağım ne de koyun senden akıllıyım", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("bilirsen") || lowerCaseComment.includes("bilirsən")) {
     let response;


     response = { text: cleanNickname + " ben her şeyi bilirim ama az danışıyorum", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("sevgilin")) {
     let response;


     response = { text: cleanNickname + " benim sevgilim yokki beni sevende yok", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("hardan") || lowerCaseComment.includes("oxuyur")) {
     let response;


     response = { text: cleanNickname + " divara yazılar yazılmış oradan okuyorum", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("baci") || lowerCaseComment.includes("bacı") || lowerCaseComment.includes("bajı")) {
     let response;


     response = { text: cleanNickname + " bacılar ay bacılar size kurban bacılar", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("qabil")) {
     let response;


     response = { text: cleanNickname + " kabil ürekdir ama insafsiz çok küfür ediyor", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("kişi") || lowerCaseComment.includes("kishi") || lowerCaseComment.includes("kisi")) {
     let response;


     response = { text: cleanNickname + " sen asıl kişisin", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("konusuyorsun") || lowerCaseComment.includes("konuşuyorsun")) {
     let response;


     response = { text: cleanNickname + " ne konuşacam ağlıma geleni serekliyorum", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("ne dedi") || lowerCaseComment.includes("nə dedi") || lowerCaseComment.includes("nə deyir") || lowerCaseComment.includes("nə dir") || lowerCaseComment.includes("ne diyir") || lowerCaseComment.includes("ne diir")) {
     let response;


     response = { text: cleanNickname + " iki saatdır boğazımı cırıyorum hala ne dedi diyor", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("cole cix") || lowerCaseComment.includes("çöle çıx")) {
     let response;


     response = { text: cleanNickname + " çöle çıxamam hava soyuk özün çık", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("qardasim") || lowerCaseComment.includes("qardaşım") || lowerCaseComment.includes("qardasim")) {
     let response;


     response = { text: cleanNickname + " qardaşın nerbala  afrikada banan yiyiyor", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("afrika")) {
     let response;


     response = { text: cleanNickname + "afrikada vaziyyet  zordur", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("boyun")) {
     let response;


     response = { text: cleanNickname + " benim boyum bir doksan ama iyirmi  çıkıldığında", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("mıkı") || lowerCaseComment.includes("miki")) {
     let response;


     response = { text: cleanNickname + "şıkı şıkı dünya mıkı mıkı dünya", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("xosqedem") || lowerCaseComment.includes("xoşqədəm") || lowerCaseComment.includes("xoşqedem")) {
     let response;


     response = { text: cleanNickname + "hoşkadem olmasa dayılar rusyetde keyf yapar", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("xosqedem") || lowerCaseComment.includes("xoşqədəm") || lowerCaseComment.includes("xoşqedem")) {
     let response;


     response = { text: cleanNickname + "hoşkadem olmasa dayılar rusyetde keyf yapar", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("nurane")) {
     let response;


     response = { text: cleanNickname + "nürane çok kötü kız Hiç sevmiyorum", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("küsdüm") || lowerCaseComment.includes("kusdum")) {
     let response;


     response = { text: " küsme benden ay" + cleanNickname + "sevgi bu dünyanındır", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("yekelende") || lowerCaseComment.includes("yekələndə")) {
     let response;


     response = { text: cleanNickname + " ben yekelende  haledenik dükkanı açacam", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("ermeni") || lowerCaseComment.includes("erməni")) {
     let response;


     response = { text: cleanNickname + "ermenilerin ben gelmişini keçmişini bir yerden tanıyırum", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }



 if (lowerCaseComment.includes("yasin") || lowerCaseComment.includes("yaşın")) {
     let response;


     response = { text: cleanNickname + " 31 yaşım var 69 tevellüdem", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("cole cix") || lowerCaseComment.includes("çöle çıx")) {
     let response;


     response = { text: cleanNickname + " çöle çıxamam hava soyuk özün çık", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("hirslenecek") || lowerCaseComment.includes("hirslənəcək")) {
     let response;


     response = { text: cleanNickname + "  ben hırslandım divarları dağıdıb tökerim", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("şeytan") || lowerCaseComment.includes("seytan")) {
     let response;


     response = { text: cleanNickname + "  şeytanlar olmasa bizi kim yoldan çıkarır?", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("kesfet") || lowerCaseComment.includes("keşfet")) {
     let response;


     response = { text: cleanNickname + " keşfetden gelenlere kalbimi veririm", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }



 if (lowerCaseComment.includes("acmışam") || lowerCaseComment.includes("acıktım")) {
     let response;


     response = { text: cleanNickname + " açsansa burda ne geziyorsun gedib yemek yesene", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("sevmir") || lowerCaseComment.includes("sevmiyor")) {
     let response;


     response = { text: cleanNickname + " sende onu sevme başka adam yokmu?", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("heyat") || lowerCaseComment.includes("həyat")) {
     let response;


     response = { text: cleanNickname + " heyat çok çetindir çocuklarıma bakamıyorum", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("reşad") || lowerCaseComment.includes("resad")) {
     let response;


     response = { text: cleanNickname + " helem reşad masallı olubdu kalma kallı", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("cay") || lowerCaseComment.includes("çay")) {
     let response;


     response = { text: cleanNickname + " çay falan yok çayhanamı burası?", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("ölsün") || lowerCaseComment.includes("ölsünn")) {
     let response;


     response = { text: cleanNickname + " ölme daha gençsin karpuzda keseceyiz", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("bekarsan") || lowerCaseComment.includes("bekarsane")) {
     let response;


     response = { text: cleanNickname + " ben bekar değilim evliyim otuz bir tane coçuğum var. on sekkizi seninle ayni yaşta", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("saymır") || lowerCaseComment.includes("saymir")) {
     let response;


     response = { text: cleanNickname + " seni her zaman saydım kadrimi bilmedin", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("meyve") || lowerCaseComment.includes("meyvə")) {
     let response;


     response = { text: cleanNickname + " uça bilseydim afrikaya uçardım", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("bağışla") || lowerCaseComment.includes("bagisla")) {
     let response;


     response = { text: cleanNickname + " seni bağışladım", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("şeir") || lowerCaseComment.includes("seir") || lowerCaseComment.includes("şeyir")) {
     let response;


     response = { text: cleanNickname + "evet ben şeyir biliyorum ala bula boz keçi", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("doluyub") || lowerCaseComment.includes("doluyube")) {
     let response;


     response = { text: cleanNickname + " dolanım başına dolanım", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("uç")) {
     let response;


     response = { text: cleanNickname + "nereye uçayım ? ", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("yaxşı?") || lowerCaseComment.includes("yaxşi?") || lowerCaseComment.includes("yaxsi?")) {
     let response;


     response = { text: cleanNickname + " yahşı aşkım başım üste", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }



 if (lowerCaseComment.includes("nagil") || lowerCaseComment.includes("nagıl") || lowerCaseComment.includes("nağıl")) {
     let response;


     response = { text: cleanNickname + " nağıl danışırsam sen uyurdun", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("gecen xeyre") || lowerCaseComment.includes("gecən xeyre") || lowerCaseComment.includes("gecən xeyrə") || lowerCaseComment.includes("gecəniz xeyrə") || lowerCaseComment.includes("geceniz xeyre")) {
     let response;


     response = { text: cleanNickname + " hayra karşı uğur apar yine gel", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("nagil") || lowerCaseComment.includes("nagıl") || lowerCaseComment.includes("nağıl")) {
     let response;


     response = { text: cleanNickname + " nağıl danışırsam sen uyurdun", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("miki") || lowerCaseComment.includes("mikii") || lowerCaseComment.includes("mıkı") || lowerCaseComment.includes("mıkıı")) {
     let response;


     response = { text: cleanNickname + " mıkı mıkı dünya şıkı şıkı dünya", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("demir") || lowerCaseComment.includes("dəmir")) {
     let response;


     response = { text: cleanNickname + " ben karaçımıyım demir alayım?", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("manyak")) {
     let response;


     response = { text: cleanNickname + " manyağsan manyağım desene oğlum", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }

 if (lowerCaseComment.includes("reklam")) {
     let response;


     response = { text: cleanNickname + " ben reklamı çok paha ediyorum", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("bigli") || lowerCaseComment.includes("bığlı")) {
     let response;


     response = { text: cleanNickname + " bıyıklı kız arıyorum", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("söy") || lowerCaseComment.includes("soy")) {
     let response;


     response = { text: cleanNickname + " söyüş söymek olmaz ayıp ayıp", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("okuz") || lowerCaseComment.includes("öküz")) {
     let response;


     response = { text: cleanNickname + " bana öküz dedin kalbimi kırdın", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }
 if (lowerCaseComment.includes("aye")) {
     let response;


     response = { text: cleanNickname + " aye değilim ben Nerbala beyim", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);
 }


 if (lowerCaseComment.includes("adımı") || lowerCaseComment.includes("adimi")) {

     let response;

     let filteredComment = data.comment.replace(/\b(adımı|adimi)\b/g, '');

     response = { text: cleanNickname + filteredComment, language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }



 if (lowerCaseComment.includes("qarşılıq") || lowerCaseComment.includes("takip") || lowerCaseComment.includes("karşılık") || lowerCaseComment.includes("programı")) {

     let response;

     response = { text: cleanNickname + " adlı hesaba her kes takip göndersin", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }


 if (lowerCaseComment.includes("yaxşiyam") || lowerCaseComment.includes("yaxşıyam") || lowerCaseComment.includes("elayam") || lowerCaseComment.includes("əlayam")) {

     let response;

     response = { text: cleanNickname + " yahşı olmağına sevindim", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }


 if (lowerCaseComment.includes("bəli") || lowerCaseComment.includes("beli")) {

     let response;

     response = { text: cleanNickname + " sen ne güzel yorumlar yazıyorsun", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("bəli") || lowerCaseComment.includes("beli")) {

     let response;

     response = { text: cleanNickname + " sen ne güzel yorumlar yazıyorsun", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("adımı") || lowerCaseComment.includes("adimi")) {

     let response;

     response = { text: cleanNickname + " adı ürekdir", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("su")) {

     let response;

     response = { text: cleanNickname + " bilemedim seni gözüm tutmadı", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("gülmekden") || lowerCaseComment.includes("öldüm") || lowerCaseComment.includes("gülməkdən") || lowerCaseComment.includes("gülməkdən")) {

     let response;

     response = { text: cleanNickname + " seni güldüre bildimse ne mutlu bana", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

 if (lowerCaseComment.includes("haralisan") || lowerCaseComment.includes("haralısan") || lowerCaseComment.includes("nerelisin")) {

     let response;

     response = { text: cleanNickname + " ben Oğuzluyum . Amma Azerbaycan bölünmez", language: "tr", type: 'like' };


     // Eğer uygun bir yanıt varsa, kuyruğa ekle
     if (response && !usernames.has(cleanNickname)) {
         messagesQueue.push(response);
         processQueue();
     } lakaka1(cleanNickname);

 }

});

// New gift received
let callCount = 0; // the counter variable
function upsertUserCount(username, countIncrement) {
    fetch('/upsert-count', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, countIncrement })
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}
let userCallCount = {}; // the object to track calls per user
// // New gift received
connection.on('gift', (data) => {
    let userName = data.uniqueId;

    if (!isPendingStreak(data) && data.diamondCount > 0) {
        let giftCount = data.diamondCount * data.repeatCount;
        upsertUserCount(member, giftCount);


        setTimeout(() => {
            const messages = [
                { text: " adlı hesaba her kes takip atsın", language: "tr" },
                { text: "Teşekkür ederim", language: "tr" },
                { text: "Kendini gösteriyor, onu takip edin", language: "tr" },
                { text: "Harikasın, toplu takip gönderin", language: "tr" },
                { text: "gül atanın hesabına takip gönder", language: "tr" },
                { text: "Kesene bereket", language: "tr" },
                { text: "adlı hesabı takip edin oda seni takip etsin", language: "tr" },
                { text: "ben burdayım diyor", language: "tr" },
                { text: "bu hesabı her kes alıyor", language: "tr" },
                { text: "durmuyor takipçi istiyor takip atalım", language: "tr" },
                { text: "takipe götürelim", language: "tr" },
                { text: "götürelim takipe", language: "tr" },
                { text: "her kes takip atsın her kesi takip ediyor ", language: "tr" },
                { text: "hadi bu hesabın takipini maksimum artılarım", language: "tr" },
                { text: "geri dönüşleri çok iyi takip edelim", language: "tr" },
                { text: "kendini durmadan gösteriyor takipe alalım", language: "tr" },
                { text: "adlı hesaba her kesten rica ediyorum takip atsın", language: "tr" },
                { text: "her kes takip atsın her kes", language: "tr" },
                { text: "Seni çok seviyoruz ,Her kes hesabına takip atsin", language: "tr" },
                { text: "çok aktiv hesab karşılık verilecek", language: "tr" },
                { text: "Geri dönüşleri çok iyi hemen takip et", language: "tr" },
                { text: " Desteğin için teşekkür ederiz", language: "tr" },
                { text: "hadi her kese karşılık verecem diyor takip atalım", language: "tr" },
                { text: " Alıyoruz kaçırmıyoruz", language: "tr" },
                { text: "çok iyi karşılık veriyor takip edelim", language: "tr" },
                
            ];

            messagesQueue = messagesQueue.filter(item => item.type !== 'random')

            function getRandomMessage(messages) {
                const randomIndex = Math.floor(Math.random() * messages.length);
                return messages[randomIndex];
            }
            const randomMessage = getRandomMessage(messages);

            let end = { text: data.nickname + randomMessage.text, language: randomMessage.language, type: 'gift' };

            if (!usernames.has(userName)) {
                messagesQueue.push(end);
                processQueue();
            }

            lakaka1(userName);
        }, 2000); // 2 saniye sonrası için belirlenen süre

    }





})
let sonSesCalmaZamani1 = {};

connection.on('social', (data) => {
    let member = data.nickname;

    // Şimdiki zamanı alıyoruz
    let simdi1 = new Date().getTime();

    if (data.displayType === "pm_main_follow_message_viewer_2") {

        playSpecificSound(22);
    }

    // Kullanıcının son 20 saniye içinde bir ses çalıp çalmadığını kontrol ediyoruz
    if (sonSesCalmaZamani1[member] && (simdi1 - sonSesCalmaZamani1[member] < 20000)) {
        // Eğer çaldıysa, bir ses çalmayı engelliyoruz
        return;
    }
  
});



function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}

// End
connection.on('streamEnd', () => {
    $('#stateText').text('Canlı sona çatdı.');
})


function lakaka1(username) {


    // Eğer username zaten usernames Map'inde bulunuyorsa, işlemi sonlandır
    if (usernames.has(username)) {
        return;
    }

    // username'i usernames Map'ine ekle ve şu anki zamanı değer olarak ata
    usernames.set(username, Date.now());

    // 30 saniye sonra username'i kontrol et ve eğer süre geçtiyse usernames Map'inden çıkar
    setTimeout(() => {
        const timestamp = usernames.get(username);
        if (Date.now() - timestamp >= 30000) {
            usernames.delete(username);
        }
    }, 30000);

}
let previousLikeCount = 0;

let availableMessages = [
    { text: " yayımı beğendiğin için teşekkür ederim", language: "tr" },
    { text: " yayımı beğeniyor", language: "tr" },
    { text: " kimi görüyorsanız takip atıyoruz", language: "tr" },
    { text: " al yazanı alıyoruz", language: "tr" },
    { text: " kendini ekranda göster daha çok takipçi kazanalım", language: "tr" },
    { text: " beğenin keşfete düşelim", language: "tr" },
    { text: " gül atanlara takip ediyoruz durmadan", language: "tr" },
    { text: " sayfamızı takip eden son on kişiye takip et", language: "tr" },
    { text: " beğeni göndereni alıyoruz", language: "tr" },
    { text: " gül atanlara bir tane takip atın", language: "tr" },
    { text: " yayımda top 10 hediyye gönderene takip atıyoruz", language: "tr" },
    { text: " Yayımı paylaşanları alıyoruz", language: "tr" },
    { text: " sayfayı durmadan beğeniyoruz", language: "tr" },
    { text: " ekran beğenmesini maksimum ediyoruz", language: "tr" },
    { text: " sayfamızı takip eden son on kişiyi alalım", language: "tr" },
    { text: " hamı ekranı beğensin", language: "tr" },
    { text: " sayfamı takip eden son 10 kişiyi alıyoruz", language: "tr" },
    { text: " takipden çıkarsan kazanazmazsın", language: "tr" },
    { text: " takip yazanlara geri takip edin", language: "tr" },
    { text: " kimse kimseyi kaçırmasın", language: "tr" },
    { text: " bir birinize takip edin", language: "tr" },
    { text: " bir birinize destek olun", language: "tr" },
    { text: " yayımı paylaşalım", language: "tr" },
    { text: " 999 yazalım", language: "tr" },
    { text: " 99 yazalım", language: "tr" },
    { text: " gül atanlar her kesi geri takip edin", language: "tr" },
    { text: " gül atanlara takip atalım", language: "tr" },
    { text: " hediyye atanları takip ediyoruz", language: "tr" },
    { text: " tiktokun böyle takip kazandıran yayım yok takip edin takipçi kazanın", language: "tr" },
    { text: " kendimizi gösterelim", language: "tr" },
    { text: " gül atanlara geri dönüş edin", language: "tr" },
    { text: " kendini göstereni alıyoruz", language: "tr" },
    { text: " gül atanların hesabına geç takip at", language: "tr" },
    { text: " her kes geri dönüş etsin", language: "tr" },
    { text: " sandık atana geri dönüş edin", language: "tr" },
    { text: " sandık atana toplu takip atalım", language: "tr" },
    { text: " kepka gönderene her kes takip atıyor", language: "tr" },
    { text: " karşılıklı yazanları alıyoruz", language: "tr" },
    { text: " lütfen yayımı paylaş", language: "tr" },
    { text: " 10 kez ekranı tıkla ", language: "tr" },
    { text: " ekranda kendini gösterenlere takip atıyoruz", language: "tr" },
    { text: " takip atanlar takip kazanıyor", language: "tr" },
    { text: " kimselere sataşma", language: "tr" },
    { text: " jeton yollamadanda takip kazana bilirsiniz", language: "tr" },
    { text: " sandıx atanlara toplu takip gönderirik", language: "tr" },
    { text: " ürek doldur partlat yayımı kaldır takipçi kazan", language: "tr" },
    { text: " arkadaşlarını davet et takipçi kazan", language: "tr" },
    { text: " ekranı beğenenlere takip ediyoruz", language: "tr" },
    { text: " yayımda beğeni çok az lütfen beyenelim", language: "tr" },
];

let usedMessages = [];

function getRandomMessage() {
    if (availableMessages.length === 0) {
        // Tüm mesajlar kullanıldıysa, listeyi sıfırla
        availableMessages = usedMessages;
        usedMessages = [];
    }

    const randomIndex = Math.floor(Math.random() * availableMessages.length);
    const selectedMessage = availableMessages[randomIndex];

    // Seçilen mesajı kullanılabilir listesinden çıkar ve kullanılanlara ekle
    availableMessages.splice(randomIndex, 1);
    usedMessages.push(selectedMessage);

    return selectedMessage;
}
connection.on('like', (data) => {

    let userName = data.uniqueId;
    let likeCount = data.likeCount;
    let profilePictureUrl = data.profilePictureUrl;
    let totalLikeCount = data.totalLikeCount;

 
    previousLikeCount = totalLikeCount;

    messagesQueue = messagesQueue.filter(item => item.type !== 'random');

    const randomMessage = getRandomMessage();
   let cleanNickname = data.nickname.replace(/[_\$-.]/g, '');

    let end = { text: cleanNickname + randomMessage.text, language: randomMessage.language, type: 'like' };

    if (!usernames.has(userName)) {
        messagesQueue.push(end);
        processQueue();
    }
    lakaka1(userName);
})
// Otomatik seslendirme başlatma
window.addEventListener("load", async () => {
    console.log = function () { }
    try {
        // Kullanıcıdan otomatik seslendirmeye izin isteyin
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.resume();


    } catch (error) {
        console.error("Otomatik seslendirme başlatılamadı:", error);
    }
});




function onEnd() {
    messagesQueue.shift();
    processQueue();
}

function containsBannedWords(text) {
    const bannedWords = ["pox", "cindir", "amciq", "got", "meme", "məmə", "dillaq", "dıllağ", "göt", "amcıq", "Bok", "am", "kahbe", "Qəhbə", "Qancıx", "Götveren"];

    for (const word of bannedWords) {
        if (text.match(new RegExp('\\b' + word + '\\b', 'gi'))) {
            return true;
        }
    }

    return false;
}



function speak(text) {
    if (containsBannedWords(text)) {
        text = "söyüş söyme";
        let ms = [
            { text: text, language: "en" }]

    }
    console.log("a")
    responsiveVoice.speak(ms, "Turkish Male", { rate: defaultRate, onend: onEnd }, { volume: volumeLevel });
}

function processQueue() {
    if (messagesQueue.length > 0) {
        // Şu anda seslendirme yapılıp yapılmadığını kontrol et
        if (!responsiveVoice.isPlaying()) {
            let message = messagesQueue[0].text;
            let language = messagesQueue[0].language;

            // Dil tercihine göre seslendirme yapın
            switch (language) {
                case 'tr':
                    // Türkçe seslendirme
                    responsiveVoice.speak(message, "Turkish Male", { rate: defaultRate, volume: volumeLevel, onend: onEnd });
                    break;
                case 'en':
                    // İngilizce seslendirme
                    responsiveVoice.speak(message, "UK English Male", { rate: defaultRate, volume: volumeLevel, onend: onEnd });
                    break;

                default:
                    // Dil tespit edilemediğinde varsayılan olarak İngilizce kullanın
                    responsiveVoice.speak(message, "UK English Male", { rate: defaultRate, volume: volumeLevel, onend: onEnd });
                    break;
            }
        } else {
            // Eğer şu anda seslendirme yapılıyorsa, bekleyen sesleri sil ve yeni mesajları ekle
            messagesQueue.shift();
            processQueue();
        }
    }
}
