// Fungsi ajaib untuk mengecilkan ukuran dimensi foto di dalam browser sebelum dikirim ke AI
function resizeImage(file, maxDimension) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Hitung skala rasio agar bentuk/proporsi foto tidak rusak (mencong)
                if (width > height) {
                    if (width > maxDimension) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Ubah canvas menjadi file mentah (Blob) siap kirim
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, file.type, 0.9); // Kualitas 90% (tetap tajam tapi ukurannya sangat ringan)
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

document.getElementById('upscaleBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('imageInput');
    const loadingText = document.getElementById('loadingText');
    const resultImage = document.getElementById('resultImage');

    if (fileInput.files.length === 0) {
        alert("Pilih foto dulu, bro!");
        return;
    }

    loadingText.style.display = "block";
    resultImage.style.display = "none";
    const file = fileInput.files[0];

    try {
        // TAHAP 1: Remas gambar secara otomatis di browser (maksimal panjang/lebar 800px agar server gratisan kuat)
        loadingText.innerText = "Sedang menyesuaikan ukuran gambar di browsermu...";
        const resizedBlob = await resizeImage(file, 800);

        // TAHAP 2: Kirim gambar ringan tersebut ke AI melalui Vercel
        loadingText.innerText = "AI sedang melukis ulang gambarmu agar HD, tunggu ya...";
        const response = await fetch("/api/upscale", {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: resizedBlob
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error("Penyebab asli: " + errorText);
        }

        // TAHAP 3: Terima hasil lukisan ulang dari AI dan tampilkan
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        resultImage.src = imageUrl;
        resultImage.style.display = "block";

    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    } finally {
        loadingText.style.display = "none";
        loadingText.innerText = "AI sedang bekerja, tunggu sebentar ya..."; // Reset teks loading ke semula
    }
});
