async function searchAnime() {
  const query = document.getElementById('searchInput').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = 'جار البحث...';

  const queryBody = {
    query: `
      query ($search: String) {
        Page(perPage: 10) {
          media(search: $search, type: ANIME) {
            id
            title { romaji english native }
            coverImage { large }
            description(asHtml: false)
          }
        }
      }
    `,
    variables: { search: query }
  };

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(queryBody)
    });
    const data = await res.json();
    resultsDiv.innerHTML = '';
    data.data.Page.media.forEach(anime => {
      const title = anime.title.romaji || anime.title.english || anime.title.native;
      const div = document.createElement('div');
      div.className = 'animeItem';
      div.innerHTML = `<img src="${anime.coverImage.large}" alt="Cover" height="100"> <strong>${title}</strong>
                       <button onclick="selectAnime(${anime.id}, '${title}', '${anime.coverImage.large}', \`${anime.description}\`)">اختر</button>`;
      resultsDiv.appendChild(div);
    });
  } catch (err) {
    resultsDiv.innerHTML = 'حدث خطأ أثناء البحث';
    console.error(err);
  }
}

function selectAnime(id, title, cover, desc) {
  localStorage.setItem('animeId', id);
  localStorage.setItem('animeTitle', title);
  localStorage.setItem('animeCover', cover);
  localStorage.setItem('animeDesc', desc);
  window.location.href = 'anime.html';
}
