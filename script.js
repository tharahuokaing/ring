// ១. កំណត់ប្រភពឯកសាររូបភាព និង បទភ្លេងការបំពាក់ចិញ្ចៀន
const RING_AUDIO_SRC = 'ring.mp3'; // អ្នកអាចប្តូរជាហ្វាយល៍ mp3 របស់អ្នក
const RING_IMAGE_SRC = 'image_ring.png';  /* រូបភាពកម្មវិធីបំពាក់ចិញ្ចៀន */

// បង្កើត Object សម្រាប់គ្រប់គ្រងសំឡេង
const ringAudio = new Audio(RING_AUDIO_SRC);
ringAudio.loop = true; // លេងវិលជុំវិញរហូតដល់ភ្ញៀវបិទ

/**
 * មុខងារបញ្ជាឱ្យចាក់ភ្លេង និងបើកផ្ទាំងទស្សនាពិធីបំពាក់ចិញ្ចៀន
 */
function toggleRingCeremony() {
    if (ringAudio.paused) {
        ringAudio.play()
            .then(() => {
                showRingModal(RING_IMAGE_SRC);
            })
            .catch(error => {
                console.log("Browser ទប់ស្កាត់ការលេងសំឡេងស្វ័យប្រវត្តិ៖ ", error);
                // ប្រសិនបើប្រព័ន្ធទប់សំឡេង ក៏នៅតែបើកផ្ទាំងរូបភាពជូនភ្ញៀវទស្សនាដែរ
                showRingModal(RING_IMAGE_SRC);
            });
    } else {
        ringAudio.pause();
    }
}

/**
 * មុខងារបង្កើតផ្ទាំង Popup Modal ដ៏ស្អាតបង្ហាញរូបភាពមកលើអេក្រង់
 */
function showRingModal(imgSrc) {
    const overlay = document.createElement('div');
    overlay.id = 'ringModal';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.88);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        padding: 20px;
        box-sizing: border-box;
    `;

    const imgElement = document.createElement('img');
    imgElement.src = imgSrc;
    imgElement.alt = "ទិដ្ឋភាពពិធីបំពាក់ចិញ្ចៀនមង្គល";
    imgElement.style.cssText = `
        max-width: 95%;
        max-height: 75vh;
        border: 3px solid #c5a059;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;

    // បង្ហាញអក្សរជំនួសយ៉ាងស្រស់ស្អាត (Fallback) ប្រសិនបើមិនទាន់មានហ្វាយល៍រូបភាពក្នុងម៉ាស៊ីន
    imgElement.onerror = function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.style.cssText = "color:#fff; font-family:'Moul', serif; font-size:1.2rem; margin-bottom:20px; text-align:center; line-height:1.8;";
        placeholder.innerHTML = "💍 កិច្ចសិរីមង្គលបំពាក់ចិញ្ចៀនការ 💍<br><span style='font-size:0.9rem; font-family:Hanuman; color:#c5a059;'>[កំពុងចាក់បទភ្លេងការបំពាក់ចិញ្ចៀនកូនប្រុសកូនស្រី...]</span>";
        overlay.insertBefore(placeholder, closeBtn);
    };

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
        margin-top: 25px;
        background: #800020;
        color: white;
        border: 2px solid #c5a059;
        padding: 10px 25px;
        font-family: 'Hanuman', serif;
        font-weight: bold;
        border-radius: 30px;
        cursor: pointer;
    `;
    closeBtn.textContent = "❌ បិទវិញ និងបញ្ឈប់តន្ត្រី";

    overlay.appendChild(imgElement);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    // កិច្ចការពេលបិទផ្ទាំងត្រឡប់មកវិញ
    const closeModal = () => {
        ringAudio.pause();
        ringAudio.currentTime = 0; // កំណត់បទភ្លេងឱ្យទៅដើមបទឡើងវិញ
        overlay.remove();
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
}
