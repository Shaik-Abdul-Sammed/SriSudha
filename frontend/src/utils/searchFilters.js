// Search filters and faceted search utilities

export function filterByRole(items, role) {
  return items.filter((item) => item.role === role.toLowerCase())
}

export function filterByDateRange(items, startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return items.filter((item) => {
    const itemDate = new Date(item.createdAt)
    return itemDate >= start && itemDate <= end
  })
}

export function filterByCategory(items, category) {
  return items.filter((item) => item.category === category)
}

export function buildFacets(items) {
  const facets = {
    roles: {},
    categories: {},
    dateRange: {
      oldest: null,
      newest: null,
    },
  }

  items.forEach((item) => {
    // Role facet
    if (item.role) {
      facets.roles[item.role] = (facets.roles[item.role] || 0) + 1
    }

    // Category facet
    if (item.category) {
      facets.categories[item.category] = (facets.categories[item.category] || 0) + 1
    }

    // Date range
    if (item.createdAt) {
      const itemDate = new Date(item.createdAt)
      if (!facets.dateRange.oldest || itemDate < facets.dateRange.oldest) {
        facets.dateRange.oldest = itemDate
      }
      if (!facets.dateRange.newest || itemDate > facets.dateRange.newest) {
        facets.dateRange.newest = itemDate
      }
    }
  })

  return facets
}

export function applyFilters(items, filters) {
  let filtered = items

  if (filters.role) {
    filtered = filterByRole(filtered, filters.role)
  }

  if (filters.category) {
    filtered = filterByCategory(filtered, filters.category)
  }

  if (filters.startDate && filters.endDate) {
    filtered = filterByDateRange(filtered, filters.startDate, filters.endDate)
  }

  if (filters.searchQuery) {
    filtered = filtered.filter((item) =>
      item.query.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      item.routePath.toLowerCase().includes(filters.searchQuery.toLowerCase())
    )
  }

  return filtered
}

export function sortByField(items, field, direction = 'asc') {
  const sorted = [...items]
  sorted.sort((a, b) => {
    let aVal = a[field]
    let bVal = b[field]

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (direction === 'desc') {
      return bVal > aVal ? 1 : bVal < aVal ? -1 : 0
    }
    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
  })

  return sorted
}
