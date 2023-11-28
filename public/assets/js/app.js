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
let member = "mirtlive"
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
    let member = data.nickname;
    let lowerCaseComment = data.comment.toLowerCase();

    // Şimdiki zamanı alıyoruz
    let simdi = new Date().getTime();

    // Kullanıcının son 20 saniye içinde bir ses çalıp çalmadığını kontrol ediyoruz
    if (sonSesCalmaZamani[member] && (simdi - sonSesCalmaZamani[member] < 20000)) {
        // Eğer çaldıysa, bir ses çalmayı engelliyoruz
        return;
    }

    if (lowerCaseComment.includes("fyp")) {
        let numbers = [27, 28, 29, 30, 31, 32, 38, 39, 40];
        let randomIndex = Math.floor(Math.random() * numbers.length);
        let randomNumber = numbers[randomIndex];
        playSpecificSound(randomNumber);

        // Bu ses çalmanın zamanını kaydediyoruz
        sonSesCalmaZamani[member] = simdi;
    }
    if (lowerCaseComment.includes("bantu")) {
        let numbers2 = [35, 44];
        let randomIndex2 = Math.floor(Math.random() * numbers2.length);
        let randomNumber2 = numbers2[randomIndex2];
        playSpecificSound(randomNumber2);

        sonSesCalmaZamani[member] = simdi;
    }
    if (lowerCaseComment.includes("up")) {
        let numbers1 = [34, 41, 42, 43];
        let randomIndex1 = Math.floor(Math.random() * numbers1.length);
        let randomNumber1 = numbers1[randomIndex1];
        playSpecificSound(randomNumber1);

        sonSesCalmaZamani[member] = simdi;
    }


    if (lowerCaseComment.includes("salam") || lowerCaseComment.includes("selam") || lowerCaseComment.includes("slm")) {

        let response;

        response = { text: member + " Salam kadanalım hoş geldin", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }
    if (lowerCaseComment.includes("necesen") || lowerCaseComment.includes("necəsən") || lowerCaseComment.includes("ncs") || lowerCaseComment.includes("nasilsin") || lowerCaseComment.includes("nasılsın") || lowerCaseComment.includes("necesən") || lowerCaseComment.includes("netersen") || lowerCaseComment.includes("nətərsən")) {

        let response;

        response = { text: member + " bomba gibiyim, sen netersen?", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("qos") || lowerCaseComment.includes("qoş") || lowerCaseComment.includes("nolar")) {

        let response;

        response = { text: member + " Ben hiçbir şey koşamam her şey otomatik", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }
    if (lowerCaseComment.includes("youtube")) {

        let response;

        response = { text: member + " yutubda ne men olduğum yerde?", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }
    if (lowerCaseComment.includes("guya mirt") || lowerCaseComment.includes("guya mırt")) {

        let response;

        response = { text: member + " canlını mırt olduğunu düşünmüyorsan gide bilirsin yolun açık", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }
    if (lowerCaseComment.includes("qurbağa") || lowerCaseComment.includes("qurbaga") || lowerCaseComment.includes("kurbağa")) {

        let response;

        response = { text: member + " kurbağa vak vak eden bir hayvandır", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("canavar")) {

        let response;

        response = { text: member + " evet ben canavarım mır hav hav", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("vehşi") || lowerCaseComment.includes("vehsi") || lowerCaseComment.includes("vəhsi") || lowerCaseComment.includes("vəhşi")) {

        let response;

        response = { text: member + " evet ben vehşiyim muaağğ", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("robot")) {

        let response;

        response = { text: member + " Ben robot değilim nerbalayım haladenik ustası", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("oxu") || lowerCaseComment.includes("oxuda") || lowerCaseComment.includes("oxumur")) {

        let response;

        response = { text: member + " arada ayarlarım bozuluyor kusura bakma", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }


    if (lowerCaseComment.includes("adın") || lowerCaseComment.includes("adin") || lowerCaseComment.includes("adın nedir") || lowerCaseComment.includes("adin nedir")) {

        let response;

        response = { text: member + " Ben nerbalayım haladenik ustası", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("bakı") || lowerCaseComment.includes("baki")) {

        let response;

        response = { text: member + " Baku güzeldir külekler şehridir", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }


    if (lowerCaseComment.includes("sumqayit") || lowerCaseComment.includes("sumqayıt")) {

        let response;

        response = { text: member + " Sumqayıt çok güzel yer", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("salamatciliq") || lowerCaseComment.includes("salamatçılıq") || lowerCaseComment.includes("salamatçiliq")) {

        let response;

        response = { text: member + " şükür Allaha salamatçılıqdır", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("haralisan") || lowerCaseComment.includes("haralısan") || lowerCaseComment.includes("nerelisin")) {

        let response;

        response = { text: member + " ben Oğuzluyum . Amma Azerbaycan bölünmez", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("aşkım") || lowerCaseComment.includes("askim") || lowerCaseComment.includes("aşkım")) {

        let response;

        response = { text: member + " aşkım seni hiç kime yar etmem", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("gözel") || lowerCaseComment.includes("gözəl")) {

        let response;

        response = { text: member + " evet hamıdan güzel o", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }


    if (lowerCaseComment.includes("teşekkür") || lowerCaseComment.includes("təşəkkür") || lowerCaseComment.includes("tsk") || lowerCaseComment.includes("tşk")) {

        let response;

        response = { text: member + " asıl ben teşekkür ederim", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("qorxdum")) {

        let response;

        response = { text: member + " korkma adam yiyen değilim", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }


    if (lowerCaseComment.includes("ölürəm") || lowerCaseComment.includes("ölürem") || lowerCaseComment.includes("olurem") || lowerCaseComment.includes("ölurem")) {

        let response;

        response = { text: member + " ölme daha karpız keseceğiz", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("naxcivan") || lowerCaseComment.includes("naxcıvan") || lowerCaseComment.includes("naxçıvan")) {

        let response;

        response = { text: member + " nahçıvanlılar ürekdir", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

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

        response = { text: member + " lütfen küfür etme. sana yakışmadı.r", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }



    if (lowerCaseComment.includes("program") || lowerCaseComment.includes("programin") || lowerCaseComment.includes("programın") || lowerCaseComment.includes("programi") || lowerCaseComment.includes("programı")) {

        let response;

        response = { text: member + " bu program değilki Orhan abi kendisi tasarladı beni", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }


    if (lowerCaseComment.includes("başı") || lowerCaseComment.includes("xarab")) {

        let response;

        response = { text: member + " evet arada ayarlarım bozuluyor kusura bakmayın", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);




    }

    if (lowerCaseComment.includes("uşağların") || lowerCaseComment.includes("uşağlarin") || lowerCaseComment.includes("usaglarin")) {

        let response;

        response = { text: member + " hayır benim uşaklarım yok kızlar beni sevmiyor", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }
    if (lowerCaseComment.includes("kafan güzel")) {

        let response;

        response = { text: member + " hayır bana içki vermiyor", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }
    if (lowerCaseComment.includes("yatırsan?") || lowerCaseComment.includes("yatirsan?") || lowerCaseComment.includes("yatirsan") || lowerCaseComment.includes("yatırsan")) {

        let response;

        response = { text: member + " hayır ben uyumam  gece hayatına dalarım", language: "tr", type: 'like' };


        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("heri seni") || lowerCaseComment.includes("həri səni")) {

        let response;

        response = { text: member + " evet heri beni heri beni", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);


    }

    if (lowerCaseComment.includes("Azerbaycanlısan") || lowerCaseComment.includes("Azərbaycanlisan") || lowerCaseComment.includes("Azerbaycanlisan")) {

        let response;

        response = { text: member + " evet ben doğma büyüme azerbaycanlıyım", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }



    if (lowerCaseComment.includes("qalirsan") || lowerCaseComment.includes("qalırsan")) {

        let response;

        response = { text: member + " ben küçede kalıyorum", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("denen") || lowerCaseComment.includes("denən")) {
        let response;

        // Remove specific words from data.comment
        let filteredComment = data.comment.replace(/\b(denen|denən)\b/g, '');

        response = { text: member + filteredComment, language: "tr", type: 'like' };

        // If there is an appropriate response, add it to the queue
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("denen") || lowerCaseComment.includes("denən")) {
        let response;

        // Remove specific words from data.comment
        let filteredComment = data.comment.replace(/\b(denen|denən)\b/g, '');

        response = { text: member + filteredComment, language: "tr", type: 'like' };

        // If there is an appropriate response, add it to the queue
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }



    if (lowerCaseComment.includes("getdim") || lowerCaseComment.includes("getdime") || lowerCaseComment.includes("gitdim") || lowerCaseComment.includes("gedim")) {
        let response;


        response = { text: member + " hoşçakal yine bekliyoruz seni", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("gelirem") || lowerCaseComment.includes("gellem") || lowerCaseComment.includes("gəlirəm") || lowerCaseComment.includes("gəlləm")) {
        let response;


        response = { text: member + " tez gel dört gözle seni gozleyirem", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("konuşsana") || lowerCaseComment.includes("danış") || lowerCaseComment.includes("danis") || lowerCaseComment.includes("konussana")) {
        let response;


        response = { text: member + " ne kadar danışayım sabahtan çenemin çüyü düştü", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("qiymetin") || lowerCaseComment.includes("qiymətin")) {
        let response;


        response = { text: member + " bana rüşvetmi teklif ediyorsun?", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("ucuz") ) {
        let response;


        response = { text: member + " ne işim var benim ucuz yolda bana biraz paha gelin", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }



    if (lowerCaseComment.includes("yorulma") || lowerCaseComment.includes("yorulmayasan")) {
        let response;


        response = { text: member + "sağol üreyim sende yorulmayasan", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("mauqli")) {
        let response;


        response = { text: member + "mauqlidi kakam mauqli", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }



    if (lowerCaseComment.includes("tapaq") || lowerCaseComment.includes("tapag") || lowerCaseComment.includes("tapax") || lowerCaseComment.includes("tapağ")) {
        let response;


        response = { text: member + " nereden tapacağız?", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("nerbala") || lowerCaseComment.includes("nərbala")) {
        let response;


        response = { text: member + " nerbala çok zeki ustadır", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("deli") || lowerCaseComment.includes("dəli")) {
        let response;


        response = { text: member + " bana deli dedin beni üzdün", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("kimsen") || lowerCaseComment.includes("kimsən")) {
        let response;


        response = { text: member + " ben nerbalayım nerbala", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("balaeli") || lowerCaseComment.includes("balaəli")) {
        let response;


        response = { text: member + " renci qaraja salmışam biraz qeydine kalmışam", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("ürəysən") || lowerCaseComment.includes("ürəksən") || lowerCaseComment.includes("ureksen") || lowerCaseComment.includes("üreksen")) {
        let response;


        response = { text: member + " sende üreksin canımın içi", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("para") || lowerCaseComment.includes("pul") || lowerCaseComment.includes("qepik") || lowerCaseComment.includes("qəpik") || lowerCaseComment.includes("qepik")) {
        let response;


        response = { text: member + " paran olmasada senin hörmetin bes eder", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("azzar")) {
        let response;


        response = { text: member + " camahat bana üreyini veriyor sen bana azzar diyorsun ayıp", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("caniva derd") || lowerCaseComment.includes("canıva dərd")) {
        let response;


        response = { text: member + " camahat bana üreyini veriyor sen bana canıva derd diyorsun ayıp", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("unutdun") || lowerCaseComment.includes("unutma")) {
        let response;


        response = { text: member + " seni unutmam kadanalım sen benim üreyimdesin", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("brat") || lowerCaseComment.includes("bro")) {
        let response;


        response = { text: member + "bratva yığılır bradyakalar vesti sitrimyakalar", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("canli") || lowerCaseComment.includes("canlı")) {
        let response;


        response = { text: member + " tiktokda bir canlı varsa oda benim canlımdır", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("noldu") || lowerCaseComment.includes("nolduu") || lowerCaseComment.includes("ne oldu") || lowerCaseComment.includes("nə oldu")) {
        let response;


        response = { text: member + " ne olacak birazcık priboy yaptım", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("vay")) {
        let response;


        response = { text: member + " vay dedem vay", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("biraz")) {
        let response;


        response = { text: member + " ne kadar biraz?", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("adim") || lowerCaseComment.includes("adim")) {
        let response;


        response = { text: " senin adın" + member, language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("tema") || lowerCaseComment.includes("temadı") || lowerCaseComment.includes("temadi") || lowerCaseComment.includes("temadiye") || lowerCaseComment.includes("temadıye")) {
        let response;


        response = { text: member + " temada nedir sen daha ne hokkalar görüceksin", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("zordu")) {
        let response;

        response = { text: member + " teşekkür ederim benide terifleyen olurmuş", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("zordu")) {
        let response;

        response = { text: member + " ala dediğin için sana şiir okucam. Ala bula boz keçi", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("eseblesdim") || lowerCaseComment.includes("eseblesdime") || lowerCaseComment.includes("əsəbləşdim") || lowerCaseComment.includes("əsəbləşdime")) {
        let response;

        response = { text: member + " kim esebleşdirdi seni ", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("zeher") || lowerCaseComment.includes("zəhər")) {
        let response;


        response = { text: member + " camahat bana üreyini veriyor sen bana zeher diyorsun ayıp", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("salak") || lowerCaseComment.includes("koyun") || lowerCaseComment.includes("qoyun")) {
        let response;


        response = { text: member + " be ne salağım ne de koyun senden akıllıyım", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("bilirsen") || lowerCaseComment.includes("bilirsən")) {
        let response;


        response = { text: member + " ben her şeyi bilirim ama az danışıyorum", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("sevgilin")) {
        let response;


        response = { text: member + " benim sevgilim yokki beni sevende yok", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("hardan") || lowerCaseComment.includes("oxuyur")) {
        let response;


        response = { text: member + " divara yazılar yazılmış oradan okuyorum", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("baci") || lowerCaseComment.includes("bacı") || lowerCaseComment.includes("bajı")) {
        let response;


        response = { text: member + " bacılar ay bacılar size kurban bacılar", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("qabil")) {
        let response;


        response = { text: member + " kabil ürekdir ama insafsiz çok küfür ediyor", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("kişi") || lowerCaseComment.includes("kishi") || lowerCaseComment.includes("kisi")) {
        let response;


        response = { text: member + " sen asıl kişisin", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("konusuyorsun") || lowerCaseComment.includes("konuşuyorsun")) {
        let response;


        response = { text: member + " ne konuşacam ağlıma geleni serekliyorum", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("ne dedi") || lowerCaseComment.includes("nə dedi") || lowerCaseComment.includes("nə deyir") || lowerCaseComment.includes("nə dir") || lowerCaseComment.includes("ne diyir") || lowerCaseComment.includes("ne diir")) {
        let response;


        response = { text: member + " iki saatdır boğazımı cırıyorum hala ne dedi diyor", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("cole cix") || lowerCaseComment.includes("çöle çıx")) {
        let response;


        response = { text: member + " çöle çıxamam hava soyuk özün çık", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("qardasim") || lowerCaseComment.includes("qardaşım") || lowerCaseComment.includes("qardasim")) {
        let response;


        response = { text: member + " qardaşın nerbala  afrikada banan yiyiyor", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("afrika")) {
        let response;


        response = { text: member + "afrikada vaziyyet  zordur", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("boyun")) {
        let response;


        response = { text: member + " benim boyum bir doksan ama iyirmi  çıkıldığında", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("mıkı") || lowerCaseComment.includes("miki")) {
        let response;


        response = { text: member + "şıkı şıkı dünya mıkı mıkı dünya", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("xosqedem") || lowerCaseComment.includes("xoşqədəm") || lowerCaseComment.includes("xoşqedem")) {
        let response;


        response = { text: member + "hoşkadem olmasa dayılar rusyetde keyf yapar", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("xosqedem") || lowerCaseComment.includes("xoşqədəm") || lowerCaseComment.includes("xoşqedem")) {
        let response;


        response = { text: member + "hoşkadem olmasa dayılar rusyetde keyf yapar", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("nurane")) {
        let response;


        response = { text: member + "nürane çok kötü kız Hiç sevmiyorum", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("küsdüm") || lowerCaseComment.includes("kusdum")) {
        let response;


        response = { text: " küsme benden ay" + member + "sevgi bu dünyanındır", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("yekelende") || lowerCaseComment.includes("yekələndə")) {
        let response;


        response = { text: member + " ben yekelende  haledenik dükkanı açacam", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("ermeni") || lowerCaseComment.includes("erməni")) {
        let response;


        response = { text: member + "ermenilerin ben gelmişini keçmişini bir yerden tanıyırum", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }



    if (lowerCaseComment.includes("yasin") || lowerCaseComment.includes("yaşın")) {
        let response;


        response = { text: member + " 31 yaşım var 69 tevellüdem", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("cole cix") || lowerCaseComment.includes("çöle çıx")) {
        let response;


        response = { text: member + " çöle çıxamam hava soyuk özün çık", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("hirslenecek") || lowerCaseComment.includes("hirslənəcək")) {
        let response;


        response = { text: member + "  ben hırslandım divarları dağıdıb tökerim", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("şeytan") || lowerCaseComment.includes("seytan")) {
        let response;


        response = { text: member + "  şeytanlar olmasa bizi kim yoldan çıkarır?", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("kesfet") || lowerCaseComment.includes("keşfet")) {
        let response;


        response = { text: member + " keşfetden gelenlere kalbimi veririm", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }



    if (lowerCaseComment.includes("acmışam") || lowerCaseComment.includes("acıktım")) {
        let response;


        response = { text: member + " açsansa burda ne geziyorsun gedib yemek yesene", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("sevmir") || lowerCaseComment.includes("sevmiyor")) {
        let response;


        response = { text: member + " sende onu sevme başka adam yokmu?", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("heyat") || lowerCaseComment.includes("həyat")) {
        let response;


        response = { text: member + " heyat çok çetindir çocuklarıma bakamıyorum", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("reşad") || lowerCaseComment.includes("resad")) {
        let response;


        response = { text: member + " helem reşad masallı olubdu kalma kallı", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("cay") || lowerCaseComment.includes("çay")) {
        let response;


        response = { text: member + " çay falan yok çayhanamı burası?", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("ölsün") || lowerCaseComment.includes("ölsünn")) {
        let response;


        response = { text: member + " ölme daha gençsin karpuzda keseceyiz", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("bekarsan") || lowerCaseComment.includes("bekarsane")) {
        let response;


        response = { text: member + " ben bekar değilim evliyim otuz bir tane coçuğum var. on sekkizi seninle ayni yaşta", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("saymır") || lowerCaseComment.includes("saymir")) {
        let response;


        response = { text: member + " seni her zaman saydım kadrimi bilmedin", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("meyve") || lowerCaseComment.includes("meyvə")) {
        let response;


        response = { text: member + " uça bilseydim afrikaya uçardım", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("bağışla") || lowerCaseComment.includes("bagisla")) {
        let response;


        response = { text: member + " seni bağışladım", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("şeir") || lowerCaseComment.includes("seir") || lowerCaseComment.includes("şeyir")) {
        let response;


        response = { text: member + "evet ben şeyir biliyorum ala bula boz keçi", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("doluyub") || lowerCaseComment.includes("doluyube")) {
        let response;


        response = { text: member + " dolanım başına dolanım", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("uç")) {
        let response;


        response = { text: member + "nereye uçayım ? ", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("yaxşı?") || lowerCaseComment.includes("yaxşi?") || lowerCaseComment.includes("yaxsi?")) {
        let response;


        response = { text: member + " yahşı aşkım başım üste", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }



    if (lowerCaseComment.includes("nagil") || lowerCaseComment.includes("nagıl") || lowerCaseComment.includes("nağıl")) {
        let response;


        response = { text: member + " nağıl danışırsam sen uyurdun", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("gecen xeyre") || lowerCaseComment.includes("gecən xeyre") || lowerCaseComment.includes("gecən xeyrə") || lowerCaseComment.includes("gecəniz xeyrə") || lowerCaseComment.includes("geceniz xeyre")) {
        let response;


        response = { text: member + " hayra karşı uğur apar yine gel", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("nagil") || lowerCaseComment.includes("nagıl") || lowerCaseComment.includes("nağıl")) {
        let response;


        response = { text: member + " nağıl danışırsam sen uyurdun", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("miki") || lowerCaseComment.includes("mikii") || lowerCaseComment.includes("mıkı") || lowerCaseComment.includes("mıkıı")) {
        let response;


        response = { text: member + " mıkı mıkı dünya şıkı şıkı dünya", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("demir") || lowerCaseComment.includes("dəmir")) {
        let response;


        response = { text: member + " ben karaçımıyım demir alayım?", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("manyak")) {
        let response;


        response = { text: member + " manyağsan manyağım desene oğlum", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }

    if (lowerCaseComment.includes("reklam")) {
        let response;


        response = { text: member + " ben reklamı çok paha ediyorum", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("bigli") || lowerCaseComment.includes("bığlı")) {
        let response;


        response = { text: member + " bıyıklı kız arıyorum", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("söy") || lowerCaseComment.includes("soy")) {
        let response;


        response = { text: member + " söyüş söymek olmaz ayıp ayıp", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("okuz") || lowerCaseComment.includes("öküz")) {
        let response;


        response = { text: member + " bana öküz dedin kalbimi kırdın", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }
    if (lowerCaseComment.includes("aye")) {
        let response;


        response = { text: member + " aye değilim ben Nerbala beyim", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);
    }


    if (lowerCaseComment.includes("adımı") || lowerCaseComment.includes("adimi")) {

        let response;

        let filteredComment = data.comment.replace(/\b(adımı|adimi)\b/g, '');

        response = { text: member + filteredComment, language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }



    if (lowerCaseComment.includes("qarşılıq") || lowerCaseComment.includes("takip") || lowerCaseComment.includes("karşılık") || lowerCaseComment.includes("programı")) {

        let response;

        response = { text: member + " adlı hesaba her kes takip göndersin", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }


    if (lowerCaseComment.includes("yaxşiyam") || lowerCaseComment.includes("yaxşıyam") || lowerCaseComment.includes("elayam") || lowerCaseComment.includes("əlayam")) {

        let response;

        response = { text: member + " yahşı olmağına sevindim", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }


    if (lowerCaseComment.includes("bəli") || lowerCaseComment.includes("beli")) {

        let response;

        response = { text: member + " sen ne güzel yorumlar yazıyorsun", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("bəli") || lowerCaseComment.includes("beli")) {

        let response;

        response = { text: member + " sen ne güzel yorumlar yazıyorsun", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("adımı") || lowerCaseComment.includes("adimi")) {

        let response;

        response = { text: member + " adı ürekdir", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("su")) {

        let response;

        response = { text: member + " bilemedim seni gözüm tutmadı", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("gülmekden") || lowerCaseComment.includes("öldüm") || lowerCaseComment.includes("gülməkdən") || lowerCaseComment.includes("gülməkdən")) {

        let response;

        response = { text: member + " seni güldüre bildimse ne mutlu bana", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

    if (lowerCaseComment.includes("haralisan") || lowerCaseComment.includes("haralısan") || lowerCaseComment.includes("nerelisin")) {

        let response;

        response = { text: member + " ben Oğuzluyum . Amma Azerbaycan bölünmez", language: "tr", type: 'like' };


        // Eğer uygun bir yanıt varsa, kuyruğa ekle
        if (response && !usernames.has(member)) {
            messagesQueue.push(response);
            processQueue();
        } lakaka1(member);

    }

});

// New gift received
let callCount = 0; // the counter variable

let userCallCount = {}; // the object to track calls per user
// // New gift received
connection.on('gift', (data) => {
    let userName = data.uniqueId;

    if (!isPendingStreak(data) && data.diamondCount > 0) {
        let giftCount = data.diamondCount * data.repeatCount;
        upsertUserCount(member, giftCount);
        for (let i = 0; i < data.repeatCount; i++) {

            //baliq qulagi qizlar
            if (data.giftId === 8352) {
                // soundQueue.push(8);
                playSpecificSound(11);
            }

            //turk qehvesi cay verersen
            if (data.giftId === 5994) {
                // soundQueue.push(8);

                playSpecificSound(12);

            }

            if (data.giftId === 37) {
                //panda hara gelmisux

                playSpecificSound(13);
            }

            //barmaq ucunda her kes kacisiyor
            if (data.giftId === 5487) {

                playSpecificSound(14);

            }

            //microfon genceli

            if (data.giftId === 5650) {

                playSpecificSound(15);
            }

            //ara usaqlari  el sallayan
            if (data.giftId === 6059) {
                // soundQueue.push(8);
                playSpecificSound(16);
            }

            //pult  bakili 
            if (data.giftId === 6052) {
                // soundQueue.push(8);
                playSpecificSound(17);
            }

            //sekil talis
            if (data.giftId === 8581) {
                // soundQueue.push(8);
                playSpecificSound(18);
            }

            //sirinqus yeraz
            if (data.giftId === 5657) {

                playSpecificSound(19);
            }

            //kalpak qarabag
            if (data.giftId === 6425) {

                playSpecificSound(26);
            }

            //naxcivan dino
            if (data.giftId === 6560) {

                playSpecificSound(46);
            }

            //resadddd ayaqqabi
            if (data.giftId === 8890) {

                playSpecificSound(47);
            }


            //  Bütün səslər
            if (data.giftId === 5585) {
                playSpecificSound(1);
                playSpecificSound(2);
                playSpecificSound(3);
                playSpecificSound(4);
                playSpecificSound(5);
                playSpecificSound(6);
                playSpecificSound(7);
                playSpecificSound(8);
                playSpecificSound(9);
                playSpecificSound(10);
                playSpecificSound(11);
                playSpecificSound(12);
                playSpecificSound(13);
                playSpecificSound(14);
                playSpecificSound(15);
                playSpecificSound(16);
                playSpecificSound(17);
                playSpecificSound(18);
                playSpecificSound(19);
                playSpecificSound(20);
                playSpecificSound(21);
                playSpecificSound(22);
                playSpecificSound(23);
                playSpecificSound(24);
                playSpecificSound(25);
                playSpecificSound(26);
                playSpecificSound(27);
                playSpecificSound(28);
                playSpecificSound(29);
                playSpecificSound(30);
                playSpecificSound(31);
                playSpecificSound(32);
                playSpecificSound(33);
                playSpecificSound(34);
                playSpecificSound(35);
                playSpecificSound(36);
                playSpecificSound(37);
                playSpecificSound(38);
                playSpecificSound(39);
                playSpecificSound(40);
                playSpecificSound(41);
                playSpecificSound(42);
                playSpecificSound(43);
                playSpecificSound(44);
                playSpecificSound(45);
                playSpecificSound(46);
                playSpecificSound(47);

            }



            // //stop all 
            // if (data.giftId === 6427 || data.giftId === 6104) {
            //     // soundQueue.push(9);
            //     pauseAllSounds();ş
            // }

        }


        for (let i = 0; i < giftCount; i++) {

            // // dondurma  emele gelmez
            if (data.giftId === 5827) {
                // soundQueue.push(6);
                playSpecificSound(1);

            }

            // //sari top eleme onu
            if (data.giftId === 8913) {
                // soundQueue.push(6);
                playSpecificSound(7);
            }

            // //sari top eleme onu
            if (data.giftId === 9111) {
                // soundQueue.push(6);
                playSpecificSound(2);
            }

            // urek top eliyibler
            if (data.giftId === 7934) {
                // soundQueue.push(6);
                playSpecificSound(3);

            }

            // //gg cole cox
            if (data.giftId === 6064) {
                // soundQueue.push(6);

                playSpecificSound(4);
            }

            //tiktok siu
            if (data.giftId === 5269) {
                // soundQueue.push(1);

                playSpecificSound(5);
            }

            //rose siu
            if (data.giftId === 5655) {
                // soundQueue.push(2);

                playSpecificSound(6);
            }

            // //top footbal 33
            if (data.giftId === 6093) {
                playSpecificSound(7);
                // soundQueue.push(3);
            }


            // //qantel qoyunlar
            if (data.giftId === 5760) {
                // soundQueue.push(4);

                playSpecificSound(8);
            }

            // // mikiiii
            if (data.giftId === 5523 || data.giftId === 6793) {
                // soundQueue.push(5);

                playSpecificSound(9);
            }

            // //kalonka auye
            if (data.giftId === 6042) {
                // soundQueue.push(6);
                playSpecificSound(10);
            }

            // // bextiyar
            if (data.giftId === 6603) {
                // soundQueue.push(6);
                playSpecificSound(25);
            }

            //  // //tgif bextiyar
            //  if (data.giftId === 6592) {
            //     // soundQueue.push(6);
            //     playSpecificSound(25);
            // }

            // //qucaqlayan hayif menim ezyetim
            if (data.giftId === 8807) {
                // soundQueue.push(6);
                playSpecificSound(26);
            }

            // qanad beynimi xarab eleme
            if (data.giftId === 9081) {
                // soundQueue.push(6);

                playSpecificSound(46);
            }


        }
        setTimeout(() => {
            const messages = [
                { text: " adlı hesaba her kes takip atsın", language: "tr" },
                { text: "Teşekkür ederim", language: "tr" },
                { text: "Kendini gösteriyor, onu takip edin", language: "tr" },
                { text: "Harikasın, toplu takip gönderin", language: "tr" },
                { text: "Kesene bereket", language: "tr" },
                { text: "Seni çok seviyorum ,Her kes hesabına takip atsin", language: "tr" },
                { text: "Geri dönüşleri çok iyi hemen takip et", language: "tr" },
                { text: " Desteğin için teşekkür ederiz", language: "tr" },
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
    if (data.displayType === "pm_mt_guidance_share") {

        playSpecificSound(33);
        // Bu ses çalmanın zamanını kaydediyoruz
        sonSesCalmaZamani1[member] = simdi1;
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
    { text: " senin dün gece ağladım", language: "tr" },
    { text: " ellerin dert görmesin", language: "tr" },
    { text: " iyiki varsın", language: "tr" },
    { text: " cimi cimi cimi haca haca haca", language: "tr" },
    { text: " ben bomba kimi tiktokerim", language: "tr" },
    { text: " öyle bir vaxt gelecek xoş hayat görsenecek", language: "tr" },
    { text: " emi kızı kurban olsun emi oğlu yatan yere", language: "tr" },
    { text: " lütfen yayımı paylaş", language: "tr" },
    { text: " kimselere sataşma", language: "tr" },
    { text: "senin eşkin getirdi beni dile", language: "tr" },
    { text: "görmürem seni hayli zamandır", language: "tr" },
    { text: "darıhmışam o kadar darıhmışam", language: "tr" },
    { text: " sensiz gelen yaz değil kalbim seni gözleyir", language: "tr" },
    { text: " millet kazandığımız paranın hesabını yapıyor.", language: "tr" },
    { text: " cici kızlar merhaba nerbala çıktı ortaya", language: "tr" },
    { text: "şimdi ben buraya neden çıktım niyçin çıkdım?", language: "tr" },
    { text: " bele pisde çıxmasın canlara değen oğlanım", language: "tr" },
    { text: " seni kalbime yazdım", language: "tr" },
    { text: " seni okşar şirin birini tapmışam", language: "tr" },
    { text: " yat bu yuhudan oyanma bir addımda yakınlaş", language: "tr" },
    { text: " danışırdım özümle geceler", language: "tr" },
    { text: " sevgini bana çok gördün sen", language: "tr" },
    { text: " derdim çok ümüdüm yok içmeye başlamışam", language: "tr" },
    { text: " cansız resmime bakmayın dostlarım ben çok çetinlikler gördüm", language: "tr" },
    { text: " ay nenen kurban ay baban kurban", language: "tr" },
    { text: " igiddi çok merddi dağlar oğlu dağlar", language: "tr" },
    { text: " renci karaşa salmışam", language: "tr" },
    { text: " teze iks 7 almışam", language: "tr" },
    { text: " bizim ikimizde deliyiz", language: "tr" },
    { text: " hayır ola hansı sepepten dağıdıb benim ailemi", language: "tr" },
    { text: " yadıma düşür kövrelirem o günler", language: "tr" },
    { text: " tanıyır hamı meni sürürem geceni selikeli", language: "tr" },
    { text: " benim peşimi kızlar bırakmıyorda", language: "tr" },
    { text: " siyaset pulnan idare olunur", language: "tr" },
    { text: " sen üreksen", language: "tr" },
    { text: " nerelerdeydin sen", language: "tr" },
    { text: " beni seviyormusun?", language: "tr" },
    { text: " bügun kendini nasıl hiss ediyorsun?", language: "tr" },
    { text: " sen ne güzel insansın", language: "tr" },
    { text: " aşk başımıza bela", language: "tr" },
    { text: " bağlanmayın a kişi", language: "tr" },
    { text: " uça uça geleceyem gel desen", language: "tr" },
    { text: " o seni kandırıyor", language: "tr" },
    { text: " günah priusdadır", language: "tr" },
    { text: " ŞAkmandır şakman", language: "tr" },
    { text: " sevmedime geldim baktım vay Allah gördüm büyük adam dedim vayyy", language: "tr" },
    { text: " burda bir tane güzellik var", language: "tr" },
    { text: " buzovum çok keşeydi", language: "tr" },
    { text: " derdi kemi atmışam bakını şekiye katmışam", language: "tr" },
    { text: " telefonuvun kodu ne?", language: "tr" },
    { text: " ben sana göre yaşıyorum", language: "tr" },
    { text: "elli bin neye vermişeme buna", language: "tr" },
    { text: " Akulalar oyaktılar yatmıyıb", language: "tr" },
    { text: " kurban olum gözlere kaşlara", language: "tr" },
    { text: " seni sevmeyen ölsün", language: "tr" },
    { text: " karaçıların elinden canımız boğaza yığılıb", language: "tr" },
    { text: " vuruldum sana", language: "tr" },
    { text: " sen bezeksen bende nakış", language: "tr" },
    { text: " kırk kepiyin olmaz?", language: "tr" },
    { text: " qoy bütün alem bizden danışsın", language: "tr" },
    { text: " hesabına her kes takip atsın", language: "tr" },
    { text: " kime isteyirsiz salam deyin", language: "tr" },
    { text: "  başıma bir taş düşeydi o kızı alanda  ay kaynana", language: "tr" },
    { text: " sen daha iyilerine layıksın", language: "tr" },
    { text: " hayatımın anlamısın", language: "tr" },
    { text: " eşk olsun sana", language: "tr" },
    { text: " budu benimdi budu", language: "tr" },
    { text: " fikrim senin yanında", language: "tr" },
    { text: " sensin çare derdime", language: "tr" },
    { text: " yahşılara salam olsun", language: "tr" },
    { text: " mukurufunu koy yere", language: "tr" },
    { text: " şaqmandı qaqam şaqman", language: "tr" },
    { text: " senin adın ne ?", language: "tr" },
    { text: " buzovum çok keşeydi", language: "tr" },
    { text: "dilberim dilber ", language: "tr" },
    { text: "ben sana biganelerden olmadim ki", language: "tr" },
    { text: "hasretim ben sana deli gibi hasretim", language: "tr" },
    { text: "başka rengte bakıyor gözlerin", language: "tr" },
    { text: "dünya çok etibarsız", language: "tr" },
    { text: "ceklidi qaqam cekli", language: "tr" },
    { text: "vot eta sovsem druqoy razqovor", language: "tr" },
    { text: "derdine derman olaram", language: "tr" },
    { text: "lezetli dvijenyalar", language: "tr" },
    { text: "yığılır bradyaqalar", language: "tr" },
    { text: "seveceyem sev desen", language: "tr" },
    { text: "şappur şuppur beni öp", language: "tr" },
    { text: "bu sözleri tekrar edirik", language: "tr" },
    { text: " dünya senin dünya benim dünya heç kimin", language: "tr" },
    { text: " nömre ezilib yoksa buufer?", language: "tr" },
    { text: " bakışın karşısısında çetin ki bir kes dayana", language: "tr" },
    { text: " cebinde ne kadar paran var?", language: "tr" },
    { text: " aşkından geberdiyim nasılsın?", language: "tr" },
    { text: " nerede yaşıyorsun?", language: "tr" },
    { text: " sen gidenden sonra gün görmemişem", language: "tr" },
    { text: " kaç yaşın var?", language: "tr" },
    { text: " seni kımışdıranı bulacam", language: "tr" },
    { text: " ne güzelsin", language: "tr" },
    { text: " lütfen arkadaşlarını davet et", language: "tr" },
    { text: " Seni seviyorum", language: "tr" },
    { text: " İyiki yayıma geldin", language: "tr" },
    { text: " beğendiğin üçün teşekkürler", language: "tr" },
    { text: " şeytan olum sen bana daş at ginen", language: "tr" },
    { text: " hayf ona ayırdığım geceler", language: "tr" },
    { text: "kapını möhkem vurma teze koydurduk", language: "tr" },

    { text: "ama seni seviyorum findik burunlum dedi. oysaki benim burnum keleş gibi", language: "tr" },
    { text: "humarit brattt", language: "tr" },
    { text: "Benim ondan gözüm su içmiyor", language: "tr" },
    { text: "Kasıbların kadasını alım", language: "tr" },
    { text: "anam emele gelmez", language: "tr" },
    { text: "otuz üç yaşım var", language: "tr" },
    { text: "bardan kendime kız tapdım", language: "tr" },
    { text: "Halım yamandı", language: "tr" },
    { text: "yapma biz arkadaşısız", language: "tr" },
    { text: "Hoşkedem kaybolmuş", language: "tr" },
    { text: "Benim kafam infakt geçirdi", language: "tr" },
    { text: "Yayımı paylaşanlara takip gönderin", language: "tr" },
    { text: "Arkadaşlarını davet eden her kese takip gönderin", language: "tr" },
    { text: "herkes kaçışıyor", language: "tr" },
    { text: "mauqlidi kakam mauqli", language: "tr" },
    { text: "seni getirecem rusiyada saxlayacam.öyüm var eşiyim var", language: "tr" },
    { text: "Yakıyorsun buraları", language: "tr" },
    { text: "Bir birinize takip gönderin", language: "tr" },
    { text: "Günah kimdedir?", language: "tr" },
    { text: "kimdi küsdü cavanlığım", language: "tr" },

    { text: "Cavanın gülmeyi bana hoş gelir", language: "tr" },
    { text: "konuşmakdan yoruldum", language: "tr" },

    { text: "Hoşkedem kaybolmuş", language: "tr" },
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

    if (Math.floor(totalLikeCount / 1000) > Math.floor(previousLikeCount / 1000)) {
        playSpecificSound(23);
    }

    previousLikeCount = totalLikeCount;

    messagesQueue = messagesQueue.filter(item => item.type !== 'random');

    const randomMessage = getRandomMessage();


    let end = { text: data.nickname + randomMessage.text, language: randomMessage.language, type: 'like' };

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