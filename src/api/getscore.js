async function getScore() {
  try {
    const getScores = await fetch(
      'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/K0SVL69SNMjEsiqnJpNa/scores/',
      { mode: 'cors' },
    );
    const scoresJSON = await getScores.json();
    return scoresJSON;
  } catch (error) {
    return error;
  }
}

export default getScore;