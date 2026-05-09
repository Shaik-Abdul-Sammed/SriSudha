function normalizeSql(text) {
  return String(text || '').replace(/\s+/g, ' ').trim().toLowerCase()
}

function cloneRecentSearch(row) {
  return {
    id: row.id,
    role: row.role,
    query: row.query,
    routePath: row.routePath,
    createdAt: row.createdAt,
  }
}

export function createMemoryPool() {
  const state = {
    nextId: 1,
    recentSearches: [],
  }

  function readRecentSearches(role, limit) {
    return state.recentSearches
      .filter((row) => row.role === role)
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .slice(0, limit)
      .map(cloneRecentSearch)
  }

  function trimRecentSearches(role, limit) {
    const ordered = state.recentSearches
      .filter((row) => row.role === role)
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))

    const keepIds = new Set(ordered.slice(0, limit).map((row) => row.id))
    state.recentSearches = state.recentSearches.filter((row) => row.role !== role || keepIds.has(row.id))
  }

  return {
    async query(text, params = []) {
      const sql = normalizeSql(text)

      if (sql === 'select role, query, route_path as "routepath", created_at as "createdat" from recent_searches where role = $1 order by created_at desc limit 6') {
        const role = String(params[0] || '').trim().toLowerCase()
        const rows = readRecentSearches(role, 6)
        return { rows, rowCount: rows.length }
      }

      if (sql === 'select role, query, route_path as "routepath", created_at as "createdat" from recent_searches order by created_at desc limit 25') {
        const rows = state.recentSearches
          .slice()
          .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
          .slice(0, 25)
          .map(cloneRecentSearch)
        return { rows, rowCount: rows.length }
      }

      if (sql === 'insert into recent_searches (role, query, route_path) values ($1, $2, $3) on conflict (role, route_path) do update set query = excluded.query, created_at = now()') {
        const role = String(params[0] || '').trim().toLowerCase()
        const query = String(params[1] || '').trim()
        const routePath = String(params[2] || '').trim()

        const existing = state.recentSearches.find((row) => row.role === role && row.routePath === routePath)
        if (existing) {
          existing.query = query
          existing.createdAt = new Date().toISOString()
        } else {
          state.recentSearches.push({
            id: state.nextId,
            role,
            query,
            routePath,
            createdAt: new Date().toISOString(),
          })
          state.nextId += 1
        }

        return { rows: [], rowCount: 1 }
      }

      if (sql === 'delete from recent_searches where id in ( select id from recent_searches where role = $1 order by created_at desc offset 6 )') {
        const role = String(params[0] || '').trim().toLowerCase()
        const beforeCount = state.recentSearches.length
        trimRecentSearches(role, 6)
        return { rows: [], rowCount: beforeCount - state.recentSearches.length }
      }

      throw new Error(`Unsupported memory query: ${text}`)
    },
    async end() {
      state.recentSearches = []
    },
  }
}