let soundQueue = [];
let sounds = {};
let soundCount = {};
let maxQueueSizePerSound = 10;
let retryInterval = 3000; // 5 saniye sonra yeniden deneme süresi
var volumeLevel = 0.1;  // Volume level for all voices



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

let sorular = [
    { soru: "Azərbaycanın paytaxtı hansı şəhərdir?", cevaplar: ["Bakı", "Gəncə", "Sumqayıt", "Lənkəran"], dogruCevap: 0 },
    { soru: "Azərbaycanın rəsmi dili hansıdır?", cevaplar: ["Azərbaycanca", "Rusca", "Türkcə", "İngiliscə"], dogruCevap: 0 },
    { soru: "Azərbaycanın bayrağı hansı rənglərdədir?", cevaplar: ["Göy və qırmızı", "Qırmızı və qara", "Yaşıl və qara", "Göy və sarı"], dogruCevap: 0 },
    { soru: "Azərbaycanın milli qida hansıdır?", cevaplar: ["Plov", "Pizza", "Burger", "Sushi"], dogruCevap: 0 },
    { soru: "Xüsusilə sıcak, çöl ikliminə sahib olan ölkə hansıdır?", cevaplar: ["Səudiyyə Ərəbistanı", "Meksika", "Kanada", "Çin"], dogruCevap: 0 },
    { soru: "Giza Piramitləri hansı ölkədə yerləşir?", cevaplar: ["Türkiyə", "Mısır", "Yunanıstan", "Meksika"], dogruCevap: 1 },
    { soru: "Nil çayının mənbəyi hansı göldə yerləşir?", cevaplar: ["Tanganika gölü", "Victoria gölü", "Kariba gölü", "Kyivu gölü"], dogruCevap: 0 },
    { soru: "\"Big Ben\" hansı şəhərdə yerləşir?", cevaplar: ["Paris", "Londra", "Roma", "Berlin"], dogruCevap: 1 },
    { soru: "İqtisadiyyat və İnkişaf Təşkilatı (OECD) hansı sahədə təşkilatdır?", cevaplar: ["Elm", "Ədəbiyyat", "İqtisadiyyat", "İdman"], dogruCevap: 2 },
    { soru: "Dünya Əhalisinin çoxluğu hansı kıtada yaşayır?", cevaplar: ["Asiya", "Avropa", "Afrika", "Şimali Amerika"], dogruCevap: 0 },
    { soru: "2020 Yay Olimpiyatları hansı şəhərdə keçirildi?", cevaplar: ["Rio de Janeiro", "Tokyo", "Londra", "Sydney"], dogruCevap: 1 },
    { soru: "\"Büyük Duvar\" hansı ölkədə yerləşir?", cevaplar: ["Çin", "Rusiya", "Kanada", "Avstraliya"], dogruCevap: 0 },
    { soru: "Amazon Yağış Ormanları hansı kıtada yerləşir?", cevaplar: ["Afrika", "Asiya", "Avropa", "Cənubi Amerika"], dogruCevap: 3 },
    { soru: "\"Taj Mahal\" hansı ölkədə yerləşir?", cevaplar: ["Hindistan", "Tayland", "Nepal", "Pakistan"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük gölü hansıdır?", cevaplar: ["Göyçə", "Sarysu", "Mingəçevir", "Ceyranbatan"], dogruCevap: 0 },
    { soru: "Azərbaycanın milli dansı hansıdır?", cevaplar: ["Yallı", "Salsa", "Tango", "Ballet"], dogruCevap: 0 },
    { soru: "Azərbaycanın milli hərəkəti hansıdır?", cevaplar: ["Yumruq vurmaq", "Atmaq", "Oynaq", "Döyüş"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən uzun döyüş idmanı hansıdır?", cevaplar: ["Karate", "Judo", "Taekwondo", "Wushu"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük dövlət universiteti hansıdır?", cevaplar: ["Bakı Dövlət Universiteti", "Gəncə Dövlət Universiteti", "Xəzər Universiteti", "Azərbaycan Dövlət İqtisad Universiteti"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük təbii gölü hansıdır?", cevaplar: ["Göyçə gölü", "Sarysu gölü", "Ceyranbatan gölü", "Mingəçevir su anbarı"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük neft yatağı hansıdır?", cevaplar: ["Azeri-Chirag-Guneshli", "Şahdeniz", "Umid", "Abşeron"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən uzun çayı hansıdır?", cevaplar: ["Kür", "Araz", "Samur", "Tərtər"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük müasir qala qalası hansıdır?", cevaplar: ["Xızı qalası", "Göyqala", "Nizami qalası", "Baku Crystal Hall"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən uzun dənizi hansıdır?", cevaplar: ["Kaspi dəni", "Bakı dəni", "Lənkəran dəni", "Naxçıvan dəni"], dogruCevap: 0 },
    { soru: "Azərbaycanın milli heyvani hansıdır?", cevaplar: ["Kürk", "Qurt", "Babayıran", "Meymun"], dogruCevap: 0 },
    { soru: "Azərbaycanın milli körpüsü hansıdır?", cevaplar: ["Qobustan körpüsü", "Qız qalası", "Kifayət körpüsü", "Şah Əli körpüsü"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük tikinti şirkəti hansıdır?", cevaplar: ["Azersu", "AzVirt", "Azersun", "Azərsuq"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük doqqu şirkəti hansıdır?", cevaplar: ["Azersu", "AzVirt", "Azersun", "Azərsuq"], dogruCevap: 0 },
    { soru: "Azərbaycanın rəsmi pul vahidi hansıdır?", cevaplar: ["Manat", "Dollar", "Avro", "Rubl"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən yüksək dağı hansıdır?", cevaplar: ["Şahdağ", "Tufan dağı", "Bazardüzü", "Bozdağ"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük universiteti hansıdır?", cevaplar: ["Bakı Dövlət Universiteti", "Gəncə Dövlət Universiteti", "Xəzər Universiteti", "Azərbaycan Dövlət İqtisad Universiteti"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük müasir tamaşa binaları hansılardır?", cevaplar: ["Baku Crystal Hall", "Heydər Əliyev Mərkəzi", "Mədəniyyət Mərkəzi", "Nizami Gəncəvi adına Milli Azərbaycan Milli Ədəbiyyat Muzeyi"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük şirkəti hansıdır?", cevaplar: ["SOCAR", "Azersu", "AzVirt", "Azersun"], dogruCevap: 0 },
    { soru: "Böyük Okean hansı kıyıdaş ölkələrlə əhatə olunur?", cevaplar: ["ABŞ və Kanada", "Avstraliya və Yeni Zelandiya", "Rusiya və Yaponiya", "Çin və Hindistan"], dogruCevap: 0 },
    { soru: "Kanada'nın paytaxtı hansı şəhərdir?", cevaplar: ["Toronto", "Montreal", "Vankuver", "Ottava"], dogruCevap: 3 },
    { soru: "Amazon yağış ormanları hansı kıtada yerləşir?", cevaplar: ["Afrika", "Asiya", "Avropa", "Cənubi Amerika"], dogruCevap: 3 },
    { soru: "Çin Seddi hansı ölkədə yerləşir?", cevaplar: ["Rusiya", "Çin", "Hindistan", "Pakistan"], dogruCevap: 1 },
    { soru: "Eifel Qulesi hansı şəhərdə yerləşir?", cevaplar: ["Londra", "Paris", "Berlin", "Roma"], dogruCavab: 1 },
    { soru: "Machu Picchu hansı ölkədə yerləşir?", cevaplar: ["Peru", "Boliviya", "Ekvador", "Kolumbiya"], dogruCevap: 0 },
    { soru: "Kolizey hansı şəhərdə yerləşir?", cevaplar: ["Atina", "Roma", "Meksika Şəhəri", "Barselona"], dogruCavab: 1 },
    { soru: "Victoria Şəlalələri hansı ölkədə yerləşir?", cevaplar: ["ABŞ", "Kanada", "Avstraliya", "Yeni Zelandiya"], dogruCavab: 1 },
    { soru: "Nömrənizi qoymadan gəzmək qadağandır yazarının müəllifi kimdir?", cevaplar: ["Mark Twain", "George Orwell", "J.K. Rowling", "Ernest Hemingway"], dogruCavab: 0 },
    { soru: "Azərbaycanın sahil xəttinin uzunluğu ne qədərdir?", cevaplar: ["100 km", "300 km", "700 km", "1200 km"], dogruCavab: 2 },
    { soru: "Avropa Birliyi üzv ölkələrindən biri olan İsveçin paytaxtı hansı şəhərdir?", cevaplar: ["Oslo", "Stokholm", "Kopenhagen", "Helsinki"], dogruCavab: 1 },
    { soru: "Ağ Evi isə hansı ölkədə yerləşir?", cevaplar: ["Fransa", "İtaliya", "İspaniya", "Portuqaliya"], dogruCavab: 0 },
    { soru: "Serengeti ərazisi hansı ölkədə yerləşir və məşhurluğu nədir?", cevaplar: ["Kenya, məşhur dağlar", "Tanzaniya, məşhur dənizlər", "Namibiya, məşhur çöllər", "Uqanda, məşhur göllər"], dogruCavab: 1 },
    { soru: "Qapaq Kulun doğma şəhəri hansıdır?", cevaplar: ["Bakı", "Gəncə", "Sumqayıt", "Lənkəran"], dogruCavab: 0 },
    { soru: "Yüksək Dağlar Böyük çayının mənbəyidir və hansı dağ silsiləsində yerləşir?", cevaplar: ["And Dağları", "Alp Dağları", "Himalayalar", "Rockies"], dogruCavab: 2 },
    { soru: "Mərmər və akakiya zavodları ilə məşhurdur və müstəqil ölkə olan ölkə hansıdır?", cevaplar: ["Yaponiya", "Çin", "Yeni Zelandiya", "Avtstriya"], dogruCavab: 3 },
    { soru: "Luvr Muzeyi hansı şəhərdə yerləşir?", cevaplar: ["Londra", "Paris", "Berlin", "Roma"], dogruCavab: 1 },
    { soru: "Niagara Şəlalələri hansı iki ölkənin sərhədini təşkil edir?", cevaplar: ["ABŞ və Kanada", "Meksika və ABŞ", "Kanada və İngiltərə", "Rusiya və Kanada"], dogruCavab: 0 },
    { soru: "Bəzi təhlükəli canlılar üçün əlverişli həyat mühitinə sahib olan qarlı dağ silsiləsi hansıdır?", cevaplar: ["And Dağları", "Alp Dağları", "Himalayalar", "Rockies"], dogruCavab: 1 },
    { soru: "Mikrosoft şirkəti hansı ABŞ ştatında yaradılmışdır?", cevaplar: ["Kaliforniya", "Nyuyork", "Teksas", "Vashington"], dogruCavab: 3 },
    { soru: "Dünyanın ən böyük adası hansıdır?", cevaplar: ["Java", "Yava", "Madagaskar", "Grönland"], dogruCavab: 3 },
    { soru: "Çin Əsrlər Divarı hansı dövrdə tikilib?", cevaplar: ["M.Ö. 3-cü əsrdə", "M.S. 1-ci əsrdə", "5-ci əsrdə", "15-ci əsrdə"], dogruCavab: 2 },
    { soru: "Kanada bayrağı üzərində hansı simvol yerləşir?", cevaplar: ["Qırmızı qaracağ", "Ağ çapar", "Mavi dördügü", "Ərzaqdan süfrə"], dogruCavab: 0 },
    { soru: "Mona Lizanın portreti kimin tərəfindən çəkilmişdir?", cevaplar: ["Leonardo da Vinçi", "Pablo Pikasso", "Vincent van Qoq", "Michelanjelo"], dogruCavab: 0 },
    { soru: "Kilimancaro dağı hansı ölkədə yerləşir?", cevaplar: ["Kenya", "Tanzaniya", "Uqanda", "Ruanda"], dogruCavab: 1 },
    { soru: "Yenikənd faciəsi hansı il baş vermişdir?", cevaplar: ["1988", "1990", "1992", "1994"], dogruCavab: 0 },
    { soru: "Fayton və denizqıraqları üçün məşhur olan turistik ərazi hansı ölkədə yerləşir?", cevaplar: ["Türkiyə", "Yunanıstan", "Meksika", "Tayland"], dogruCavab: 1 },
    { soru: "Azərbaycanın dövlət müstəqilliyini necə ildə qazanmışdır?", cevaplar: ["1918", "1920", "1991", "1994"], dogruCavab: 0 },
    { soru: "Dünyanın ən böyük ərazi sahəsinə sahib olan ölkə hansıdır?", cevaplar: ["Rusiya", "Çin", "ABŞ", "Kanada"], dogruCavab: 0 },
    { soru: "Antarktika ərazi məntəqəsi hansı ölkələr tərəfindən iddia edilir?", cevaplar: ["Avstraliya, Yeni Zelandiya", "ABŞ, Kanada", "Rusiya, Norveç", "Braziliya, Şili"], dogruCavab: 2 },
    { soru: "Suez Kanalı hansı ölkədə yerləşir?", cevaplar: ["Misir", "Səudiyyə Ərəbistanı", "Ürdün", "İsrail"], dogruCavab: 0 },
    { soru: "Palmira antik şəhəri hansı ölkədə yerləşir?", cevaplar: ["İraq", "İran", "Suriya", "Yəmən"], dogruCavab: 2 },
    { soru: "Qape Xocalı soyqırımı hansı il baş vermişdir?", cevaplar: ["1990", "1992", "1994", "1996"], dogruCavab: 1 },
    { soru: "At Xocalı faciəsi hansı il baş vermişdir?", cevaplar: ["1918", "1945", "1988", "1992"], dogruCavab: 3 },
    { soru: "Piramid formaları ilə məşhurdur və hansı ölkədə yerləşir?", cevaplar: ["Hindistan", "Tayland", "Meksika", "Mısır"], dogruCavab: 3 },
    { soru: "Qara dəniz hansı ölkələrlə çevriliyir?", cevaplar: ["Yunanıstan, İsrail, Türkiyə", "İran, Pakistan, Əfqanıstan", "Türkmenistan, Kazaxstan, Özbəkistan", "Rusiya, Ukrayna, Romaniya"], dogruCavab: 0 },
    { soru: "Niagara Şəlalələri hansı gölün sularından doğur?", cevaplar: ["Miqor, Miskigan", "Miskigan, Ontario", "Superior, Michigan", "Huron, Erie"], dogruCavab: 1 },
    { soru: "Ümumilikdə, Dünya çayları hansı okeanın sularına axır?", cevaplar: ["Böyük Okean", "Atlantik Okean", "Şimali Dəniz", "Meksika Qörüntülüq"], dogruCavab: 1 },
    { soru: "Şerlok Holms romanlarının müəllifi kimdir?", cevaplar: ["Agata Kristi", "Edqar Allan Po", "Sir Arthur Conan Doyle", "Charles Dickens"], dogruCavab: 2 },
    { soru: "Pariz Kafedralı hansı şəhərdə yerləşir?", cevaplar: ["Roma", "Barselona", "Londra", "Paris"], dogruCavab: 3 },
    { soru: "Olimpiya Oyunları bütün 4 illik müddətdə hansı şəhərdə keçirilir?", cevaplar: ["Londra", "Atina", "Pekin", "Rio de Janeiro"], dogruCavab: 1 },
    { soru: "Azərbaycanın ən böyük gölü hansıdır?", cevaplar: ["Göyçə gölü", "Sarysu gölü", "Ceyranbatan gölü", "Mingəçevir su anbarı"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük neft yatağı hansıdır?", cevaplar: ["Azeri-Chirag-Guneshli", "Şahdeniz", "Umid", "Abşeron"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən uzun çayı hansıdır?", cevaplar: ["Kür", "Araz", "Samur", "Tərtər"], dogruCevap: 0 },
    { soru: "Hangi planet Güneş Sistemi'ndeki ən böyük planetdir?", cevaplar: ["Mars", "Venera", "Jüpiter", "Uran"], dogruCevap: 2 },
    { soru: "İkinci Dünya Müharibəsi hansı illər arasında baş verdi?", cevaplar: ["1939-1945", "1914-1918", "1941-1944", "1950-1953"], dogruCevap: 0 },
    { soru: "Hansı ölkə Okyanusiya qitəsində yer almır?", cevaplar: ["Yeni Zelandiya", "Avstraliya", "Fici", "İndoneziya"], dogruCevap: 3 },
    { soru: "Mona Liza şəklinin müəllifi kimdir?", cevaplar: ["Pablo Pikasso", "Leonardo da Vinçi", "Vincent van Qoq", "Mişelanjelo"], dogruCevap: 1 },
    { soru: "Hansı qıtada Nil çayı yerləşir?", cevaplar: ["Asiya", "Avropa", "Afrika", "Cənubi Amerika"], dogruCevap: 2 },
    { soru: "Fransız İnkilabı hansı illərdə baş verdi?", cevaplar: ["1776-1783", "1789-1799", "1804-1815", "1848-1849"], dogruCevap: 1 },
    { soru: "Hansı ölkə Cənubi Amerika'nın ən böyük ölkəsidir?", cevaplar: ["Argentina", "Braziliya", "Çili", "Peru"], dogruCevap: 1 },
    { soru: "Dünyanın ən yüksək dağı olan Everest hansı dağ silsiləsində yerləşir?", cevaplar: ["And Dağları", "Rockies", "Himalayalar", "Alplər"], dogruCevap: 2 },
    { soru: "Qızılların yerli olduğu qıtə hansıdır?", cevaplar: ["Asiya", "Avropa", "Afrika", "Şimali Amerika"], dogruCevap: 3 },
    { soru: "Hansı planet Güneş Sistemi'ndəki Yerə oxşar planetlərdən biri deyil?", cevaplar: ["Mars", "Venera", "Jüpiter", "Merkuri"], dogruCevap: 2 },
    { soru: "Hansı ölkə Ayda ilk insanlı inişi həyata keçirdi?", cevaplar: ["ABŞ", "Rusiya", "Çin", "Fransa"], dogruCevap: 0 },
    { soru: "Hansı il Amerikanın kəşfi kimi qəbul edilir?", cevaplar: ["1492", "1512", "1535", "1620"], dogruCevap: 0 },
    { soru: "Hansı şəhər Venetsiya kanalları ilə məşhurdur?", cevaplar: ["Lissabon", "Atina", "Vyana", "Venetsiya"], dogruCevap: 3 },
    { soru: "Dünyanın ən uzun çayı hansıdır?", cevaplar: ["Nil Çayı", "Amazon Çayı", "Mississippi Çayı", "Yangtze Çayı"], dogruCevap: 0 },
    { soru: "Hansı ölkə Böyük Okeanın ən böyük adası olan Qrönlandiyaya sahibdir?", cevaplar: ["Kanada", "Danimarka", "Norveç", "İslandiya"], dogruCavab: 1 },
    { soru: "Amerikanın Daxili Müharibəsi hansı illər arasında baş verdi?", cevaplar: ["1800-1815", "1830-1840", "1850-1865", "1880-1890"], dogruCavab: 2 },

    { soru: "Azərbaycanın ən böyük müasir qala qalası hansıdır?", cevaplar: ["Xızı qalası", "Göyqala", "Nizami qalası", "Baku Crystal Hall"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən uzun dənizi hansıdır?", cevaplar: ["Kaspi dəni", "Bakı dəni", "Lənkəran dəni", "Naxçıvan dəni"], dogruCevap: 0 },
    { soru: "Azərbaycanın milli heyvani hansıdır?", cevaplar: ["Kürk", "Qurt", "Babayıran", "Meymun"], dogruCevap: 0 },
    { soru: "Azərbaycanın milli körpüsü hansıdır?", cevaplar: ["Qobustan körpüsü", "Qız qalası", "Kifayət körpüsü", "Şah Əli körpüsü"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük tikinti şirkəti hansıdır?", cevaplar: ["Azersu", "AzVirt", "Azersun", "Azərsuq"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük doqqu şirkəti hansıdır?", cevaplar: ["Azersu", "AzVirt", "Azersun", "Azərsuq"], dogruCevap: 0 },
    { soru: "Fotosentez nədir və hansı orqanizmlər bu prosesi həyata keçirirlər?", cevaplar: ["Bitkilərin günəş enerjisi istifadə edərək ərzaq maddəsi yaratması", "Heyvanların oksigen istehsalı", "Bakteriyaların günəş enerjisi ilə hərəkəti", "Küflərin fotosentez etməsi"], dogruCevap: 0 },
    { soru: "Einstein'ın məşhur formula E=mc² nəyi ifadə edir?", cevaplar: ["Sürətin vaxtla dəyişimini", "Kütlə və energetika arasındakı əlaqəni", "Elektrik yükünü", "Işığın sürətini"], dogruCevap: 1 },
    { soru: "Mona Liza tablosunun rəssamı kimdir?", cevaplar: ["Vincent van Qoq", "Leonardo da Vinçi", "Pablo Pikasso", "Michelanjelo"], dogruCevap: 1 },
    { soru: "Kimya sahəsində 'H₂O' hansı birləşiği təmsil edir?", cevaplar: ["Oksigen", "Su", "Hidrogen", "Karbon-dioksid"], dogruCevap: 1 },
    { soru: "Hansı planet Güneş Sistemi'ndə 'Qızıl Planet' kimi tanınır?", cevaplar: ["Yupiter", "Mars", "Saturn", "Venera"], dogruCavab: 1 },
    { soru: "İnsan bədənində neçə dənə ürək var?", cevaplar: ["1", "2", "3", "4"], dogruCavab: 0 },
    { soru: "Hansı məşhur incəsənətçi 'Döşli Tablo' əsərini yaratmışdır?", cevaplar: ["Rembrant", "Vincent van Qoq", "Pablo Pikasso", "Leonardo da Vinçi"], dogruCavab: 0 },
    { soru: "Yerçəkim qüvvəsi hansı fiziki müəssisə tərəfindən aşkar edilmişdir?", cevaplar: ["İsaak Nyuton", "Albert Aynshteyn", "Qalileo Qalilei", "Stephen Hoking"], dogruCavab: 0 },
    { soru: "DNA'nın açar sözü nədir?", cevaplar: ["Dinamik Nükleik Asit", "Deoksiribonükleik Asit", "Duyğusal Nükleik Asit", "Dolça Nükleik Asit"], dogruCavab: 1 },
    { soru: "Hansı planet 'Axşam Yıldızı' və 'Səhər Yıldızı' kimi tanınır?", cevaplar: ["Merkuri", "Venera", "Marss", "Jüpiter"], dogruCavab: 1 },
    { soru: "İnsanın ən böyük orqanı hansıdır?", cevaplar: ["Ürək", "Böyrək", "Beyin", "Cild"], dogruCavab: 3 },
    { soru: "Əməkdaşlığın nümunələri nəzərdə tutularaq həyata keçirilən kimyəvi reaksiyalar hansı adla tanınır?", cevaplar: ["Sintez reaksiyaları", "Oksidasiya reaksiyaları", "Katalizator reaksiyaları", "Metabolizm reaksiyaları"], dogruCavab: 2 },
    { soru: "Hansı planet 'Akılların Planeti' kimi tanınır?", cevaplar: ["Merkuri", "Venera", "Marss", "Yupiter"], dogruCavab: 3 },
    { soru: "Hansı qida maddəsi insanın ən energetik olanıdır?", cevaplar: ["Et", "Tərəvəz", "Şəkər", "Meyvə"], dogruCavab: 0 },
    { soru: "Ələkbər Nəsimi kimdir?", cevaplar: ["Azərbaycanın milli rəssamı", "Azərbaycanın milli yazıçısı", "Azərbaycanın milli musiqiçisi", "Azərbaycanın milli aktyoru"], dogruCavab: 1 },
    { soru: "Azərbaycanın rəsmi pul vahidi hansıdır?", cevaplar: ["Manat", "Dollar", "Avro", "Rubl"], dogruCevap: 0 },
    { soru: "Çəyiz nədir və hansı mədəniyyətlərdə vacibdir?", cevaplar: ["Nevlərin düğün hədiyyəsi, Ərəb mədəniyyətində", "Trafik qaydaları, Alman mədəniyyətində", "Uşaq oyunları, Hind mədəniyyətində", "Yemək reseptləri, İtalyan mədəniyyətində"], dogruCavab: 0 },
    { soru: "Pandemi nədir və son illərdə hansı pandemi dünya miqyasında təsir göstərib?", cevaplar: ["Dünya qızışması, 2020", "Nüvə yarıqanması, 2010", "Salqın xəstəlik, 2019", "Nüvə krizi, 2015"], dogruCavab: 2 },
    { soru: "Mona Liza tablosunun rəssamı kimdir?", cevaplar: ["Vinsent van Qoq", "Leonardo da Vinçi", "Pablo Pikasso", "Miqelanjelo"], dogruCavab: 1 },
    { soru: "Əyri cüt hansı sahələrdə əsaslanır?", cevaplar: ["Ədəbiyyat və rəssamlıq", "Riyaziyyat və mühəndislik", "Musiqi və rəssamlıq", "Kimya və astrofizika"], dogruCavab: 1 },
    { soru: "Einstein'ın məşhur formula E=mc² nəyi ifadə edir?", cevaplar: ["Sürətin zamanla dəyişməsini", "Kütlə və energetika arasındakı əlaqəni", "Elektrik yükünü", "Işığın sürətini"], dogruCavab: 1 },
    { soru: "Çin İncəsənəti hansı materialdan əsasən yaradılır?", cevaplar: ["Dəri", "Qağız", "Sedr", "Mərmər"], dogruCavab: 2 },
    { soru: "İnsan bədənində ürək sayı hansıdır?", cevaplar: ["1", "2", "3", "4"], dogruCavab: 0 },
    { soru: "Sakit qalmağın üsullarından biri nədir?", cevaplar: ["Dərindir nəfəs almaq", "Çox qürur yemək", "Şirinliyi çox tərifləmək", "Həmişə özünün haqqında düşünmək"], dogruCavab: 0 },
    { soru: "Müasir teleskop hansı qəhrəman qadını adına verilib?", cevaplar: ["Marie Curie", "Catherine Johnson", "Helen Keller", "Sally Ride"], dogruCavab: 1 },
    { soru: "Dunyanın ən qocalan dağı hansıdır?", cevaplar: ["Mount Everest", "Kilimanjaro", "Andin dağları", "Rocki dağları"], dogruCavab: 0 },
    { soru: "Hansı əyləncə sahəsi Azərbaycanda ən populyardır?", cevaplar: ["Şahmat", "Dama", "Boks", "Tennis"], dogruCavab: 0 },
    { soru: "Azərbaycanın məşhur gölü hansıdır?", cevaplar: ["Göygöl", "Sarısu", "Ceyranbatan", "Mingəçevir"], dogruCavab: 0 },
    { soru: "Qızılqumşağın başkenti hansı şəhərdir?", cevaplar: ["Bakı", "Tiflis", "Bakü", "Baku"], dogruCevap: 2 },
    { soru: "Həftənin ilk günü hansı gündür?", cevaplar: ["Bazar ertəsi", "Şənbə", "Çərşənbə axşamı", "Pazar"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük gölü hansıdır?", cevaplar: ["Göyçə", "Sarysu", "Mingəçevir", "Ceyranbatan"], dogruCevap: 0 },
    { soru: "İstanbul Boğazı hansı iki qıta arasında yerləşir?", cevaplar: ["Avropa və Asiya", "Afrika və Asiya", "Avropa və Afrika", "Asiya və Avstraliya"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən yüksək dağı hansıdır?", cevaplar: ["Şahdağ", "Tufandağ", "Bazardüzü", "Göy Dağ"], dogruCevap: 0 },
    { soru: "Azərbaycanın paytaxtı hansı şəhərdir?", cevaplar: ["Bakı", "Gəncə", "Sumqayıt", "Lənkəran"], dogruCevap: 0 },
    { soru: "Azərbaycanın rəsmi dili hansıdır?", cevaplar: ["Azərbaycanca", "Rusca", "Türkcə", "İngiliscə"], dogruCevap: 0 },
    { soru: "Azərbaycanın bayrağı hansı rənglərdədir?", cevaplar: ["Mavi və beyaz", "Qırmızı və qara", "Yeşil və sarı", "Göy və qırmızı"], dogruCevap: 3 },
    { soru: "Dünyada ümumi göl sayı hansıdır?", cevaplar: ["1000", "2000", "3000", "4000"], dogruCevap: 2 },
    { soru: "Avropa Birliyi'nin başkenti hansı şəhərdir?", cevaplar: ["Berlin", "Paris", "Brüksel", "Londra"], dogruCevap: 2 },
    { soru: "Azərbaycanda hansı tərəf qədim İpek Yolu üzərində yerləşir?", cevaplar: ["Şərqi", "Qərbi", "Şimalı", "Cənubu"], dogruCevap: 1 },
    { soru: "Dünyanın ən böyük adası hansıdır?", cevaplar: ["Grönland", "Java", "Borneo", "Madagaskar"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük gölü hansıdır?", cevaplar: ["Göyçə", "Sarysu", "Mingəçevir", "Ceyranbatan"], dogruCevap: 0 },
    { soru: "Bir dövr İranın paytaxtı olan, hazırda Azərbaycanın paytaxtı olan şəhər hansıdır?", cevaplar: ["Tabriz", "Şamaxı", "Gəncə", "İsfahan"], dogruCevap: 0 },
    { soru: "Cüzi Yenidən Başlayan Atom Modellər Hansı Atom Modelini Təqdim Edir?", cevaplar: ["Dalton", "Thomson", "Rutherford", "Bohr"], dogruCevap: 3 },
    { soru: "Azərbaycanın İsaqolun adlı gölü hansı rayonda yerləşir?", cevaplar: ["Göyçay", "İsmayıllı", "Şəmkir", "Xızı"], dogruCevap: 1 },
    { soru: "Bir hadisənin gözlənilmədən baş verəcəyini söyləmək üçün necə bir ifadə istifadə edilir?", cevaplar: ["Elektrik", "Qeyri-əlaqəli", "Qərara bağlı", "Təsadüfi"], dogruCevap: 3 },
    { soru: "Fahri Kürkçü kimdir?", cevaplar: ["Azərbaycanın milli rəssamı", "Azərbaycanın milli yazıçısı", "Azərbaycanın milli musiqiçisi", "Azərbaycanın milli aktyoru"], dogruCevap: 1 },
    { soru: "Azərbaycanın ən böyük tikinti sənayesinin məhsuldarlığının olduğu şəhər hansıdır?", cevaplar: ["Bakı", "Sumqayıt", "Gəncə", "Lənkəran"], dogruCevap: 1 },
    { soru: "Azərbaycanın qum bürünün ən böyük ərazisi hansı rayonda yerləşir?", cevaplar: ["Göyçay", "Göygöl", "Şəki", "Goranboy"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən yüksək dağı hansıdır?", cevaplar: ["Şahdağ", "Tufan dağı", "Bazardüzü", "Bozdağ"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük universiteti hansıdır?", cevaplar: ["Bakı Dövlət Universiteti", "Gəncə Dövlət Universiteti", "Xəzər Universiteti", "Azərbaycan Dövlət İqtisad Universiteti"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük müasir tamaşa binaları hansılardır?", cevaplar: ["Baku Crystal Hall", "Heydər Əliyev Mərkəzi", "Mədəniyyət Mərkəzi", "Nizami Gəncəvi adına Milli Azərbaycan Milli Ədəbiyyat Muzeyi"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük şirkəti hansıdır?", cevaplar: ["SOCAR", "Azersu", "AzVirt", "Azərsun"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük gölü hansıdır?", cevaplar: ["Göyçə gölü", "Sarysu gölü", "Ceyranbatan gölü", "Mingəçevir su anbarı"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük neft yatağı hansıdır?", cevaplar: ["Azeri-Chirag-Guneshli", "Şahdeniz", "Umid", "Abşeron"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən uzun çayı hansıdır?", cevaplar: ["Kür", "Araz", "Samur", "Tərtər"], dogruCevap: 0 },
    { soru: "Dünyanın ən böyük ölkəsi hansıdır?", cevaplar: ["Rusiya", "Çin", "ABŞ", "Kanada"], dogruCevap: 0 },
    { soru: "Dünyanın ən uzun nehrinin adı nədir?", cevaplar: ["Nil", "Amazon", "Missisipi", "Yangtze"], dogruCevap: 0 },
    { soru: "Dünyanın ən yüksək dağı hansıdır?", cevaplar: ["Everest", "K2", "Annapurna", "Kilimancaro"], dogruCevap: 0 },
    { soru: "Dünyanın ən böyük çölü hansıdır?", cevaplar: ["Sahara", "Atakama", "Gobi", "Kalahari"], dogruCevap: 0 },
    { soru: "Dünyada kaç ədəd ölkə vardır?", cevaplar: ["100", "150", "200", "195"], dogruCevap: 2 },
    { soru: "Dünyada kaç ədəd qıta mövcuddur?", cevaplar: ["4", "5", "6", "7"], dogruCevap: 1 },
    { soru: "Dünya üzərindəki ən dərin okean hansıdır?", cevaplar: ["Atlantik", "Hind", "Tiksi", "Şimali Ledovit"], dogruCevap: 0 },
    { soru: "Dünya sularının hansı okeanında \"Bermuda üçbucağı\" mövcuddur?", cevaplar: ["Atlantik", "Hind", "Tiksi", "Şimali Ledovit"], dogruCevap: 0 },
    { soru: "Dünyanın ən uzun çayı hansıdır?", cevaplar: ["Amazon", "Nil", "Yangtze", "Missisipi"], dogruCevap: 0 },
    { soru: "Dünyanın ən böyük adası hansıdır?", cevaplar: ["Grönland", "Yava", "Bornéo", "Madagaskar"], dogruCevap: 0 },
    { soru: "Dünya sularının hansı okeanında \"Mariana çukuru\" yerləşir?", cevaplar: ["Pasifik", "Atlantik", "Hind", "Tiksi"], dogruCevap: 0 },
    { soru: "Dünya əhalisinin çoxluğu hansı qıtada yaşayır?", cevaplar: ["Asiya", "Avropa", "Afrika", "Şimali Amerika"], dogruCevap: 0 },
    { soru: "Dünya əhalisinin hansı qismi qurudsuz ərazilərdə yaşayır?", cevaplar: ["Sahara Çölü", "Atacama Çölü", "Gobi Çölü", "Kalahari Çölü"], dogruCevap: 0 },
    { soru: "Dünya sularının hansı okeanında \"Hindistan Yarımadası\" yerləşir?", cevaplar: ["Hind", "Pasifik", "Atlantik", "Tiksi"], dogruCevap: 0 },
    { soru: "Dünyanın ən böyük gölü hansıdır?", cevaplar: ["Kasp", "Superior", "Victoria", "Aral"], dogruCevap: 0 },
    { soru: "Dünyada ən çox qoşquşma zonası hansı okeanda yerləşir?", cevaplar: ["Pasifik", "Atlantik", "Hind", "Tiksi"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən böyük müasir qala qalası hansıdır?", cevaplar: ["Xızı qalası", "Göyqala", "Nizami qalası", "Baku Crystal Hall"], dogruCevap: 0 },
    { soru: "Azərbaycanın ən uzun dənizi hansıdır?", cevaplar: ["Kaspi dəni", "Bakı dəni", "Lənkəran dəni", "Naxçıvan dəni"], dogruCevap: 0 },
]


// Soruları karıştırmak için bir fonksiyon
function karistirSorular(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

karistirSorular(sorular); // Soruları karıştır

var suankiSoruIndex = 0;

function soruyuGoster() {
    if (suankiSoruIndex < sorular.length) {
        // Yeni bir soru gösteriliyor
        var soru = sorular[suankiSoruIndex];
        document.getElementById('soru').textContent = soru.soru;
        for (var i = 0; i < soru.cevaplar.length; i++) {
            document.getElementById('cevap' + (i + 1)).textContent = soru.cevaplar[i];
        }
        isWaitingForNextQuestion = false; // Yeni soru yüklendi, artık beklemiyoruz
    } else {
        document.getElementById('oyun').innerHTML = '<h1>Oyun Bitti!</h1>';
    }
}

function showModal(mesaj) {
    if (!isModalOpen) {
        var modal = document.getElementById("modal");
        var modalMesaj = document.getElementById("modal-mesaj");
        modalMesaj.textContent = mesaj;
        modal.style.display = "block";
        isModalOpen = true;

        setTimeout(function () {
            modal.style.display = "none";
            isModalOpen = false;
            suankiSoruIndex++;
            if (suankiSoruIndex < sorular.length) {
                soruyuGoster(); // Yeni soru göster
            } else {
                document.getElementById('oyun').innerHTML = '<h1>Oyun Bitti!</h1>';
            }
        }, 5000);
    }
}
let isModalOpen = false;
let isWaitingForNextQuestion = false;


function checkAnswerAndShowModal(buttonIndex, userName, profilePictureUrl) {
    var isCorrect = buttonIndex === sorular[suankiSoruIndex].dogruCevap;
    var mesaj = isCorrect ? "Düzgün cavab! - " : "Səhv cavab! - ";
    showModal(mesaj + userName);

    // Profil resmini görüntülemek için resim URL'sini ayarlayın
    document.getElementById('profilePicture').src = profilePictureUrl;
}


var cevapButonlari = document.querySelectorAll('.cevap');
cevapButonlari.forEach(function (buton, index) {
    buton.addEventListener('click', function () {
        checkAnswerAndShowModal(index, "Kullanıcı Adı"); // Burada "Kullanıcı Adı" yerine gerçek kullanıcı adını ekleyin
    });
});

document.addEventListener('DOMContentLoaded', function () {
    soruyuGoster();
});
// // New gift received
connection.on('gift', (data) => {
    let profilePictureUrl = data.profilePictureUrl;
    let userName = data.uniqueId;
    if (!isPendingStreak(data) && data.diamondCount > 0) {
        if (!isModalOpen && !isWaitingForNextQuestion) {
            let giftCount = data.diamondCount * data.repeatCount;
            if (data.giftId === 5827) {
                document.getElementById('cevap1').click();
                checkAnswerAndShowModal(0, userName, profilePictureUrl);
            } else if (data.giftId === 5655) {
                document.getElementById('cevap2').click();
                checkAnswerAndShowModal(1, userName, profilePictureUrl);
            } else if (data.giftId === 5760) {
                document.getElementById('cevap3').click();
                checkAnswerAndShowModal(2, userName, profilePictureUrl);
            } else if (data.giftId === 5269) {
                document.getElementById('cevap4').click();
                checkAnswerAndShowModal(3, userName, profilePictureUrl);
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
