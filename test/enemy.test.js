require('jest-canvas-mock');
import mainScene from '../src/scenes/main-scene';
import Enemy from '../src/entities/enemy';

const e = new Enemy(mainScene, 12, 12, 123);

test('Check all entity properties',
  () => {
    expect(e).toHaveProperty('destroyed');
  });