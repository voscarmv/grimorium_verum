import getScore from './getscore';
import saveScore from './savescore'

export default class ScoreScreen extends Phaser.Scene {
  init(data)
  {
      this.finalScore = data.score;
  }

  preload() {
    this.load.html('nameform', "./assets/player_name.html");
  }
  
  create() {
    var text = this.add.text(100,100, 'Final score: ' + this.finalScore);
    let form = `
    <input type="text" placeholder="Player name" id="playername" name="playername">
    <input type="submit" value="Save Score" name="savescore">
    `;
    let again = `
    <input type="submit" value="Play Again" name="again">
    `;
    var element = this.add.dom(400, 200).createFromHTML(form);

    element.addListener('click');

    element.on('click',
      async (event) => {
        try {
          var playername = element.getChildByName('playername');
          if(event.target.name === "savescore") {
            await saveScore(playername.value, this.finalScore);
            let scores = await getScore();
            element.setVisible(false);
            text.setText("Top players:");
            scores.result.sort(
              (a, b) => {
                if(parseInt(a.score) === parseInt(b.score)){
                  return 0
                } else {
                  return(parseInt(a.score) < parseInt(b.score)) ? 1 : -1;
                }
              }
            );

            let j = 200;

            for(let i = 0; i < 10; i += 1){
                this.add.text(200, j, `${scores.result[i].user}`);
                this.add.text(300, j, `${scores.result[i].score}`);
                j += 20;
            }

            let playagain = this.add.dom(250, j+20).createFromHTML(again);
            playagain.addListener('click');
            playagain.on('click',
              (event) => {
                if(event.target.name === "again") {
                  this.scene.start('main', {"reset": true});
                }
              }
            );
          }

        } catch(error) {
          return error;
        }
      }
    );
  }

  update() {

  }

}