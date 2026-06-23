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
        // Kita tidak menembak AI langsung, melainkan menembak backend Vercel kita sendiri
        const response = await fetch("/api/upscale", {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file
        });

        if (!response.ok) {
            throw new Error("Gagal memproses gambar di server backend.");
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        resultImage.src = imageUrl;
        resultImage.style.display = "block";

    } catch (error) {
        console.error("Error:", error);
        alert("Pesan: " + error.message);
    } finally {
        loadingText.style.display = "none";
    }
});
