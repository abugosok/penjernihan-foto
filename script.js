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
        const response = await fetch("/api/upscale", {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file
        });

        // INI BAGIAN YANG KITA UBAH AGAR ERROR ASLI TERBACA
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error("Penyebab asli: " + errorText);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        resultImage.src = imageUrl;
        resultImage.style.display = "block";

    } catch (error) {
        console.error("Error:", error);
        alert(error.message); // Menampilkan error asli ke layar
    } finally {
        loadingText.style.display = "none";
    }
});
