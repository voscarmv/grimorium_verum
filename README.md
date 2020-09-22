# Grimorium Verum
> An infinite platform game about banishing demonic spirits.

![image](https://user-images.githubusercontent.com/2739245/92928704-19051a00-f405-11ea-8322-49c5a103a514.png)

## About the Game

### How to play
Use the ◀️ and ▶️ keys to run and the 🔼 key to jump. To banish the spirits, use the **spacebar**.

You must banish all of the spirits in the realm in order to continue to the next level.

The game ends when you get possessed by an evil spirit. This happens when the spirit touches you while you're not attacking.

If your score is among the top 10 your name will appear at the end of the game.

### Scenes
- **Main game**: The wizard appears in the demon-infested realm. Be careful not to get possessed!
- **Game Over**: The game ends when the wizard becomes possessed. You may record you highest score here.

### Built With

- Node JS
- Webpack
- Javascript ES6
- Babel
- Phaser
- Matter.js

## Live Demo

Check out the live demo [here](https://grimoriumverum.netlify.app/)

## Getting started

### Pre Requisites

- Install Node JS. ([NodeJS Documentation](https://nodejs.org/en/docs/)) 
- Install Webpack. ([Webpack Documentation](https://webpack.js.org/guides/installation/))

### Install

- Clone this repo with `git clone`.
- Enter the repo directory.
- Run `npm install` && `npm start` in your terminal.
- This will open **http://localhost:8080** on your browser.
- Banish those ghouls!

## Game Doc

### Hero

Use the ◀️ and ▶️ keys to run and the 🔼 key to jump. To banish the spirits, use the **spacebar**.

![image](https://user-images.githubusercontent.com/2739245/93560442-d0d78180-f947-11ea-824b-c251e4816c21.png)

### Demon

Jumps around a given area. If it touches you, you're possessed! Game over, Pal.

![image](https://user-images.githubusercontent.com/2739245/93560508-f6648b00-f947-11ea-850e-848202469501.png)

## Scenes

### Main Scene

Run and jumpr around banishing demons. Once you banish all the demons in the level, you pass on to the next level, where there will be more demons than before. The game only ends once you become possessed.

![image](https://user-images.githubusercontent.com/2739245/93560639-404d7100-f948-11ea-90b9-9de426ea3960.png)

### Game over

Once you lose, you can register your final socre with your name here.

![image](https://user-images.githubusercontent.com/2739245/93560747-74289680-f948-11ea-9731-46ca8e0f6dae.png)

### High scores

It contains the top players of the game.

![image](https://user-images.githubusercontent.com/2739245/93560823-9fab8100-f948-11ea-8707-04c26300322e.png)


## Future features
Bring to life more aspects of the Grimorium Verum:

Initially, the game was going to be about collecting magical items necesary for a demonic evocation, however, due to time constraints, it wasn't possible. The evocation would result on a demonic Boss appearing, which the wizard would have to defeat in order to bind it (as is detailed in the grimorium). In the present version, the game only serves to showcase what the game mechanics would look like in a finished version of the Grimorium Verum.

## Author

👤 **Oscar Mier**
- Github: [@voscarmv](https://github.com/voscarmv)
- Twitter: [@voscarmv](https://twitter.com/voscarmv)
- Linkedin: [Oscar Mier](https://www.linkedin.com/in/oscar-mier-072984196/) 


## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check the [issues page](../../issues/).


## Show your support

Give a ⭐️ if you like this project!


## Acknowledgments

Sprite credits:
- [Wizard pack](https://luizmelo.itch.io/wizard-pack)
- [Demon pack (Gothicvania Patreon Collection)](https://ansimuz.itch.io/gothicvania-patreon-collection)
- [Platformer Fantasy Set 2](https://szadiart.itch.io/platformer-fantasy-set2)
- [Michael Hadley's excellent tutorial on Matter.js](https://itnext.io/modular-game-worlds-in-phaser-3-tilemaps-5-matter-physics-platformer-d14d1f614557)

## 📝 License

This project is [MIT](./LICENSE) licensed.
