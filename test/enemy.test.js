import EnemyData from '../src/entities/enemydata';

const e = new EnemyData(100, 100, null);

test('Check all entity properties',
  () => {
    expect(e).toHaveProperty('destroyed');
    expect(e).toHaveProperty('initial_x');
    expect(e).toHaveProperty('range');
    expect(e).toHaveProperty('scene');
    expect(e).toHaveProperty('isTouching');
    expect(e).toHaveProperty('canJump');
    expect(e).toHaveProperty('jumpCooldownTimer');
    expect(e).toHaveProperty('isTouching');
    expect(e).toHaveProperty('isTouching');
    expect(e).toHaveProperty('isTouching');
  });

test('Check all property values',
  () => {
    expect(e.destroyed).toBe(false);
    expect(e.initial_x).toBe(100);
    expect(e.range).toBe(100);
    expect(e.scene).toBe(null);
    expect(e.isTouching).toStrictEqual({ left: false, right: false, ground: false });
    expect(e.canJump).toBe(true);
    expect(e.jumpCooldownTimer).toBe(null);
    expect(e.isTouching.right).toBe(false);
    expect(e.isTouching.left).toBe(false);
    expect(e.isTouching.ground).toBe(false);
  });