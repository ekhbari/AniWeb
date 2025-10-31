window.onload = function() {
  document.getElementById('animeTitle').innerText = localStorage.getItem('animeTitle');
  document.getElementById('animeCover').src = localStorage.getItem('animeCover');
  document.getElementById('animeDesc').innerText = localStorage.getItem('animeDesc');
}

async function loadEpisodes() {
  const url = document.getElementById('extensionUrl').value;
  const episodesDiv = document.getElementById('episodes');
  episodesDiv.innerHTML = 'جار تحميل الحلقات...';

  try {
    const res = await fetch(url);
    const data = await res.json(); // يفترض أن الرابط يعطي JSON
    episodesDiv.innerHTML = '';
    data.episodes.forEach(ep => {
      const epDiv = document.createElement('div');
      epDiv.innerHTML = `<strong>ح${ep.number}:</strong> <a href="${ep.url}" target="_blank">${ep.url}</a>`;
      episodesDiv.appendChild(epDiv);
    });
  } catch (err) {
    episodesDiv.innerHTML = 'حدث خطأ أثناء تحميل الحلقات';
    console.error(err);
  }
}
