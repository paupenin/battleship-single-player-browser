/**
  * Application javascript entry
  * 
  * This file is the entry point for the application.
  */
import '../styles/main.scss'
import Game from './game';

const game = new Game(
  document.querySelector<HTMLDivElement>('#app')!
);

console.log(game);
