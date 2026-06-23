document.getElementById('upscaleBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('imageInput');
    const loadingText = document.getElementById('loadingText');
    const resultImage = document.getElementById('resultImage');

    // Cek apakah user sudah memasukkan foto
    if (fileInput.files.length === 0) {
        alert("Pilih foto dulu, bro!");
        return;
    }

    // Tampilkan teks loading
    loadingText.style.display = "block";
    resultImage.style.display = "none";

    // Siapkan data foto untuk dikirim ke AI
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    try {
        // Mengirim foto ke API DeepAI (Model Super Resolution)
        const response = await fetch("https://api.deepai.org/api/torch-srgan", {
            method: "POST",
            headers: {
                "api-key": "MASUKKAN_API_KEY_KAMU_DI_SINI" // <-- GANTI BAGIAN INI
            },
            body: formData
        });

        const data = await response.json();

        // Jika berhasil, tampilkan hasilnya
        if (data.output_url) {
            resultImage.src = data.output_url;
            resultImage.style.display = "block";
        } else {
            alert("Gagal memproses foto. Coba lagi ya.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan sistem.");
    } finally {
        // Sembunyikan teks loading setelah selesai
        loadingText.style.display = "none";
    }
});
