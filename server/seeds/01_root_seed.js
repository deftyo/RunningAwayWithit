const bcrypt = require('bcrypt')

exports.seed = async function(knex) {
  // Clear tables in correct order (runs first due to foreign key)
  await knex('runs').del()
  await knex('users').del()

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const [user] = await knex('users')
      .insert({ email: 'test@test.com', password: hashedPassword })
      .returning('*')

  // Insert runs
  await knex('runs').insert([
    {
      user_id: user.id,
      date: '2026-05-01',
      distance: 5.2,
      duration: 1560, // 26 mins — 5:00/km
      avg_pace: 1560 / 5.2,
      notes: 'Easy morning run'
    },
    {
      user_id: user.id,
      date: '2026-05-05',
      distance: 10.0,
      duration: 3300, // 55 mins — 5:30/km
      avg_pace: 3300 / 10.0,
      notes: 'Long run'
    },
    {
      user_id: user.id,
      date: '2026-05-08',
      distance: 5.0,
      duration: 1500, // 25 mins — 5:00/km
      avg_pace: 1500 / 5.0,
      notes: 'Parkrun'
    },
    {
      user_id: user.id,
      date: '2026-05-12',
      distance: 7.5,
      duration: 2400, // 40 mins — 5:20/km
      avg_pace: 2400 / 7.5,
      notes: 'Tempo run'
    },
    {
      user_id: user.id,
      date: '2026-05-15',
      distance: 3.0,
      duration: 900, // 15 mins — 5:00/km
      avg_pace: 900 / 3.0,
      notes: 'Recovery run'
    },
  ])
}
