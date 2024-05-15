<!DOCTYPE html>
<html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TakipBizz user2 + 1 + mvorxan</title>
<meta name="description" content="TakipBiz">
<meta name="author" content="adierebel">
<link rel="stylesheet" href="assets/css/reset.css?v=1.0">
<link rel="stylesheet" href="assets/css/style.css?v=1.0">
<script type="text/javascript" src="words.js"></script>
<script type="text/javascript" src="msg.js"></script>
<script type="text/javascript" src="assets/tts/speakClient.js"></script>
<script type="text/javascript" src="assets/js/jquery.js"></script>
<script type="text/javascript" src="assets/js/socket.io.js"></script>
<script type="text/javascript" src="assets/js/connection.js"></script>
<script type="text/javascript" src="assets/js/app.js"></script>
<script src="https://code.responsivevoice.org/responsivevoice.js?key=2u7Qd768"></script>
<script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>

<head>
  <title>Telefon İçin İkon Oluşturma</title>

</head>
<style>

  #myCanvas {
    display: block;
    margin: 50px auto 0;
    border: 1px solid #ddd;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    background-image: none; /* Arka plan resmi kaldırıldı */
    background-color: rgba(0, 0, 0, 0); /* Tamamen şeffaf arka plan */
    border-radius: 10px;
    padding: 20px;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
}

  #myCanvas:hover {
    border-color: #333;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    transform: scale(1.05);
  }

  /* Canvas içerisindeki metinler için stiller */
  #myCanvas p {
    font-family: "Arial", sans-serif;
    font-size: 24px;
    color: #333;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  /* Canvas içerisindeki şekiller için stiller */
  #myCanvas .square {
    fill: #f44336;
    stroke: #d32f2f;
    stroke-width: 2;
  }

  #myCanvas .circle {
    fill: #2196f3;
    stroke: #1976d2;
    stroke-width: 2;
  }

  #myCanvas .triangle {
    fill: #4caf50;
    stroke: #388e3c;
    stroke-width: 2;
  }

  /* Canvas içerisindeki animasyonlu objeler için stiller */
  #myCanvas .animated-object {
    fill: #ffc107;
    stroke: #ffa000;
    stroke-width: 2;
    animation: move-object 2s ease-in-out alternate infinite;
  }

  @keyframes move-object {
    from {
      transform: translate(0, 0);
    }

    to {
      transform: translate(20px, 20px);
    }
  }



  #loading p {
    text-align: center;
    font-size: 18px;
    margin-bottom: 10px;
  }

  .spinner {
    margin: 0 auto;
    width: 40px;
    height: 40px;
    position: relative;
  }

  .spinner div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 32px;
    height: 32px;
    margin: 4px;
    border: 4px solid #000;
    border-radius: 50%;
    animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #000 transparent transparent transparent;
  }

  .spinner div:nth-child(1) {
    animation-delay: -0.45s;
  }

  .spinner div:nth-child(2) {
    animation-delay: -0.3s;
  }

  .spinner div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }


  .animated-text {
    position: absolute;
    width: 100%;
    width: 440px;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    color: blue;
    z-index: 3;
    background-color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
    /* Metni tek bir satırda tutar */
  }

</style>

<body>
  <!-- <div id="loading">
    <p>Loading...</p>
    <div class="spinner"></div>
  </div> -->
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>

  <canvas id="myCanvas" width="400" height="400" style="display: block; margin: 20px auto 0;">
 
  </canvas>
  <img id="fireworkGif1" src="fire1.gif" style="display: none; position: absolute;">
  <img id="fireworkGif2" src="fire2.gif" style="display: none; position: absolute;">
  <img id="fireworkGif3" src="fire3.gif" style="display: none; position: absolute;">


  <script> 


    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const globalVelocity = { x: 5, y: 5 };
    // const canvas3 = document.getElementById("myCanvas3");
    // const ctx3 = canvas3.getContext("2d");
  

  </script>
</body>

</html>
