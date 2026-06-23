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
        // JURUS RAHASIA: Memakai Proxy agar tembus semua provider internet Indonesia
        const proxyUrl = "https://corsproxy.io/?";
        const targetUrl = encodeURIComponent("https://api-inference.huggingface.co/models/caidas/swin2SR-classical-sr-x2-64");
        
        const response = await fetch(proxyUrl + targetUrl, {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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", // <-- JANGAN LUPA MASUKKAN TOKEN KAMU LAGI
                "Content-Type": file.type
            },
            body: file
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Gagal memproses gambar.");
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        resultImage.src = imageUrl;
        resultImage.style.display = "block";

    } catch (error) {
        console.error("Error:", error);
        alert("Pesan dari sistem: " + error.message);
    } finally {
        loadingText.style.display = "none";
    }
});
