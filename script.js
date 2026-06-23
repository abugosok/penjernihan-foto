document.getElementById('upscaleBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('imageInput');
    const loadingText = document.getElementById('loadingText');
    const resultImage = document.getElementById('resultImage');

    // Cek apakah user sudah memasukkan foto
    if (fileInput.files.length === 0) {
        alert("Pilih foto dulu, bro!");
        return;
    }

    loadingText.style.display = "block";
    resultImage.style.display = "none";

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    try {
        // Kita kembali menggunakan DeepAI, tapi dengan model gratis (Waifu2x)
        const response = await fetch("https://api.deepai.org/api/waifu2x", {
            method: "POST",
            headers: {
                "api-key": "ac31c35b-0536-430b-abd8-f17a65b7bd3a" // <-- GANTI PAKE KUNCI DEEPAI
            },
            body: formData
        });

        const data = await response.json();

        // Jika berhasil, tampilkan hasilnya
        if (data.output_url) {
            resultImage.src = data.output_url;
            resultImage.style.display = "block";
        } else {
            // Tampilkan error asli jika ditolak AI
            const errorMessage = data.err || data.status || "Error dari server DeepAI";
            alert("Pesan dari AI: " + errorMessage);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal koneksi ke server AI.");
    } finally {
        loadingText.style.display = "none";
    }
});
