// Reference: https://github.com/MethodGrab/firefox-custom-new-tab-page

const GRE_VOCABULARY_ENDPOINT = `https://gre.economist.com/gre-vocabulary.json`

async function main() {

    let words;
    if (localStorage.GRE_VOCABULARY) {
        words = JSON.parse(localStorage.GRE_VOCABULARY)
    } else {
        const res = await fetch(GRE_VOCABULARY_ENDPOINT, { headers: { accept: 'application/json' } })
        words = await res.json();

        // Cache for later
        localStorage.GRE_VOCABULARY = JSON.stringify(words)
    }

    let {
        word,
        pronunciation,
        definition,
        passage,
        partOfSpeech,
    } = words[Math.floor(Math.random() * words.length)];

    // Some words contain newlines for some reason
    word = word.trim();

    // Remove whitespace and empasize current word
    passage = passage.trim().replace(new RegExp(`(${word}[a-z]*)`, 'gi'), '<em>$1</em>');

    document.body.innerHTML = `
    <div class='vocab'>
      <h1 class='vocab__word' id="vocab__word_id">
        ${word} <img src="img/audio.png" style="width: 40px; height: 40px;" class="audio" alt="Audio" title="Click for Audio"/>
      </h1>
      <hr class='vocab__hr'>
      <blockquote class='vocab__passage'>
        &ldquo;${passage}&rdquo;
      </blockquote>
      <p class='vocab__definition'>
        ${pronunciation} [${partOfSpeech}] &ndash; ${definition}
      </p>
    </div>
  `;

    document.querySelector('.audio').addEventListener("click", function(){

        if ( 'speechSynthesis' in window ) {
            let to_speak = new SpeechSynthesisUtterance(
                document.querySelector('.vocab__word').textContent
            );
            window.speechSynthesis.speak(to_speak);
        }

    });
}

const init = _ => {

	browser.storage.sync.get(null)
		.then( main );
};

init();
