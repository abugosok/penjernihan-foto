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

    // Ambil file foto mentahnya
    const file = fileInput.files[0];

    try {
        // Mengirim foto ke server Hugging Face (menggunakan model Swin2SR untuk Upscaling)
        const response = await fetch("https://api-inference.huggingface.co/models/caidas/swin2SR-classical-sr-x2-64", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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", // <-- GANTI INI DENGAN TOKEN hf_...
                "Content-Type": file.type
            },
            body: file
        });

        // Cek jika ada error dari server
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Gagal memproses gambar.");
        }

        // Hugging Face mengembalikan langsung file gambar (Blob)
        const blob = await response.blob();
        
        // Mengubah blob gambar menjadi URL yang bisa ditampilkan di web
        const imageUrl = URL.createObjectURL(blob);
        resultImage.src = imageUrl;
        resultImage.style.display = "block";

    } catch (error) {
        console.error("Error:", error);
        alert("Pesan dari AI: " + error.message);
    } finally {
        loadingText.style.display = "none";
    }
});
