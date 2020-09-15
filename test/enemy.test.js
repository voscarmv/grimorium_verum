import EnemyData from '../src/entities/enemydata'

const e = new EnemyData(100, 100, null);

test('Check all entity properties',
  () => {
    expect(e).toHaveProperty('destroyed');
  });