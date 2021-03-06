async function saveScore(playerScore) {
  try {
    const saveScores = await fetch(
      'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/K0SVL69SNMjEsiqnJpNa/scores/',
      {
        method: 'POST',
        body: new URLSearchParams(playerScore),
      },
    );
    const scoresJSON = await saveScores.json();
    return scoresJSON;
  } catch (error) {
    return error;
  }
}

export default saveScore;