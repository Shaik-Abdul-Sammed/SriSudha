// Pagination utilities for backend

export function parsePagination(query, defaultLimit = 20) {
  let page = parseInt(query.page) || 1
  let limit = parseInt(query.limit) || defaultLimit

  // Validate and constrain values
  page = Math.max(1, page)
  limit = Math.min(Math.max(1, limit), 100) // Max 100 items per page

  const offset = (page - 1) * limit

  return { page, limit, offset }
}

export function buildPaginationResponse(items, totalCount, page, limit) {
  const totalPages = Math.ceil(totalCount / limit)

  return {
    items,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}

// Cursor-based pagination for better performance with large datasets
export function generateCursor(item, cursorField = 'id') {
  if (!item || !item[cursorField]) return null
  return Buffer.from(JSON.stringify({ [cursorField]: item[cursorField] })).toString(
    'base64',
  )
}

export function decodeCursor(cursor) {
  if (!cursor) return null
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'))
  } catch {
    return null
  }
}

export function buildCursorPaginationResponse(items, hasNextPage, nextCursor) {
  return {
    items,
    pagination: {
      hasNextPage,
      nextCursor,
    },
  }
}

// SQL pagination helper
export function getPaginationSQL(page, limit) {
  const offset = (page - 1) * limit
  return `LIMIT ${limit} OFFSET ${offset}`
}
