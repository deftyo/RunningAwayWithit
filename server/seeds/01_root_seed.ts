import bcrypt from 'bcrypt'
import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Clear tables in correct order (dependants first)
  await knex('runs').del()
  await knex('goals').del()
  await knex('shoes').del()
  await knex('routes').del()
  await knex('users').del()

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const [user] = await knex('users')
      .insert({ email: 'test@test.com', password: hashedPassword })
      .returning('*')

  // Create shoes
  const [shoe1, shoe2] = await knex('shoes')
      .insert([
        {
          user_id: user.id,
          name: 'Pegasus 41',
          brand: 'Nike',
          notes: 'Daily trainer',
          is_retired: false,
        },
        {
          user_id: user.id,
          name: 'Alphafly 3',
          brand: 'Nike',
          notes: 'Race day only',
          is_retired: false,
        },
      ])
      .returning('*')

  // Create routes (barebones — GPS data to follow in Phase 2)
  const [route1, route2] = await knex('routes')
      .insert([
        {
          user_id: user.id,
          name: 'Parkrun Loop',
          notes: '5km loop around the park',
        },
        {
          user_id: user.id,
          name: 'Canal 10k',
          notes: 'Out and back along the canal',
        },
      ])
      .returning('*')

  // Create goals
  await knex('goals').insert([
    {
      user_id: user.id,
      type: 'distance',
      target: 50,
      period: 'monthly',
    },
    {
      user_id: user.id,
      type: 'runs_count',
      target: 4,
      period: 'weekly',
    },
  ])

  // Insert runs — some with shoe/route associations, some without
  await knex('runs').insert([
    {
      user_id: user.id,
      date: '2026-05-01',
      distance: 5.2,
      duration: 1560,
      avg_pace: 1560 / 5.2,
      notes: 'Easy morning run',
      shoe_id: shoe1.id,
      route_id: route1.id,
    },
    {
      user_id: user.id,
      date: '2026-05-05',
      distance: 10.0,
      duration: 3300,
      avg_pace: 3300 / 10.0,
      notes: 'Long run',
      shoe_id: shoe1.id,
      route_id: route2.id,
    },
    {
      user_id: user.id,
      date: '2026-05-08',
      distance: 5.0,
      duration: 1500,
      avg_pace: 1500 / 5.0,
      notes: 'Parkrun',
      shoe_id: shoe2.id,
      route_id: route1.id,
    },
    {
      user_id: user.id,
      date: '2026-05-12',
      distance: 7.5,
      duration: 2400,
      avg_pace: 2400 / 7.5,
      notes: 'Tempo run',
      shoe_id: shoe1.id,
      route_id: null,
    },
    {
      user_id: user.id,
      date: '2026-05-15',
      distance: 3.0,
      duration: 900,
      avg_pace: 900 / 3.0,
      notes: 'Recovery run',
      shoe_id: null,
      route_id: null,
    },
  ])
}
