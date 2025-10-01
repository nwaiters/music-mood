const moodCards = document.querySelectorAll('.emotion');
const audioPlayer = document.getElementById('audio-player');
const songTitle = document.getElementById('song-title');
const coverImage = document.getElementById('cover-image');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');

const moodToPlaylistId = {
    chill: 1976454162,
    hype: 1677006641,
    blue: 1910358422,
};

// Mood button click
moodCards.forEach(card => {
    const button = card.querySelector('button');
    const mood = card.dataset.mood;

    button.addEventListener('click', () => {
        const playlistId = moodToPlaylistId[mood];

        if (!playlistId) {
            alert(`No playlist configured for mood: ${mood}`);
            return;
        }

        const callbackName = `handlePlaylist_${Date.now()}`;
        const playlistUrl = `https://api.deezer.com/playlist/${playlistId}&output=jsonp&callback=${callbackName}`;

        const script = document.createElement('script');
        script.src = playlistUrl;
        document.body.appendChild(script);

        window[callbackName] = function(data) {
            if (!data || !data.tracks || !data.tracks.data.length) {
                alert("No tracks found in the playlist.");
                return;
            }

            const track = data.tracks.data[Math.floor(Math.random() * data.tracks.data.length)];

            audioPlayer.src = track.preview;
            songTitle.textContent = `${track.title} by ${track.artist.name}`;
            coverImage.src = track.album.cover_medium;

            modal.style.display = "flex";
            audioPlayer.play();

            document.body.removeChild(script);
            delete window[callbackName];
        };
    });
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = "none";
    audioPlayer.pause();
});

// Close modal when clicking outside modal content
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
        audioPlayer.pause();
    }
});


